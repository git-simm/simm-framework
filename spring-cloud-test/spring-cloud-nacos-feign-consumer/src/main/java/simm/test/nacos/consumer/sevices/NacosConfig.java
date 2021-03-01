package simm.test.nacos.consumer.sevices;

import com.alibaba.cloud.nacos.ribbon.NacosRule;
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
        return new NacosRule();
    }
}
