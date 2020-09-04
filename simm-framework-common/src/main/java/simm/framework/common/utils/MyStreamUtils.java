package simm.framework.common.utils;

import org.apache.poi.util.IOUtils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.util.Base64Utils;
import sun.misc.BASE64Decoder;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * 流处理工具
 *
 * @author simm
 */
public class MyStreamUtils {
    /**
     * 转换成base64编码
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    public static String streamToBase64(InputStream inputStream) throws IOException {
        return Base64Utils.encodeToString(IOUtils.toByteArray(inputStream));
    }

    /**
     * 装换回编码
     *
     * @param correctMat
     * @return
     */
    public static String catToBase64(Mat correctMat) {
        return bufferToBase64(toByteArray(correctMat));
    }

    /**
     * 转换成base64编码
     *
     * @param buffer
     * @return
     */
    public static String bufferToBase64(byte[] buffer) {
        return Base64Utils.encodeToString(buffer);
    }

    /**
     * base64编码转换成字节数组
     *
     * @param base64Str
     * @return
     */
    public static byte[] base64ToByteArray(String base64Str) {
        return Base64Utils.decodeFromString(base64Str);
    }

    /**
     * base64 编码转换为 BufferedImage
     *
     * @param base64
     * @return
     */
    public static BufferedImage base64ToBufferedImage(String base64) {
        BASE64Decoder decoder = new BASE64Decoder();
        try {
            byte[] bytes1 = decoder.decodeBuffer(base64);
            ByteArrayInputStream bais = new ByteArrayInputStream(bytes1);
            return ImageIO.read(bais);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * mat转换成bufferedImage
     *
     * @param matrix
     * @return
     */
    public static byte[] toByteArray(Mat matrix) {
        MatOfByte mob = new MatOfByte();
        Imgcodecs.imencode(".jpg", matrix, mob);
        return mob.toArray();
    }

    /**
     * mat转换成bufferedImage
     *
     * @param matrix
     * @return
     */
    public static BufferedImage toBufferedImage(Mat matrix) throws IOException {
        byte[] buffer = toByteArray(matrix);
        ByteArrayInputStream bais = new ByteArrayInputStream(buffer);
        return ImageIO.read(bais);
    }

    /**
     * base64转Mat
     *
     * @param base64
     * @return
     * @throws IOException
     */
    public static Mat base642Mat(String base64) throws IOException {

        return bufImg2Mat(base64ToBufferedImage(base64), BufferedImage.TYPE_3BYTE_BGR, CvType.CV_8UC3);
    }

    /**
     * BufferedImage转换成Mat
     *
     * @param original 要转换的BufferedImage
     * @param imgType  bufferedImage的类型 如 BufferedImage.TYPE_3BYTE_BGR
     * @param matType  转换成mat的type 如 CvType.CV_8UC3
     */
    public static Mat bufImg2Mat(BufferedImage original, int imgType, int matType) {
        if (original == null) {
            throw new IllegalArgumentException("original == null");
        }
        // Don't convert if it already has correct type
        if (original.getType() != imgType) {
            // Create a buffered image
            BufferedImage image = new BufferedImage(original.getWidth(), original.getHeight(), imgType);
            // Draw the image onto the new buffer
            Graphics2D g = image.createGraphics();
            try {
                g.setComposite(AlphaComposite.Src);
                g.drawImage(original, 0, 0, null);
                original = image;
            }catch (Exception e){
                e.printStackTrace();
            }finally {
                g.dispose();
            }
        }
        byte[] pixels = ((DataBufferByte) original.getRaster().getDataBuffer()).getData();
        Mat mat = Mat.eye(original.getHeight(), original.getWidth(), matType);
        mat.put(0, 0, pixels);
        return mat;
    }
}
