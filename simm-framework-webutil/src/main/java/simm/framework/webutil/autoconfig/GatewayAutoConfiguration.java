package simm.framework.webutil.autoconfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.client.RestTemplate;
import simm.framework.common.utils.oauth2.ClientTokenTemplate;
import simm.framework.common.utils.oauth2.GatewayTemplate;
import simm.framework.common.utils.oauth2.GatewayTemplateImpl;

/**
 * 网关服务自动配置
 * @author simm
 * 当应用未自行实现GatewayUtil的bean实例，
 * 同时配置有gatewat.host有ClientTokenUtil的bean实例时自动状态GatewayUtil
 */
@Configuration
@ConditionalOnProperty(name = "gateway.host")
@ConditionalOnMissingBean(GatewayTemplate.class)
@ConditionalOnBean(ClientTokenTemplate.class)
@Order(3)
public class GatewayAutoConfiguration {
    /**
     * 网关配置
     */
    @Value("${gateway.host}")
    private String host;
    /**
     * 网关工具
     * @param restTemplate rest模板类
     * @param clientTokenTemplate 客户端token工具
     * @return
     */
    @Bean
    public GatewayTemplate getGatewayUtil(RestTemplate restTemplate, ClientTokenTemplate clientTokenTemplate){
        return new GatewayTemplateImpl(host,restTemplate, clientTokenTemplate);
    }
}
