package simm.boot.test;

import lombok.SneakyThrows;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * WebSocketApplication
 * @author simm
 */
@SpringBootApplication(scanBasePackages = {"simm.boot.test"})
@EnableAsync
@EnableAspectJAutoProxy(exposeProxy = true)
public class WebSocketApplication {
    @SneakyThrows
    public static void main(String[] args) {
        new SpringApplicationBuilder(WebSocketApplication.class).web(WebApplicationType.SERVLET).run(args);
    }
}
