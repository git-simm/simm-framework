package simm.framework.common.excel;

import cn.hutool.core.io.FileUtil;
import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.stereotype.Service;
import simm.framework.common.file.FileUtils;
import simm.framework.common.model.BizException;
import simm.framework.common.model.ErrorSummary;
import simm.framework.common.model.SguPlanImpFileInfo;
import simm.framework.common.model.SguPlanProdInfo;

import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 异常处理
 */
@Service
@Slf4j
public class ErrorHandler {
    /**
     * 标题行号
     */
    private final static Integer TITLE_ROW_INDEX = 1;

    public void exportErrorInfo(Integer planId, HttpServletResponse response) {
        SguPlanImpFileInfo sguPlanImpFileInfo = getPlanInfo(planId);
        calcErrorInfo(sguPlanImpFileInfo);
        final SguPlanImpFileInfo finalSguPlanImpFileInfo = sguPlanImpFileInfo;
        FileUtils.exportExcel(response, "(错误说明)" + sguPlanImpFileInfo.getFileName()
                , outputStream -> flushErrorInfo(finalSguPlanImpFileInfo.getUrl()
                        , finalSguPlanImpFileInfo.getErrorSummary(), outputStream));
    }

    /**
     * 获取整个计划的内容
     *
     * @param planId
     * @return
     */
    public SguPlanImpFileInfo getPlanInfo(Integer planId) {
        SguPlanImpFileInfo planInfo = new SguPlanImpFileInfo();//getById(planId);
//        if (planInfo == null) {
//            throw new BizException(String.format("找不到上架计划【%s】", planId));
//        }
//        QueryWrapper<SguPlanBaseInfo> filter = new QueryWrapper<>();
//        filter.lambda().eq(SguPlanBaseInfo::getFileId, planId);
//        List<SguPlanBaseInfo> sguPlanBaseInfoList = sguPlanBaseInfoService.list(filter);
//        if (CollectionUtils.isNotEmpty(sguPlanBaseInfoList)) {
//            sguPlanBaseInfoList.forEach(baseInfo -> {
//                //组装明细
//                QueryWrapper<SguPlanProdInfo> param = new QueryWrapper<>();
//                param.lambda().eq(SguPlanProdInfo::getPlanBaseId, baseInfo.getId());
//                baseInfo.setSguPlanProdInfoList(sguPlanProdInfoService.list(param));
//            });
//        }
//        planInfo.setSguPlanBaseInfoList(sguPlanBaseInfoList);
        return planInfo;
    }

    /**
     * 计划错误结果
     *
     * @param planInfo
     */
    public SguPlanImpFileInfo calcErrorInfo(SguPlanImpFileInfo planInfo) {
        ErrorSummary errorSummary = new ErrorSummary();
        //统计有错误的行信息(只导出未关联sgu的数据)
        if (CollectionUtils.isNotEmpty(planInfo.getSguPlanBaseInfoList())) {
            planInfo.getSguPlanBaseInfoList().stream().filter(a -> a.getSguId() == null).forEach(sgu -> {
                List<Integer> rows = sgu.getSguPlanProdInfoList().stream()
                        .filter(p -> p.getRowId() != null).map(p -> p.getRowId()).collect(Collectors.toList());
                if (StringUtils.isNotEmpty(sgu.getRemark())) {
                    Integer minRow = rows.stream().mapToInt(r -> r).min().getAsInt();
                    errorSummary.getErrorRows().addAll(rows);
                    errorSummary.getErrors().put(minRow, sgu.getRemark());
                } else if (CollectionUtils.isNotEmpty(sgu.getSguPlanProdInfoList())) {
                    //获取有异常的商品
                    List<SguPlanProdInfo> prodLists = sgu.getSguPlanProdInfoList().stream()
                            .filter(p -> StringUtils.isNotEmpty(p.getRemark())).collect(Collectors.toList());
                    if (prodLists.size() > 0) {
                        errorSummary.getErrorRows().addAll(rows);
                        prodLists.forEach(p -> errorSummary.getErrors().put(p.getRowId(), p.getRemark()));
                    }
                }
            });
        }
        planInfo.setErrorSummary(errorSummary);
        return planInfo;
    }

