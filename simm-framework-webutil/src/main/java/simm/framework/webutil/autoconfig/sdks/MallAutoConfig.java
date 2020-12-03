package simm.framework.webutil.autoconfig.sdks;

import com.mingyuanyun.rdc.framework.sdks.mall.IMallClient;
import com.mingyuanyun.rdc.framework.sdks.mall.impl.MallClient;
import com.mingyuanyun.rdc.framework.sdks.mall.module.MallServiceOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.client.RestTemplate;

/**
 * 眀源商城客户端自动装配
 * @author simm
 */
@Configuration
@ConditionalOnProperty(name = "mall.enabled")
@ConditionalOnMissingBean(IMallClient.class)
@Slf4j
@Order(2)
public class MallAutoConfig {
    @Value("${mall.base-address}")
    private String baseAddress;

    /**
     * 实例化客户端
     * @param restTemplate rest模板
     * @return mall客户端
     */
    @Bean
    public IMallClient getMallClient(RestTemplate restTemplate) {
        MallServiceOptions mallServiceOptions = new MallServiceOptions();
        mallServiceOptions.setBaseAddress(baseAddress);
        return new MallClient(restTemplate,mallServiceOptions);
    }
}