package simm.bytebuddy.test.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import simm.bytebuddy.test.utils.Log;

/**
 * 日志控制器
 * @author simm
 */
@RestController
@RequestMapping("/log")
public class LogController {
    @GetMapping("/err")
    public void log(String str){
        Log.log(str);
    };
}
