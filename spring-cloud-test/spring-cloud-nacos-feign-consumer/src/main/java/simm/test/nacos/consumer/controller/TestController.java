package simm.test.nacos.consumer.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import simm.test.nacos.consumer.sevices.IConfigService;
import simm.test.nacos.consumer.sevices.TestClient;

/**
 * 测试控制器
 * @author simm
 */
@RestController
@AllArgsConstructor
public class TestController {
    private final TestClient testClient;
    private final IConfigService configService;

    @RequestMapping(value = "/echo/{str}", method = RequestMethod.GET)
    public String echo(@PathVariable String str) {
        return testClient.echo(str);
    }

    @GetMapping(value = "/config")
    public String config() {
        return configService.getUser();
    }

    @GetMapping(value = "/db")
    public String db() {
        return configService.getDb();
    }
}