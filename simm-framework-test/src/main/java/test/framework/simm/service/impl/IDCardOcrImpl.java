package test.framework.simm.service.impl;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import simm.framework.common.ocr.ImageFilter;
import test.framework.simm.model.IDCardInfo;
import test.framework.simm.service.IDCardOcr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

/**
 * 身份证信息识别
 *
 * @author simm
 */
@Service
public class IDCardOcrImpl implements IDCardOcr {

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

    /**
     * 解析身份证信息
     *
     * @param inputStream
     * @return
     * @throws Exception
     */
    @Override
    public IDCardInfo getInfo(InputStream inputStream) throws Exception {
        IDCardInfo idCardInfo = new IDCardInfo();
        File imageFile = new File("D:\\04test\\test\\test1.png");
        //File imageFile = new File(inputStream);
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("D:\\04test\\tessdata");
        tesseract.setLanguage("chi_sim");
        //读取网络图片
        BufferedImage bufferedImage = ImageFilter.cloneImage(ImageIO.read(inputStream));
        bufferedImage = ImageFilter.imageRGBDifferenceFilter(bufferedImage, targetDifferenceValue, null);
//                , rgb -> Arrays.stream(rgb).mapToInt(a -> a).max().getAsInt() < 80);
        bufferedImage = ImageFilter.convertImageToGrayScale(bufferedImage);
        //缩放到真实身份证大小
        bufferedImage = ImageFilter.imageScale(bufferedImage, 673, 425);
        try (OutputStream outputStream = new FileOutputStream(imageFile.getParent() + "/1.jpg")) {
            ImageIO.write(bufferedImage, "jpg", outputStream);
            getBufferedContentImage(tesseract, imageFile, bufferedImage, idCardInfo);
            getBufferedBirthImage(tesseract, imageFile, bufferedImage, idCardInfo);
            getBufferedAddressImage(tesseract, imageFile, bufferedImage, idCardInfo);
            getBufferedIdImage(tesseract, imageFile, bufferedImage, idCardInfo);
            return idCardInfo;
        }
    }

    /**
     * 身份证号解析
     *
     * @param tesseract
     * @param imageFile
     * @param bufferedImage
     * @param idCardInfo
     * @return
     * @throws IOException
     * @throws TesseractException
     */
    private BufferedImage getBufferedIdImage(Tesseract tesseract
            , File imageFile
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo) throws IOException, TesseractException {
        try (OutputStream outputStream = new FileOutputStream(imageFile.getParent() + "/" + "idImageBefore.jpg")) {
            BufferedImage idImage = ImageFilter.subImage(bufferedImage, bufferedImage.getMinX() + 200
                    , 354, bufferedImage.getWidth() - 200, bufferedImage.getHeight() - 354);
            System.out.println("addressImage 辉度处理");
            handBrightness(idImage, targetIdBrightness);
            ImageIO.write(idImage, "jpg", outputStream);
            tesseract.setLanguage("eng");
            String idCardNumber = tesseract.doOCR(idImage).replaceAll("[^0-9xX]", "");
            idCardInfo.setIdNumber(idCardNumber);
            return idImage;
        }
    }

    /**
     * 地址解析
     *
     * @param tesseract
     * @param imageFile
     * @param bufferedImage
     * @param idCardInfo
     * @return
     * @throws IOException
     * @throws TesseractException
     */
    private BufferedImage getBufferedAddressImage(Tesseract tesseract
            , File imageFile
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo) throws IOException, TesseractException {
        try (OutputStream outputStream = new FileOutputStream(imageFile.getParent() + "/" + "addressImageBefore.jpg")) {
            BufferedImage addressImage = ImageFilter.subImage(bufferedImage, bufferedImage.getMinX() + 90, 208, 340, 144);
//            addressImage = ImageFilter.imageScale(addressImage, ((int) (addressImage.getWidth() * 2.4) + 1), ((int) (addressImage.getHeight() * 2.4) + 1));
            System.out.println("addressImage 辉度处理");
            handBrightness(addressImage, targetAddressBrightness);
            ImageIO.write(addressImage, "jpg", outputStream);
            tesseract.setLanguage("chi_sim");
            String result = tesseract.doOCR(addressImage);
            idCardInfo.setAddress(result.replaceAll("[^\\s\\u4e00-\\u9fa5\\-0-9]+", "")
                    .replaceAll("\\n", "")
                    .replaceAll(" ", ""));
            return addressImage;
        }
    }

    /**
     * 内容解析
     *
     * @param tesseract
     * @param imageFile
     * @param bufferedImage
     * @param idCardInfo
     * @return
     * @throws IOException
     * @throws TesseractException
     */
    private BufferedImage getBufferedContentImage(Tesseract tesseract
            , File imageFile
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo) throws IOException, TesseractException {
        try (OutputStream outputStream = new FileOutputStream(imageFile.getParent() + "/" + "contentImageBefore.jpg")) {
            BufferedImage contentImage = ImageFilter.subImage(bufferedImage, bufferedImage.getMinX() + 90, bufferedImage.getMinY(), 323, 154);
            System.out.println("contentImage 辉度处理");
            handBrightness(contentImage, targetContentBrightness);
            ImageIO.write(contentImage, "jpg", outputStream);
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
            return contentImage;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }

    /**
     * 获取缓存图片
     *
     * @param imageFile
     * @param bufferedImage
     * @return
     * @throws IOException
     */
    private BufferedImage getBufferedBirthImage(Tesseract tesseract
            , File imageFile
            , BufferedImage bufferedImage
            , IDCardInfo idCardInfo) throws IOException, TesseractException {
        try (OutputStream outputStream = new FileOutputStream(imageFile.getParent() + "/" + "birthImageBefore.jpg")) {
            //裁剪图片
            BufferedImage birthImage = ImageFilter.subImage(bufferedImage, bufferedImage.getMinX() + 90, 154, 323, 54);
            System.out.println("birthImage 辉度处理");
            handBrightness(birthImage, targetBirthBrightness);
            //解析图片
            ImageIO.write(birthImage, "jpg", outputStream);
            tesseract.setLanguage("eng");
            idCardInfo.setBirth(tesseract.doOCR(birthImage));
            return birthImage;
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
