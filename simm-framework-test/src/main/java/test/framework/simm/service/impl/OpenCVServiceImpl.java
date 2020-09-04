package test.framework.simm.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.util.IOUtils;
import org.opencv.core.Mat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import simm.framework.common.utils.ImageOpencvUtils;
import simm.framework.common.utils.MyStreamUtils;
import test.framework.simm.service.OpenCVService;

import javax.annotation.PostConstruct;
import java.io.*;

/**
 * opencv服务实现
 *
 * @author simm
 */
@Service
@Slf4j
public class OpenCVServiceImpl implements OpenCVService {
    /**
     * 是否需要保存临时图片
     */
    @Value("${config.saveTmpImg}")
    private Boolean saveTmpImg;

    private String TMP_PATH = "/tmp";

    /**
     * 项目启动时执行
     */
    @PostConstruct
    public void init() throws IOException {
        String os = System.getProperty("os.name").toLowerCase();
        String ext = ".so";
        if (os.indexOf("win") > 0) {
            //window系统加载dll文件
            ext = ".dll";
        }
        //从jar包中把资源文件读取出来
        String dllPath = "/mylib/opencv_java430" + ext;
        //临时图片存在的位置
        File libDir = new File("/mylib");
        if (!libDir.exists()) {
            libDir.mkdir();
        }
        File f = new File(dllPath);
        if (!f.exists()) {
            //dll存放的位置
            try (InputStream in = this.getClass().getClassLoader().getResourceAsStream("lib/opencv_java430" + ext);
                 OutputStream outputStream = new FileOutputStream(f)) {
                IOUtils.copy(in, outputStream);
            }
        }
        System.load(f.getAbsolutePath());
        File file = new File(TMP_PATH);
        if (!file.exists()) {
            file.mkdir();
        }
    }

    /**
     * 获取临时路径
     *
     * @return
     */
    @Override
    public String getTmpPath() {
        return TMP_PATH;
    }

    /**
     * 获取临时路径
     *
     * @return
     */
    @Override
    public Boolean getSaveTmpImg() {
        return saveTmpImg;
    }

    /**
     * 图片裁剪扶正
     *
     * @param base64
     * @return
     */
    @Override
    public String correct(String base64) {
        try {
            Mat src = MyStreamUtils.base642Mat(base64);
            Mat correctMat = ImageOpencvUtils.correct(src, null);
            return MyStreamUtils.catToBase64(correctMat);
        } catch (IOException e) {
            e.printStackTrace();
            log.error("图片扶正失败", e);
            return base64;
        }
    }
}
