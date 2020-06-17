package test.framework.simm;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * @author simm
 */
@SpringBootApplication
@ComponentScan(basePackages = {"test.framework.simm.*"})
@EnableAsync
@EnableAspectJAutoProxy(exposeProxy = true)
public class TestApplication {
    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(TestApplication.class).web(WebApplicationType.SERVLET).run(args);
    }
}
