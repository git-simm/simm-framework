package simm.test.nacos.provider;

import com.alibaba.cloud.nacos.NacosDiscoveryProperties;
import com.alibaba.cloud.nacos.ribbon.NacosServer;
import com.alibaba.nacos.api.exception.NacosException;
import com.alibaba.nacos.api.naming.pojo.Instance;
import com.netflix.client.config.IClientConfig;
import com.netflix.loadbalancer.AbstractLoadBalancerRule;
import com.netflix.loadbalancer.DynamicServerListLoadBalancer;
import com.netflix.loadbalancer.Server;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 基于Nacos权重的负载均衡
 *
 * @Author Administrator
 * @create 2020/10/14 20:54
 */
@Slf4j
public class NacosWeightLoadBalancerRule extends AbstractLoadBalancerRule {

    @Autowired
    private NacosDiscoveryProperties nacosDiscoveryProperties;

    @Override
    public void initWithNiwsConfig(IClientConfig iClientConfig) {
        // 读取配置文件，并初始化NacosWeightLoadBalancerRule
    }

    @Override
    public Server choose(Object o) {
        DynamicServerListLoadBalancer loadBalancer = (DynamicServerListLoadBalancer) getLoadBalancer();
        // 请求的微服务名称
        String applicationName = loadBalancer.getName();
        try {
            // nacos 通过基于权重的负载均衡算法，算出一个健康的服务实例以供调用
            Instance instance = nacosDiscoveryProperties.namingServiceInstance().selectOneHealthyInstance(applicationName);
            return new NacosServer(instance);
        } catch (NacosException e) {
            log.error("获取服务实例异常：{}", e.getMessage());
        }
        return null;
    }
}