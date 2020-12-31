package simm.test.message.rabbit;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * @author simm
 */
@SpringBootApplication(scanBasePackages = {"simm.test.message.rabbit"})
@EnableAspectJAutoProxy(exposeProxy = true)
public class RabbitTest2Application {
    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(RabbitTest2Application.class).web(WebApplicationType.SERVLET).run(args);
    }
}
