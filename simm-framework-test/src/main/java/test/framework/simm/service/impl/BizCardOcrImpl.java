package test.framework.simm.service.impl;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import simm.framework.common.model.BizException;
import simm.framework.common.ocr.ImageFilter;
import simm.framework.common.utils.ImageOpencvUtils;
import simm.framework.common.utils.MyStreamUtils;
import test.framework.simm.model.BizLicenseInfo;
import test.framework.simm.service.BizCardOcr;
import test.framework.simm.service.OpenCVService;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.function.BiConsumer;

/**
 * 营业执照信息识别
 *
 * @author simm
 */
@Service
public class BizCardOcrImpl implements BizCardOcr {
    private static int targetBrightness = 260;
    private static int targetDifferenceValue = 15;
    @Autowired
    private OpenCVService openCVService;

    /**
     * 解析身份证信息
     * @param base64Img
     * @return
     * @throws BizException
     */
    @Override
    public BizLicenseInfo getInfo(String base64Img) throws BizException {
        Boolean outPartImg = openCVService.getSaveTmpImg();
        //测试代码，上线需要改成false
        BizLicenseInfo bizLicenseInfo = new BizLicenseInfo();
        try {
            String base64 = openCVService.correct(base64Img);
            Tesseract tesseract = new Tesseract();
            tesseract.setLanguage("chi_sim");
            //读取网络图片
            BufferedImage bufferedImage =  MyStreamUtils.base64ToBufferedImage(base64);

            //不过滤部分颜色
            //bufferedImage = ImageFilter.imageRGBDifferenceFilter(bufferedImage, targetDifferenceValue, null);
            bufferedImage = ImageFilter.convertImageToGrayScale(bufferedImage);
            //缩放到真实身份证大小
            bufferedImage = ImageFilter.imageScale(bufferedImage, 3150, 1920);
            ImageOpencvUtils.saveImage(bufferedImage, getImgPath(outPartImg,"/bg.jpg"));
            getBufferedNameImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg,"/nameImageBefore.jpg"));
            getBufferedCapitalImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg, "/capitalImageBefore.jpg"));
            getBufferedBizTypeImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg,"/bizTypeImageBefore.jpg"));
            getBufferedBuildOnImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg, "/buildOnImageBefore.jpg"));
            getBufferedJuridicalImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg,"/juridicalImageBefore.jpg"));
            getBufferedBizLimitImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg, "/bizLimitImageBefore.jpg"));
            getBufferedBizScopeImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg, "/bizScopeImageBefore.jpg"));
            getBufferedAddressImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg, "/addressImageBefore.jpg"));
            getBufferedCreditCodeImage(tesseract, bufferedImage, bizLicenseInfo, getImgPath(outPartImg, "/creditCodeImageBefore.jpg"));
            return bizLicenseInfo;
        } catch (Exception e) {
            e.printStackTrace();
            throw new BizException(e.getMessage());
        }
    }

    private String getImgPath( boolean outPartImg,String path){
        return outPartImg ? openCVService.getTmpPath() + path : null;
    }


    /**
     * 获取统一社会信用代码
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws TesseractException
     */
    private void getBufferedCreditCodeImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws TesseractException {
        try {
            BufferedImage idImage = ImageFilter.subImage(bufferedImage, bufferedImage.getMinX() + 200
                    , 250, 550, 300);
            System.out.println("creditCodeImage 辉度处理");
            handBrightness(idImage, targetBrightness);
            ImageOpencvUtils.saveImage(idImage, path);
            tesseract.setLanguage("chi_sim");
            // \W 可以配置 非字母和数字，等价于 [^a-zA-Z0-9] (\d \D 小写表示匹配数字，大写表示匹配非数字)
            String idCardNumber = tesseract.doOCR(idImage).replaceAll("[\\W]", "");
            bizLicenseInfo.setCreditCode(idCardNumber);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 获取名称
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     */
    private void getBufferedNameImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 700, 1200, 120);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setName 辉度处理");
            bizLicenseInfo.setName(content);
        });
    }

    /**
     * 获取类型
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBizTypeImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 820, 1200, 130);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setBizType 辉度处理");
            bizLicenseInfo.setBizType(content);
        });
    }

    /**
     * 获取法人信息
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedJuridicalImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 950, 1200, 120);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setJuridical 辉度处理");
            bizLicenseInfo.setJuridical(content);
        });
    }

    /**
     * 获取经营范围
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBizScopeImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 1070, 1330, bufferedImage.getHeight() - 1200);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setBizScope 辉度处理");
            bizLicenseInfo.setBizScope(content);
        });
    }

    /**
     * 获取注册资本
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedCapitalImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 720, bufferedImage.getWidth() - 2400, 120);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setCapital 辉度处理");
            bizLicenseInfo.setCapital(content);
        });
    }

    /**
     * 获取成立日期
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBuildOnImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 850, bufferedImage.getWidth() - 2400, 100);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setBuildOn 辉度处理");
            bizLicenseInfo.setBuildOn(content);
        });
    }

    /**
     * 获取营业期限
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBizLimitImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 970, bufferedImage.getWidth() - 2400, 100);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setBizLimit 辉度处理");
            bizLicenseInfo.setBizLimit(content);
        });
    }

    /**
     * 获取住所
     *
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedAddressImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws Exception {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 1070, bufferedImage.getWidth() - 2240, 270);
        getBufferedImage(tesseract, buffered, path, (img, content) -> {
            System.out.println("setAddress 辉度处理");
            bizLicenseInfo.setAddress(content);
        });
    }

    /**
     * 获取名称
     *
     * @param tesseract
     * @param buffered
     * @param path
     * @param consumer
     */
    private void getBufferedImage(Tesseract tesseract, BufferedImage buffered, String path, BiConsumer<BufferedImage, String> consumer) throws Exception {
        handBrightness(buffered, targetBrightness);
        ImageOpencvUtils.saveImage(buffered, path);
        tesseract.setLanguage("chi_sim");
        String result = tesseract.doOCR(buffered);
        //留下中文字符、中文标点符号（）【】、
        String regexStr = "[^\\s\\u4e00-\\u9fa5\\(\\)\\uff08\\uff09\\u3001\\u3010\\u3011\\-0-9]+";
        String content = result.replaceAll(regexStr, "")
                .replaceAll("\\n", "")
                .replaceAll(" ", "");
        if (consumer != null) {
            consumer.accept(buffered, content);
        }
    }

    /**
     * 处理图片辉度
     *
     * @param subImage
     */
    private void handBrightness(BufferedImage subImage, int targetBrightness) {
        int fixedBrightness;
        int birthBrightness = ImageFilter.imageBrightness(subImage);
        System.out.println("brightness = " + birthBrightness);
        fixedBrightness = targetBrightness - birthBrightness;
        //辉度处理
        if (fixedBrightness != 0) {
            subImage = ImageFilter.imageBrightness(subImage, fixedBrightness);
        }
        System.out.println("after brightness = " + ImageFilter.imageBrightness(subImage));
    }
}
