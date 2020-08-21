package simm.framework.common.ocr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * 灰度处理工具
 */
public class BrightnessUtil {
    /**
     * 颜色分量转换为RGB值
     *
     * @param alpha
     * @param red
     * @param green
     * @param blue
     * @return
     */
    private static int colorToRGB(int alpha, int red, int green, int blue) {

        int newPixel = 0;
        newPixel += alpha;
        newPixel = newPixel << 8;
        newPixel += red;
        newPixel = newPixel << 8;
        newPixel += green;
        newPixel = newPixel << 8;
        newPixel += blue;

        return newPixel;

    }

//    public static void main(String[] args) throws IOException {
//        grayImage(1,"ff.jpg", "1.jpg");//最大值法灰度化
//        grayImage(2,"ff.jpg", "2.jpg");//最小值法灰度化
//        grayImage(3,"ff.jpg", "3.jpg");//平均值法灰度化
//        grayImage(4,"ff.jpg", "4.jpg");//加权法灰度化
//    }


    /**
     * 图片灰度化的方法
     *
     * @param status    灰度化方法的种类，1表示最大值法，2表示最小值法，3表示均值法，4加权法
     * @param imagePath 需要灰度化的图片的位置
     * @param outPath   灰度化处理后生成的新的灰度图片的存放的位置
     * @throws IOException
     */
    public static void grayImage(int status, String imagePath, String outPath) throws IOException {
        File file = new File(imagePath);
        BufferedImage image = ImageIO.read(file);

        int width = image.getWidth();
        int height = image.getHeight();

        BufferedImage grayImage = new BufferedImage(width, height, image.getType());
        //BufferedImage grayImage = new BufferedImage(width, height,  BufferedImage.TYPE_BYTE_GRAY);
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                int color = image.getRGB(i, j);
                final int r = (color >> 16) & 0xff;
                final int g = (color >> 8) & 0xff;
                final int b = color & 0xff;
                int gray = 0;
                if (status == 1) {
                    gray = getBigger(r, g, b);//最大值法灰度化
                } else if (status == 2) {
                    gray = getSmall(r, g, b);//最小值法灰度化
                } else if (status == 3) {
                    gray = getAvg(r, g, b);//均值法灰度化
                } else if (status == 4) {
                    gray = (int) (0.3 * r + 0.59 * g + 0.11 * b);//加权法灰度化
                }
                System.out.println("像素坐标：" + " x=" + i + "   y=" + j + "   灰度值=" + gray);
                grayImage.setRGB(i, j, colorToRGB(0, gray, gray, gray));
            }
        }
        File newFile = new File(outPath);
        ImageIO.write(grayImage, "jpg", newFile);
    }

    //比较三个数的大小
    public static int getBigger(int x, int y, int z) {
        if (x >= y && x >= z) {
            return x;
        } else if (y >= x && y >= z) {
            return y;
        } else if (z >= x && z >= y) {
            return z;
        } else {
            return 0;
        }
    }

    //比较三个是的大小取最小数
    public static int getSmall(int x, int y, int z) {
        if (x <= y && x <= z) {
            return x;
        } else if (y >= x && y >= z) {
            return y;
        } else if (z >= x && z >= y) {
            return z;
        } else {
            return 0;
        }
    }

    //均值法
    public static int getAvg(int x, int y, int z) {
        int avg = (x + y + z) / 3;
        return avg;
    }
}