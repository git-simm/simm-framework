package simm.framework.webutil.autoconfig.sdks;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

/**
 * @author zhuCan
 * @description feign 配置
 * @since 2020-12-03 11:46
 **/
@Order(0)
@Configuration
@EnableFeignClients(basePackages = "com.mingyuanyun")
public class FeignConfiguration {
}
