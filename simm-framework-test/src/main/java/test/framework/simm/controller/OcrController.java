package test.framework.simm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import simm.framework.common.model.BizException;
import simm.framework.common.utils.MyStreamUtils;
import test.framework.simm.model.IDCardInfo;
import test.framework.simm.service.IDCardOcr;

/**
 * ocr操作
 * @author simm
 */
@RequestMapping("ocr")
@Controller
@Slf4j
public class OcrController {
    /**
     * 身份证识别
     */
    //@Autowired
    private IDCardOcr idCardOcr;
    /**
     * 上传文件到文件服务器
     */
    @RequestMapping("upload")
    @ResponseBody
    public IDCardInfo upload(@RequestParam("file") MultipartFile file) throws Exception {
        if (null == file) {
            throw new BizException("上传文件不能为空");
        }
//        String fileName = file.getOriginalFilename();
//        InputStream inputStream =  file.getInputStream();
//        String name = fileName.substring(0, fileName.lastIndexOf("."));
//        String suffix = fileName.substring(fileName.lastIndexOf("."));
//        fileName = String.format("%s(%s)%s", name, UUID.randomUUID(), suffix);
        return idCardOcr.getInfo(MyStreamUtils.streamToBase64(file.getInputStream()));
    }
}
