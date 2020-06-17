package test.framework.simm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 测试controller
 * @author simm
 */
@Controller
@RequestMapping("test")
public class TestController {
    /**
     * 查询
     * @return
     */
    @RequestMapping("/hello")
    @ResponseBody
    public Object search() {
        return "hello world!";
    }
}
