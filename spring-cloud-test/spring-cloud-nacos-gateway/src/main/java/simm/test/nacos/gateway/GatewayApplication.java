package simm.test.nacos.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;


/**
 * @author miscr
 * docs: https://blog.csdn.net/weixin_43517302/article/details/109701269
 * test: http://localhost:8888/service-study-provider/echo/simm
 * qestion: https://blog.csdn.net/csdn2100/article/details/103580286
 * gateway采用webflux架构，与web-starter冲突，需要排除web-starter的引入
 */
@EnableScheduling
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class,args);
//        new SpringApplicationBuilder(GatewayApplication.class).web(WebApplicationType.NONE).run(args);
    }
}
