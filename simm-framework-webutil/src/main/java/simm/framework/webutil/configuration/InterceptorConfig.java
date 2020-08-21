package simm.framework.webutil.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import simm.framework.webutil.common.CORSInterceptor;

import javax.annotation.Resource;

/**
 * 拦截器配置
 * @author simm
 */
@Configuration
public class InterceptorConfig {
    @Resource
    RedisTemplate redisTemplate;

    @Bean(name = "corsInterceptor")
    public CORSInterceptor corsInterceptor() {
        return new CORSInterceptor();
    }
}
