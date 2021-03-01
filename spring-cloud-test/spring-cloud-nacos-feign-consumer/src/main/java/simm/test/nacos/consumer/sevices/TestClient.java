package simm.test.nacos.consumer.sevices;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("service-provider")
public interface TestClient {
    /**
     * 输出测试
     * @param str
     * @return
     */
    @GetMapping(value = "/echo/{str}")
    String echo(@PathVariable("str") String str);
}
