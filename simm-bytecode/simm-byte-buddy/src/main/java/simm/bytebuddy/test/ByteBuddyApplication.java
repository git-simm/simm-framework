package simm.bytebuddy.test;

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.agent.ByteBuddyAgent;
import net.bytebuddy.dynamic.loading.ClassReloadingStrategy;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import simm.bytebuddy.test.utils.Log;
import simm.bytebuddy.test.utils.Log4j;

/**
 * @author simm
 */
@SpringBootApplication(scanBasePackages = {"simm.bytebuddy.test"})
@EnableAsync
@EnableAspectJAutoProxy(exposeProxy = true)
public class ByteBuddyApplication {
    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(ByteBuddyApplication.class).web(WebApplicationType.SERVLET).run(args);

        ByteBuddyAgent.install();
        new ByteBuddy().redefine(Log.class)
                .method(ElementMatchers.named("log"))
                .intercept(MethodDelegation.to(Log4j.class))
                .make()
                .load(Thread.currentThread().getContextClassLoader(), ClassReloadingStrategy.fromInstalledAgent());
    }
}
