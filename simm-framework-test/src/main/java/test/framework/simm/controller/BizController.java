package test.framework.simm.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import simm.framework.common.model.BizException;
import test.framework.simm.model.BizLicenseInfo;
import test.framework.simm.service.BizCardOcr;

/**
 * ocr操作
 * @author simm
 */
@RequestMapping("biz")
@Controller
@Slf4j
public class BizController {
    /**
     * 营业执照识别
     */
    @Autowired
    private BizCardOcr bizCardOcr;
    /**
     * 上传文件到文件服务器
     * @param file
     * @param type
     * @return
     * @throws Exception
     */
    @RequestMapping("upload")
    public BizLicenseInfo upload(@RequestParam("file") MultipartFile file, @RequestParam("type") Integer type) throws Exception {
        if (null == file) {
            throw new BizException("上传文件不能为空");
        }
        BizLicenseInfo info = bizCardOcr.getInfoByType(Base64Utils.encodeToString(IOUtils.toByteArray(file.getInputStream())),type);
        return info;
    }
}
