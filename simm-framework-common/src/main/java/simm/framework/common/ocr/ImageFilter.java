package simm.framework.common.ocr;

import net.sourceforge.tess4j.util.ImageHelper;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.function.Function;

/**
 * 源自于网络 https://github.com/firefoxmmx2/IDCardIDentify
 */
public class ImageFilter {
  public static Object findDarkestPoint(BufferedImage image) {
    Object darkestPoint = image.getRaster().getDataElements(image.getMinX(), image.getMinY(), null);
    for (int x = image.getMinX(); x < image.getWidth(); x++) {
      for (int y = image.getMinY(); y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int dataBlue = image.getColorModel().getBlue(data);
        int dataRed = image.getColorModel().getRed(data);
        int dataGreen = image.getColorModel().getGreen(data);

        if (dataBlue < image.getColorModel().getBlue(darkestPoint) &&
            dataRed < image.getColorModel().getRed(darkestPoint) &&
            dataGreen < image.getColorModel().getGreen(darkestPoint))
          darkestPoint = data;
      }
    }

    return darkestPoint;
  }

  /**
   * 根据参考颜色,将图像二值化为黑白两种颜色
   *
   * @param image 一张灰度图
   * @param rgb
   */
  public static void convertToBinary(BufferedImage image, int[] rgb) {
    for (int x = image.getMinX(); x < image.getWidth(); x++) {
      for (int y = image.getMinY(); y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int blue = image.getColorModel().getBlue(data);
        int red = image.getColorModel().getRed(data);
        int green = image.getColorModel().getGreen(data);

        if (red > rgb[0] && green > rgb[1] && blue > rgb[2])
          image.setRGB(x, y, Color.white.getRGB());
        else
          image.setRGB(x, y, Color.black.getRGB());
      }
    }
  }

  /**
   * 尝试将图像二值化为黑白两种颜色
   *
   * @param image 一张灰度图
   */
  public static void convertToBinary(BufferedImage image) {
    int[][] grayMatrix=new int[image.getWidth()][image.getHeight()];
//      找到灰度差异扩大点
    for (int x = 0; x < image.getWidth(); x++) {
      for (int y = 0; y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int red = image.getColorModel().getRed(data);
        grayMatrix[x][y]=red;
      }
    }
    for (int x = 0; x < grayMatrix.length; x++) {
      for (int y = 0; y < grayMatrix[x].length; y++) {
      }
    }
    System.out.println(grayMatrix);
  }
  /**
   * 复制图片
   *
   * @param image
   * @return
   */
  public static BufferedImage cloneImage(BufferedImage image) {
    BufferedImage newImage = new BufferedImage(image.getWidth(),image.getHeight(),BufferedImage.TYPE_3BYTE_BGR);
    for (int x = image.getMinX(); x < image.getWidth(); x++) {
      for (int y = image.getMinY(); y < image.getHeight(); y++) {
        Object data=image.getRaster().getDataElements(x,y,null);
        Color color=new Color(image.getColorModel().getRed(data),
            image.getColorModel().getGreen(data),
            image.getColorModel().getBlue(data));
        newImage.setRGB(x,y,color.getRGB());
      }
    }
    return newImage;
  }

  /**
   * 截取图片
   *
   * @param image   原图片
   * @param offsetX 位置x
   * @param offsetY 位置y
   * @param width   宽度
   * @param height  高度
   * @return 截取的图片
   */
  public static BufferedImage subImage(BufferedImage image, int offsetX, int offsetY, int width, int height) {
    return ImageHelper.getSubImage(image, offsetX, offsetY, width, height);
  }

  /**
   * 图片统一灰度值转化
   *
   * @param image
   * @return
   */
  public static BufferedImage convertImageToGrayScale(BufferedImage image) {
    return ImageHelper.convertImageToGrayscale(image);
  }

  /**
   * 图片缩放
   *
   * @param image  图片
   * @param width  新的宽度
   * @param height 新的高度
   * @return 缩放后的图片
   */
  public static BufferedImage imageScale(BufferedImage image, int width, int height) {
    return ImageHelper.getScaledInstance(image, width, height);
  }

  /**
   * 图片对比度设置
   *
   * @param image 原始图片
   * @param rate  对比率
   * @return 调整后的图片(引用原始图片)
   */
  public static BufferedImage imageContrast(BufferedImage image, float rate) {
    for (int x = image.getMinX(); x < image.getWidth(); x++) {
      for (int y = image.getMinY(); y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int dataRed = image.getColorModel().getRed(data);
        int dataBlue = image.getColorModel().getBlue(data);
        int dataGreen = image.getColorModel().getGreen(data);

        float newRed = dataRed * rate > 255 ? 255 : dataRed * rate;
        newRed = newRed < 0 ? 0 : newRed;
        float newGreen = dataGreen * rate > 255 ? 255 : dataGreen * rate;
        newGreen = newGreen < 0 ? 0 : newGreen;
        float newBlue = dataBlue * rate > 255 ? 255 : dataBlue * rate;
        newBlue = newBlue < 0 ? 0 : newBlue;
        Color dataColor = new Color(newRed, newGreen, newBlue);
        image.setRGB(x, y, dataColor.getRGB());
      }
    }

    return image;
  }

