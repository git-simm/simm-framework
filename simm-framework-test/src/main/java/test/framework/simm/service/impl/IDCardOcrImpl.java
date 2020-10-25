package test.framework.simm.service.impl;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import simm.framework.common.model.BizException;
import simm.framework.common.ocr.ImageFilter;
import simm.framework.common.utils.ImageOpencvUtils;
import simm.framework.common.utils.MyStreamUtils;
import test.framework.simm.model.IDCardInfo;
import test.framework.simm.service.IDCardOcr;
import test.framework.simm.service.OpenCVService;

import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * 身份证信息识别
 *
 * @author simm
 */
@Service
public class IDCardOcrImpl implements IDCardOcr
//        , ApplicationListener<ApplicationContextEvent>
{

    private static int[] WHITE = new int[]{255, 255, 255};
    private static int[] BLACK = new int[]{0, 0, 0};
    private static int[] GRAY = new int[]{245, 245, 245};
    private static int[] BIRTH_GRAY = new int[]{73, 73, 73};
    private static int[] ID_GRAY = new int[]{100, 100, 100};
    private static int targetContentBrightness = 300;
    private static int targetBirthBrightness = 300;
    private static int targetIdBrightness = 300;
    private static int targetAddressBrightness = 280;
    private static int targetDifferenceValue = 15;

    @Autowired
    private OpenCVService openCVService;
      // 先执行
//    @PostConstruct
//    public void init(){
//        System.out.println("PostConstruct 的 调用时机");
//    }
// 后执行
//    @Override
//    public void onApplicationEvent(ApplicationContextEvent applicationContextEvent) {
//        System.out.println("IDCardOcrImpl.ApplicationContextEvent 的 调用时机");
//    }

    /**
     * 解析身份证信息
     *
     * @param base64Img
     * @return
     * @throws Exception
     */
    @Override
    public IDCardInfo getInfo(String base64Img) throws BizException {
        Boolean outPartImg = openCVService.getSaveTmpImg();
        System.out.println("outPartImg:" + outPartImg);
        IDCardInfo idCardInfo = new IDCardInfo();
        try {
            //身份证图片不需要扶正(用前端切图的方式来做)
            //String base64 = openCVService.correct(base64Img, getImgPath(outPartImg, "/correct.jpg"));
            Tesseract tesseract = new Tesseract();
            tesseract.setLanguage("chi_sim");
            //读取网络图片
            BufferedImage bufferedImage = MyStreamUtils.base64ToBufferedImage(base64Img);
            bufferedImage = ImageFilter.imageRGBDifferenceFilter(bufferedImage, targetDifferenceValue, null);
            bufferedImage = ImageFilter.convertImageToGrayScale(bufferedImage);
            //缩放到真实身份证大小
            bufferedImage = ImageFilter.imageScale(bufferedImage, 673, 425);
            //准备参数

            ImageOpencvUtils.saveImage(bufferedImage, outPartImg ? openCVService.getTmpPath() + "/bg.jpg" : null);
            getBufferedContentImage(tesseract, bufferedImage, idCardInfo, getImgPath(outPartImg, "/contentImageBefore.jpg"));
            getBufferedBirthImage(tesseract, bufferedImage, idCardInfo, getImgPath(outPartImg, "/birthImageBefore.jpg"));
            getBufferedAddressImage(tesseract, bufferedImage, idCardInfo, getImgPath(outPartImg, "/addressImageBefore.jpg"));
            getBufferedIdImage(tesseract, bufferedImage, idCardInfo, getImgPath(outPartImg, "/idImageBefore.jpg"));
            return idCardInfo;
        } catch (TesseractException e) {
            e.printStackTrace();
            throw new BizException("身份证格式不规范，无法识别");
        }
    }

    private String getImgPath(boolean outPartImg, String path) {
        return outPartImg ? openCVService.getTmpPath() + path : null;
    }

    /**
     * 身份证号解析
     *
     * @param tesseract
     * @param bufferedImage
     * @param idCardInfo
     * @return
     * @throws TesseractException
     */
    private int[] getBufferedIdImage(Tesseract tesseract
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo, String temp) throws TesseractException {
        int[] positions = new int[]{bufferedImage.getMinX() + 210, 334, bufferedImage.getWidth() - 210, bufferedImage.getHeight() - 334};
        BufferedImage idImage = ImageFilter.subImage(bufferedImage, positions[0], positions[1], positions[2], positions[3]);
        System.out.println("idImage 辉度处理");
        handBrightness(idImage, targetIdBrightness);
        ImageOpencvUtils.saveImage(idImage, temp);
        tesseract.setLanguage("eng");
        String idCardNumber = tesseract.doOCR(idImage).replaceAll("[^0-9xX]", "");
        idCardInfo.setIdNumber(idCardNumber);
        return positions;
    }

    /**
     * 地址解析
     *
     * @param tesseract
     * @param bufferedImage
     * @param idCardInfo
     * @return
     * @throws TesseractException
     */
    private int[] getBufferedAddressImage(Tesseract tesseract
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo, String temp) throws TesseractException {
        int[] positions = new int[]{bufferedImage.getMinX() + 110, 208, 340, 144};
        BufferedImage addressImage = ImageFilter.subImage(bufferedImage, positions[0], positions[1], positions[2], positions[3]);
//            addressImage = ImageFilter.imageScale(addressImage, ((int) (addressImage.getWidth() * 2.4) + 1), ((int) (addressImage.getHeight() * 2.4) + 1));
        System.out.println("addressImage 辉度处理");
        handBrightness(addressImage, targetAddressBrightness);
        ImageOpencvUtils.saveImage(addressImage, temp);
        tesseract.setLanguage("chi_sim");
        String result = tesseract.doOCR(addressImage);
        idCardInfo.setAddress(result.replaceAll("[^\\s\\u4e00-\\u9fa5\\-0-9]+", "")
                .replaceAll("\\n", "")
                .replaceAll(" ", ""));
        return positions;
    }

    /**
     * 内容解析
     *
     * @param tesseract
     * @param bufferedImage
     * @param idCardInfo
     * @return
     * @throws TesseractException
     */
    private int[] getBufferedContentImage(Tesseract tesseract
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo, String temp) throws TesseractException {
        int[] positions = new int[]{bufferedImage.getMinX() + 110, bufferedImage.getMinY(), 323, 130};
        BufferedImage contentImage = ImageFilter.subImage(bufferedImage, positions[0], positions[1], positions[2], positions[3]);
        System.out.println("contentImage 辉度处理");
        handBrightness(contentImage, targetContentBrightness);
        ImageOpencvUtils.saveImage(contentImage, temp);
        tesseract.setLanguage("chi_sim");
        String result = tesseract.doOCR(contentImage);
        String[] resultArray = result.split("\n");
        String name = resultArray[0].replaceAll("[^\\u4e00-\\u9fa5]", "").trim();
        idCardInfo.setName(name);
        if (resultArray.length > 1) {
            String[] sexAbout = resultArray[1].replaceAll("[^\\u4e00-\\u9fa5 ]", "").trim().split("\\s+");
            if (sexAbout.length > 0) {
                idCardInfo.setSex(sexAbout[0]);
            }
            if (sexAbout.length > 1) {
                idCardInfo.setNation(sexAbout[1]);
            }
        }
        return positions;
    }

    /**
     * 获取缓存图片
     *
     * @param bufferedImage
     * @return
     * @throws IOException
     */
    private int[] getBufferedBirthImage(Tesseract tesseract
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo, String temp) throws TesseractException {
        int[] positions = new int[]{bufferedImage.getMinX() + 110, 154, 300, 54};
        //裁剪图片
        BufferedImage birthImage = ImageFilter.subImage(bufferedImage, positions[0], positions[1], positions[2], positions[3]);
        System.out.println("birthImage 辉度处理");
        handBrightness(birthImage, targetBirthBrightness);
        //解析图片
        ImageOpencvUtils.saveImage(birthImage, temp);
        tesseract.setLanguage("eng");
        idCardInfo.setBirth(tesseract.doOCR(birthImage));
        return positions;
    }

    /**
     * 处理图片辉度
     *
     * @param subImage
     */
    private void handBrightness(BufferedImage subImage, int targetBrightness) {
        int birthBrightness = ImageFilter.imageBrightness(subImage);
        System.out.println("brightness = " + birthBrightness);
        int fixedBrightness = targetBrightness - birthBrightness;
        //辉度处理
        if (fixedBrightness != 0) {
            subImage = ImageFilter.imageBrightness(subImage, fixedBrightness);
        }
        System.out.println("after brightness = " + ImageFilter.imageBrightness(subImage));
    }


}
