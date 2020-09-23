package test.framework.simm.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import simm.framework.webutil.limit.Limit;

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
    @Limit(name="search",prefix = "search",key="lock",period = 60,count = 2)
    public String search() {

        return "hello world!";
    }
}
