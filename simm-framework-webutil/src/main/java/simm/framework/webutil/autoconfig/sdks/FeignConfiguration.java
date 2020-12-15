package simm.framework.webutil.autoconfig.sdks;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;


/**
 * feignClient 的启用
 * @author miscr
 */
@Order(0)
@Configuration
//@EnableFeignClients(basePackages = "com.mingyuanyun")
public class FeignConfiguration {
}
