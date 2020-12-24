package simm.test.message.rabbit;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.util.unit.DataSize;
import org.springframework.util.unit.DataUnit;

import javax.servlet.MultipartConfigElement;

/**
 * @author simm
 */
@SpringBootApplication(scanBasePackages = {"simm.test.message.rabbit"})
@EnableAsync
@EnableAspectJAutoProxy(exposeProxy = true)
public class RabbitTestApplication {
    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(RabbitTestApplication.class).web(WebApplicationType.SERVLET).run(args);
    }
}
