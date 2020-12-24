package simm.test.message.rabbit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.util.unit.DataSize;
import org.springframework.util.unit.DataUnit;
import simm.test.message.rabbit.channels.InstallCallbackInputChannel;
import simm.test.message.rabbit.channels.InstallCallbackOutputChannel;

import javax.annotation.PostConstruct;
import javax.servlet.MultipartConfigElement;

/**
 * @author simm
 */
@SpringBootApplication(scanBasePackages = {"simm.test.message.rabbit"})
@EnableAspectJAutoProxy(exposeProxy = true)
public class RabbitTestApplication {
    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(RabbitTestApplication.class).web(WebApplicationType.SERVLET).run(args);
    }
}
