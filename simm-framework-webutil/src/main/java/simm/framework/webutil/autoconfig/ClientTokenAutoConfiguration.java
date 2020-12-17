package simm.framework.webutil.autoconfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.client.RestTemplate;
import simm.framework.common.lock.redis.RedisDistributedLockTemplate;
import simm.framework.common.utils.oauth2.ClientTokenTemplate;
import simm.framework.common.utils.oauth2.ClientTokenTemplateImpl;
import simm.framework.common.utils.redis.RedisUtil;

/**
 * 网关服务自动配置
 * @author simm
 * 当应用未自行实现GatewayUtil的bean实例，
 * 同时配置有gatewat.host有ClientTokenUtil的bean实例时自动状态GatewayUtil
 */
@Configuration
@ConditionalOnProperty(name = "auth-server.api-name")
@ConditionalOnMissingBean(ClientTokenTemplate.class)
@Order(2)
public class ClientTokenAutoConfiguration {
    /**
     * 网关配置
     */
    @Value("${auth-server.authority}")
    private String authorityUrl;
    @Value("${auth-server.app-key}")
    private String appKey;
    @Value("${auth-server.app-secret}")
    private String appSecret;
    @Value("${auth-server.scope}")
    private String scope;
    /**
     * 客户token获取模板
     * @param restTemplate rest模板类
     * @param redisDistributedLockTemplate redis分布式锁
     * @param redisUtil redis处理工具类
     * @return
     */
    @Bean
    public ClientTokenTemplate getClientTokenTemplate(RestTemplate restTemplate, RedisDistributedLockTemplate redisDistributedLockTemplate, RedisUtil redisUtil){
        ClientTokenTemplate clientTokenTemplate = new ClientTokenTemplateImpl(restTemplate,redisDistributedLockTemplate,redisUtil);
        clientTokenTemplate.setAuthorityUrl(authorityUrl).setAppKey(appKey).setAppSecret(appSecret).setScope(scope);
        return clientTokenTemplate;
    }
}
