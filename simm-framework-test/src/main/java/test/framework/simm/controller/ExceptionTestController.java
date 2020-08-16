package test.framework.simm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import simm.framework.webutil.model.BizException;

/**
 * 测试异常
 * @author simm
 */
@Controller
@RequestMapping("exception")
public class ExceptionTestController {
    /**
     * 抛出业务异常
     * @return
     */
    @RequestMapping("/biz")
    @ResponseBody
    public Object biz() {
        throw new BizException("这是我的自定义异常");
    }

    /**
     * 抛出程序异常
     * @return
     */
    @RequestMapping("/process")
    @ResponseBody
    public Object process() {
        int i = 0;
        int j = 100/0;
        return true;
    }
}
