package test.framework.simm.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试controller
 * @author simm
 */
@RestController
@RequestMapping("test")
public class TestController {
    /**
     * 查询
     * @return
     */
    @RequestMapping("/hello")
    @ResponseBody
    public String search() {
        return "hello world!";
    }
}
