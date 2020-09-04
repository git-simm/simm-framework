package simm.framework.common.file;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import simm.framework.common.model.BizException;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.function.Consumer;

/**
 * Created by lanhuan on 2016/12/19.
 */
@Slf4j
public class FileUtils {
    /**
     * 判断文件是否是图片
     * @param imageFile
     * @return
     */
    public static boolean isImage(CommonsMultipartFile imageFile) {
        try {
            BufferedImage img = ImageIO.read(imageFile.getInputStream());
            return img != null && img.getWidth(null) > 0 && img.getHeight(null) > 0;
        } catch (Exception e) {
            return false;
        } finally {
        }
    }

    /**
     * 判断文件大小是否超过限定
     * @param file
     * @param size
     * @return
     */
    public static boolean isSmallerThan(CommonsMultipartFile file, Long size) {
        return file.getSize()<size;
    }

    /**
     * 导出excel
     *
     * @param response
     * @param fileName
     * @param output
     */
    public static void exportExcel(HttpServletResponse response, String fileName, Consumer<OutputStream> output) {
        ServletOutputStream servletOutputStream = null;
        try {
            response.setContentType("application/vnd.ms-excel;charset=utf-8");
            response.setHeader("Content-Disposition",
                    "attachment;filename=" + URLEncoder.encode(fileName, "utf-8"));
            servletOutputStream = response.getOutputStream();
            if (output != null) {
                output.accept(servletOutputStream);
            }
            response.flushBuffer();
        } catch (IOException e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
            throw new BizException(e.toString());
        } finally {
            try {
                if (servletOutputStream != null) {
                    servletOutputStream.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
                log.error(e.getMessage(), e);
            }
        }
    }

    /**
     * 获取输入流
     *
     * @param url
     * @return
     * @throws IOException
     */
    public static InputStream getInputStream(String url) throws IOException {
        URL fileUrl = new URL(url);
        HttpURLConnection conn = (HttpURLConnection) fileUrl.openConnection();
        conn.setConnectTimeout(5 * 1000);
        conn.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt)");
        return conn.getInputStream();
    }
}
