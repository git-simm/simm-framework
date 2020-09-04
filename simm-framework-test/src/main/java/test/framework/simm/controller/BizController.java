package test.framework.simm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import simm.framework.common.model.BizException;
import simm.framework.common.utils.MyStreamUtils;
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
     * 身份证识别
     */
    @Autowired
    private BizCardOcr bizCardOcr;
    /**
     * 上传文件到文件服务器
     */
    @RequestMapping("upload")
    @ResponseBody
    public BizLicenseInfo upload(@RequestParam("file") MultipartFile file) throws Exception {
        if (null == file) {
            throw new BizException("上传文件不能为空");
        }
        return bizCardOcr.getInfo(MyStreamUtils.streamToBase64(file.getInputStream()));
    }
}
