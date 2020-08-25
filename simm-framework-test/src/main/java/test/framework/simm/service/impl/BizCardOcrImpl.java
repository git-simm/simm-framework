package test.framework.simm.service.impl;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.util.ClassUtils;
import simm.framework.common.ocr.ImageFilter;
import test.framework.simm.model.BizLicenseInfo;
import test.framework.simm.service.BizCardOcr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.function.BiConsumer;

/**
 * 营业执照信息识别
 *
 * @author simm
 */
@Service
public class BizCardOcrImpl implements BizCardOcr {
    private static int targetBrightness = 280;
    private static int targetDifferenceValue = 15;

    /**
     * 解析身份证信息
     *
     * @param inputStream
     * @return
     * @throws Exception
     */
    @Override
    public BizLicenseInfo getInfo(InputStream inputStream) throws Exception {
        BizLicenseInfo bizLicenseInfo = new BizLicenseInfo();
        String rootPath = ClassUtils.getDefaultClassLoader().getResource("").getPath()+"/tmp";
        Tesseract tesseract = new Tesseract();
        tesseract.setLanguage("chi_sim");
        //读取网络图片
        BufferedImage bufferedImage = ImageFilter.cloneImage(ImageIO.read(inputStream));
        bufferedImage = ImageFilter.imageRGBDifferenceFilter(bufferedImage, targetDifferenceValue, null);
        bufferedImage = ImageFilter.convertImageToGrayScale(bufferedImage);
        //缩放到真实身份证大小
        bufferedImage = ImageFilter.imageScale(bufferedImage, 3150, 1920);
        try (OutputStream outputStream = new FileOutputStream(rootPath+"/bg.jpg")) {
            saveImg(bufferedImage,outputStream);
            getBufferedNameImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/nameImageBefore.jpg");
            getBufferedCapitalImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/capitalImageBefore.jpg");
            getBufferedBizTypeImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/bizTypeImageBefore.jpg");
            getBufferedBuildOnImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/buildOnImageBefore.jpg");
            getBufferedJuridicalImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/juridicalImageBefore.jpg");
            getBufferedBizLimitImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/bizLimitImageBefore.jpg");
            getBufferedBizScopeImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/bizScopeImageBefore.jpg");
            getBufferedAddressImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/addressImageBefore.jpg");
            getBufferedCreditCodeImage(tesseract, bufferedImage, bizLicenseInfo,rootPath+"/creditCodeImageBefore.jpg");
            return bizLicenseInfo;
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }



    /**
     * 获取统一社会信用代码
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedCreditCodeImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        try (OutputStream outputStream = new FileOutputStream(path)) {
            BufferedImage idImage = ImageFilter.subImage(bufferedImage, bufferedImage.getMinX() + 200
                    , 450, 550, 100);
            System.out.println("creditCodeImage 辉度处理");
            handBrightness(idImage, targetBrightness);
            saveImg(idImage, outputStream);
            tesseract.setLanguage("eng");
            // \W 可以配置 非字母和数字，等价于 [^a-zA-Z0-9] (\d \D 小写表示匹配数字，大写表示匹配非数字)
            String idCardNumber = tesseract.doOCR(idImage).replaceAll("[\\W]", "");
            bizLicenseInfo.setCreditCode(idCardNumber);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 获取名称
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     */
    private void getBufferedNameImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 730, 1200, 100);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setName 辉度处理");
            bizLicenseInfo.setName(content);
        });
    }
    /**
     * 获取类型
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBizTypeImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 850, 1200, 100);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setBizType 辉度处理");
            bizLicenseInfo.setBizType(content);
        });
    }
    /**
     * 获取法人信息
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedJuridicalImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 980, 1200, 100);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setJuridical 辉度处理");
            bizLicenseInfo.setJuridical(content);
        });
    }

    /**
     * 获取经营范围
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBizScopeImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 520, 1100, 1330, bufferedImage.getHeight() - 1200);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setBizScope 辉度处理");
            bizLicenseInfo.setBizScope(content);
        });
    }

    /**
     * 获取注册资本
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedCapitalImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 720, bufferedImage.getWidth()-2240, 120);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setCapital 辉度处理");
            bizLicenseInfo.setCapital(content);
        });
    }

    /**
     * 获取成立日期
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBuildOnImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 850, bufferedImage.getWidth()-2240, 80);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setBuildOn 辉度处理");
            bizLicenseInfo.setBuildOn(content);
        });
    }

    /**
     * 获取营业期限
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedBizLimitImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 970, bufferedImage.getWidth()-2240, 100);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setBizLimit 辉度处理");
            bizLicenseInfo.setBizLimit(content);
        });
    }

    /**
     * 获取住所
     * @param tesseract
     * @param bufferedImage
     * @param bizLicenseInfo
     * @param path
     * @throws IOException
     * @throws TesseractException
     */
    private void getBufferedAddressImage(Tesseract tesseract, BufferedImage bufferedImage, BizLicenseInfo bizLicenseInfo, String path) throws IOException, TesseractException {
        BufferedImage buffered = ImageFilter.subImage(bufferedImage, 2170, 1100, bufferedImage.getWidth()-2240, 240);
        getBufferedImage(tesseract,buffered,path,(img,content)->{
            System.out.println("setAddress 辉度处理");
            bizLicenseInfo.setAddress(content);
        });
    }
    /**
     * 获取名称
     * @param tesseract
     * @param buffered
     * @param path
     * @param consumer
     */
    private void getBufferedImage(Tesseract tesseract, BufferedImage buffered, String path, BiConsumer<BufferedImage,String> consumer) throws IOException, TesseractException {
        try (OutputStream outputStream = new FileOutputStream(path)) {
//            addressImage = ImageFilter.imageScale(addressImage, ((int) (addressImage.getWidth() * 2.4) + 1), ((int) (addressImage.getHeight() * 2.4) + 1));
            handBrightness(buffered, targetBrightness);
            saveImg(buffered, outputStream);
            tesseract.setLanguage("chi_sim");
            String result = tesseract.doOCR(buffered);
            //留下中文字符、中文标点符号（）【】、
            String regexStr = "[^\\s\\u4e00-\\u9fa5\\(\\)\\uff08\\uff09\\u3001\\u3010\\u3011\\-0-9]+";
            String content = result.replaceAll(regexStr, "")
                    .replaceAll("\\n", "")
                    .replaceAll(" ", "");
            if(consumer!=null){
                consumer.accept(buffered,content);
            }
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }
    /**
     * 保存图片
     * @param image
     * @param outputStream
     * @throws IOException
     */
    private void saveImg(BufferedImage image,OutputStream outputStream) throws IOException {
        ImageIO.write(image, "jpg", outputStream);
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
