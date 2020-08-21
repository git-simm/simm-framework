package test.framework.simm.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import simm.framework.common.file.FileUtils;
import simm.framework.webutil.model.BizException;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 文件操作控制器
 */
@RequestMapping("file")
@Controller
@Slf4j
public class FileController {
    /**
     * 文件列表
     */
    private static HashMap<Integer, String> EXCEL_LIST = new HashMap<Integer, String>() {
        {
            put(1, "sgu_batch_delivery_template.xlsx");
            put(2, "sgu_batch_self_template.xlsx");
        }
    };
    private final int imgsize = 50;

    private final int filesize = 50;

    private boolean checkImgSize(int size, long filesize) {
        if (filesize / 1024 / 1024 > size) {
            return true;
        }
        return false;
    }

    @RequestMapping("uploads")
    @ResponseBody
    public Map<String, Object> uploads(@RequestParam("files") CommonsMultipartFile[] files) {
        for (CommonsMultipartFile file : files) {
        }
        return null;
    }

    @RequestMapping("/uploadfile")
    @ResponseBody
    public Map<String, Object> uploadFile(@RequestParam("file") CommonsMultipartFile file) {
        return null;
    }

    /**
     * 上传文件到文件服务器
     */
    @RequestMapping("uploadFile")
    @ResponseBody
    public String upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (null == file) {
            throw new BizException("上传文件不能为空");
        }
        Integer size = this.filesize;
        if (checkImgSize(size, file.getSize())) {
            throw new BizException("文件大小限制在" + size + "M以内");
        }
        String fileName = file.getOriginalFilename();
        InputStream inputStream =  file.getInputStream();
        String name = fileName.substring(0, fileName.lastIndexOf("."));
        String suffix = fileName.substring(fileName.lastIndexOf("."));
        fileName = String.format("%s(%s)%s", name, UUID.randomUUID(), suffix);
        return null;
    }

    /**
     * 下载模板
     *
     * @param response
     */
    @RequestMapping(value = "downloadTemp")
    @ResponseBody
    public void downloadTemp(Integer fileId, HttpServletResponse response) throws IOException {
        String filename = EXCEL_LIST.get(fileId);
        if (StringUtils.isEmpty(filename)) {
            throw new BizException("未找到模板文件");
        }
        InputStream inputStream = null;
        try {
            inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("template/excel/" + filename);
            final InputStream finalInputStream = inputStream;
            FileUtils.exportExcel(response, filename
                    , outputStream -> {
                        try {
                            IOUtils.copy(finalInputStream, outputStream);
                        } catch (IOException e) {
                            e.printStackTrace();
                            throw new BizException(e.toString());
                        }
                    });
            response.flushBuffer();
        } catch (Exception e) {
            e.printStackTrace();
            throw new BizException(e.toString());
        } finally {
            if (inputStream != null) {
                inputStream.close();
            }
        }
    }

}
