package simm.test.nacos.dubbo.provider;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

/**
 * @author simm
 * test: http://localhost:8070/echo/simm
 */
@SpringBootApplication
@EnableDubbo
public class NacosDubboProviderApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(NacosDubboProviderApplication.class).web(WebApplicationType.NONE).run(args);
    }
}