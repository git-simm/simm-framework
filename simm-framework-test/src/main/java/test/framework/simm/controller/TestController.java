package test.framework.simm.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import test.framework.simm.service.impl.MybeanService;

/**
 * 测试controller
 * @author simm
 */
@RestController
@RequestMapping("test")
//@Profile("dev")
public class TestController {
    //@Autowired
    private MybeanService mybeanService;
    /**
     * 查询
     * @return
     */
    @RequestMapping("/hello")
    @ResponseBody
//    @Limit(name="search",prefix = "search",key="lock",period = 60,count = 2)
    public String search() {
        return "hello world!";
    }

    /**
     * 查询
     * @return
     */
    @RequestMapping("/async")
    @ResponseBody
//    @Limit(name="async",prefix = "async",key="lock",period = 60,count = 2)
    public String async() {
        return "hello world!";
    }
}
