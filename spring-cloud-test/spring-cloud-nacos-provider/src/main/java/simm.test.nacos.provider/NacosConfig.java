package simm.test.nacos.provider;

import com.netflix.loadbalancer.IRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * nacos配置
 * @author miscr
 */
@Configuration
public class NacosConfig {
    /**
     * nacos负载均衡策略
     * @return
     */
    @Bean
    public IRule loadBalanceRule(){
        return new NacosWeightLoadBalancerRule();
    }
}