    /**
     * 计算错误
     * @param filePath
     * @param errorSummary
     * @param output
     */
    public void flushErrorInfo(String filePath, ErrorSummary errorSummary, OutputStream output) {
        ExcelWriter writer = null;
        try {
            ExcelReader reader;
            if (filePath.startsWith("http")) {
                //读取网络文件
                reader = ExcelUtil.getReader(FileUtils.getInputStream(filePath));
            } else {
                reader = ExcelUtil.getReader(new FileInputStream(FileUtil.file(filePath)));
            }
            writer = reader.getWriter();
            int rows = reader.getSheet().getLastRowNum();
            if (rows < 2) {
                throw new BizException("导入文件格式不对，请核对模版");
            }
            //标题行解析
            Integer remarkCellIndex = 24, skuCellIndex = 3;
            Row title = reader.getOrCreateRow(TITLE_ROW_INDEX);
            Iterator<Cell> cells = title.cellIterator();
            while (cells.hasNext()) {
                Cell cell = cells.next();
                if (StringUtils.isBlank(cell.getStringCellValue())) {
                    remarkCellIndex = cell.getColumnIndex();
                    Cell remark = reader.getOrCreateCell(remarkCellIndex, TITLE_ROW_INDEX);
                    remark.setCellValue("错误说明");
                    break;
                } else if (cell.getStringCellValue().equals("SKU码")) {
                    skuCellIndex = cell.getColumnIndex();
                }
            }
            //添加错误说明(红色外观）
            CellStyle redStyle = writer.getWorkbook().createCellStyle();
            Font redFont = writer.createFont();
            //颜色
            redFont.setColor(Font.COLOR_RED);
            redStyle.setFont(redFont);
            redStyle.setVerticalAlignment(VerticalAlignment.TOP);
            //自动换行
            //redStyle.setWrapText(true);
            final Integer finalSkuCellIndex = skuCellIndex, finalRemarkCellIndex = remarkCellIndex;
            errorSummary.getErrors().forEach((rowIdx, remark) -> {
                Cell skuNumber = reader.getOrCreateCell(finalSkuCellIndex, rowIdx);
                if (StringUtils.isEmpty(skuNumber.getStringCellValue())) {
                    return;
                }
                Cell cell = reader.getOrCreateCell(finalRemarkCellIndex, rowIdx);
                cell.setCellStyle(redStyle);
                cell.setCellValue(remark);
            });
            //正常数据移除(只保留错误数据)(清除行数据)
            Sheet sheet = writer.getSheet();
            for (int r = TITLE_ROW_INDEX + 1; r <= sheet.getLastRowNum(); r++) {
                if (!errorSummary.getErrorRows().contains(r)) {
                    Row row = sheet.getRow(r);
                    if (row != null) {
                        int finalR = r;
                        List<CellRangeAddress> mergeCells = sheet.getMergedRegions().stream()
                                .filter(m -> m.getFirstRow() <= finalR && m.getLastRow() >= finalR).collect(Collectors.toList());
                        for (CellRangeAddress cell : mergeCells) {
                            sheet.removeMergedRegion(sheet.getMergedRegions().indexOf(cell));
                        }
                        sheet.removeRow(row);
                    }
                }
            }
            //移除空白行
            for (int r = TITLE_ROW_INDEX + 1; r < sheet.getLastRowNum(); r++) {
                Cell skuNumber = reader.getCell(skuCellIndex, r);
                if (skuNumber == null || StringUtils.isEmpty(skuNumber.getStringCellValue())) {
                    try {
                        sheet.shiftRows(r + 1, sheet.getLastRowNum(), -1);
                        //下面的行上移后，需要从当前位置继续校验
                        r--;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            if (output != null) {
                writer.flush(output);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }
}
