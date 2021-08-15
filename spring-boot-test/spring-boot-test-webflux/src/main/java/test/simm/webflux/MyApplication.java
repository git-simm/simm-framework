package test.simm.webflux;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.reactive.config.EnableWebFlux;

/**
 * 应用起步类
 * @author miscr
 * docs: https://www.cnblogs.com/niechen/p/9303451.html
 */
@SpringBootApplication
@EnableWebFlux
@EnableAsync
@EnableAspectJAutoProxy(exposeProxy = true)
public class MyApplication {
    public static void main(String[] args) {
        //异步非阻塞网络IO
        //因为 flux选用的是 netty作为运行容器
        //new SpringApplicationBuilder().web(WebApplicationType.REACTIVE).sources(MyApplication.class).run(args);
        SpringApplication.run(MyApplication.class,args);
    }

}