  /**
   * 图片亮度调整
   *
   * @param image
   * @param brightness
   * @return
   */
  public static BufferedImage imageBrightness(BufferedImage image, int brightness) {
    for (int x = image.getMinX(); x < image.getWidth(); x++) {
      for (int y = image.getMinY(); y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int dataRed = image.getColorModel().getRed(data);
        int dataBlue = image.getColorModel().getBlue(data);
        int dataGreen = image.getColorModel().getGreen(data);
        int dataAlpha = image.getColorModel().getAlpha(data);
        int newRed = dataRed + brightness > 255 ? 255 : dataRed + brightness;
        newRed = newRed < 0 ? 0 : newRed;
        int newBlue = dataBlue + brightness > 255 ? 255 : dataBlue + brightness;
        newBlue = newBlue < 0 ? 0 : newBlue;
        int newGreen = dataGreen + brightness > 255 ? 255 : dataGreen + brightness;
        newGreen = newGreen < 0 ? 0 : newGreen;
        Color dataColor = new Color(newRed, newGreen, newBlue, dataAlpha);
        image.setRGB(x, y, dataColor.getRGB());
      }
    }

    return image;
  }

  /**
   * 获取图片亮度
   *
   * @param image
   * @return
   */
  public static int imageBrightness(BufferedImage image) {
    long totalRed = 0;
    long totalGreen = 0;
    long totalBlue = 0;
    for (int x = image.getMinX(); x < image.getWidth(); x++) {
      for (int y = image.getMinY(); y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int dataRed = image.getColorModel().getRed(data);
        int dataBlue = image.getColorModel().getBlue(data);
        int dataGreen = image.getColorModel().getGreen(data);
        int dataAlpha = image.getColorModel().getAlpha(data);
        totalRed += dataRed;
        totalGreen += dataGreen;
        totalBlue += dataBlue;
//        totalBrightness += dataColor.getRGB();
      }
    }

    float avgRed = totalRed / (image.getHeight() * image.getWidth());
    float avgGreen = totalGreen / (image.getWidth() * image.getHeight());
    float avgBlue = totalBlue / (image.getWidth() * image.getHeight());

    int avgBrightNess = (int) ((avgRed + avgGreen + avgBlue) / 3);

    return avgBrightNess;
  }

  /**
   * 图片像素RGB差值滤镜
   * @param image
   * @param differenceValue
   * @param excludeFunc
   * @return
   */
  public static BufferedImage imageRGBDifferenceFilter(BufferedImage image, int differenceValue, Function<Integer[],Boolean> excludeFunc) {
    for (int x = image.getMinX(); x < image.getWidth(); x++) {
      for (int y = image.getMinY(); y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int dataRed = image.getColorModel().getRed(data);
        int dataBlue = image.getColorModel().getBlue(data);
        int dataGreen = image.getColorModel().getGreen(data);
        if (differenceValue <= Math.abs(dataRed - dataBlue) &&
            differenceValue <= Math.abs(dataRed - dataGreen) &&
            differenceValue <= Math.abs(dataBlue - dataGreen)) {
          if(excludeFunc!=null && excludeFunc.apply(new Integer[]{dataRed,dataGreen,dataBlue})){
            //是否需要排除这个点
            continue;
          }
//          把超过最大差值的像素涂白
          image.setRGB(x,y,Color.white.getRGB());
        }
      }
    }

    return image;
  }

  public static void removeBrinaryImageNoisePoint(BufferedImage image){
    int[][] grayMatrix=new int[image.getWidth()][image.getHeight()];
//      找到灰度差异扩大点
    for (int x = 0; x < image.getWidth(); x++) {
      for (int y = 0; y < image.getHeight(); y++) {
        Object data = image.getRaster().getDataElements(x, y, null);
        int red = image.getColorModel().getRed(data);
        grayMatrix[x][y]=red;
      }
    }
    for (int x = 0; x < grayMatrix.length; x++) {
      for (int y = 0; y < grayMatrix[x].length; y++) {
        if(grayMatrix[x][y] < 255){
          //判断四周有没有存在像素
          boolean isNoisepoint = true;
          if(x-1>=0){
            isNoisepoint = isNoisepoint && grayMatrix[x-1][y] != 0;
          }
          if(y-1>=0) {
            isNoisepoint = isNoisepoint && grayMatrix[x][y-1] != 0 ;
          }
          if(x+1<grayMatrix.length){
            isNoisepoint = isNoisepoint && grayMatrix[x+1][y] != 0;
          }
          if(y+1<grayMatrix[x].length){
            isNoisepoint = isNoisepoint && grayMatrix[x][y+1] != 0;
          }

          if(isNoisepoint)
            image.setRGB(x,y,Color.white.getRGB());
        }
      }
    }
  }

  /**
   * 涂白大于rgb参数像素
   * @param image 图片
   */
  public static void convertToWhite(BufferedImage image) {
    int interferenceLine = 100;
    int grayInterferenceGt = 73;
    int grayInterferenceLt = 78;
    for (int x = 0; x < image.getWidth(); x++) {
      for (int y = 0; y < image.getHeight(); y++) {
        Object data  = image.getRaster().getDataElements(x,y,null);
        int red = image.getColorModel().getRed(data);
        int green=image.getColorModel().getGreen(data);
        int blue= image.getColorModel().getBlue(data);
        if((red > interferenceLine && green > interferenceLine && blue > interferenceLine)
            || (red > grayInterferenceGt && red < grayInterferenceLt))
          image.setRGB(x,y,Color.white.getRGB());
      }
    }
  }
}
