package simm.framework.common.ocr;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * https://github.com/firefoxmmx2/IDCardIDentify
 */
public class Ocr {
    public static String doOcr(String lang, BufferedImage image) throws TesseractException {
        Tesseract tesseract = new Tesseract();
        tesseract.setLanguage(lang);
        tesseract.setDatapath("/usr/share/tessdata/");
        return tesseract.doOCR(image);
    }

    public static String doOcr(BufferedImage image) throws TesseractException {
        return doOcr("en+chi_sim", image);
    }

    public static String doOcr(String lang, File imageFile) throws IOException, TesseractException {
        BufferedImage image = ImageIO.read(imageFile);
        return doOcr(lang, image);
    }

    public static String doOcr(File imageFile) throws IOException, TesseractException {
        return doOcr("en+chi_sim", imageFile);
    }

    /**
     * 身份证数据读取
     *
     * @param image 图像
     * @return 识别结果
     * @throws IOException
     */
    public static Map<String, String> doIDCardOcr(BufferedImage image) throws IOException {
        Map<String, String> result = new HashMap<String, String>();
        int[] WHITE = new int[]{255, 255, 255};
        int[] BLACK = new int[]{0, 0, 0};
        int[] GRAY = new int[]{245, 245, 245};
        int[] BIRTH_GRAY = new int[]{73, 73, 73};
        int[] ID_GRAY = new int[]{100, 100, 100};
        int targetContentBrightness = 300;
        int targetBirthBrightness = 300;
        int targetIdBrightness = 300;
        int targetAddressBrightness = 280;
        int targetDifferenceValue = 15;
        BufferedImage bufferedImage = ImageFilter.cloneImage(image);
        bufferedImage = ImageFilter.imageRGBDifferenceFilter(bufferedImage, targetDifferenceValue);
        bufferedImage = ImageFilter.convertImageToGrayScale(bufferedImage);
        //缩放到真实身份证大小
        bufferedImage = ImageFilter.imageScale(bufferedImage, 673, 425);
        // TODO 身份证数据读取未完

        return result;
    }

    public static Map<String, String> doIDCardOcr(File imageFile) throws IOException {
        if (imageFile == null || !imageFile.exists())
            throw new RuntimeException("图片无效或者不存在");
        BufferedImage image = ImageIO.read(imageFile);
        return doIDCardOcr(image);
    }
}
