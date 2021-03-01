package simm.test.nacos.gateway;

import com.alibaba.nacos.api.annotation.NacosInjected;
import com.alibaba.nacos.api.naming.NamingService;
import com.alibaba.nacos.api.naming.listener.NamingEvent;
import com.alibaba.nacos.client.config.impl.ServerlistChangeEvent;
import com.alibaba.nacos.common.notify.Event;
import com.alibaba.nacos.common.notify.NotifyCenter;
import com.alibaba.nacos.common.notify.listener.Subscriber;
import com.google.common.collect.Lists;
import com.netflix.loadbalancer.ILoadBalancer;
import com.netflix.loadbalancer.ServerStatusChangeListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.gateway.event.RefreshRoutesEvent;
import org.springframework.cloud.gateway.filter.FilterDefinition;
import org.springframework.cloud.gateway.handler.predicate.PredicateDefinition;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionWriter;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import javax.annotation.Resource;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 自动注册 discovery 服务到 gateway中
 *
 *
 * @author miscr
 */
@Slf4j
@Component
public class RouterAutoRegistry implements InitializingBean {
//    @Autowired
//    private ILoadBalancer loadBalancer;

    @Resource
    private DiscoveryClient discoveryClient;

    @NacosInjected
    private NamingService namingService;

    @Resource
    private RouteDefinitionWriter routeDefinitionWriter;

    @Resource
    private ApplicationEventPublisher publisher;

    @Value("${server.pattern:service-([\\s\\S]*?)provider}")
    private String serverPattern;

    private static Map<String, RouteDefinition> definitions = new ConcurrentHashMap<>();

    @Scheduled(cron = "0/30 * * * * ? ")
    public void registryRouter() {
//        namingService.subscribe();
        log.info("refresh gateway routers");
        discoveryClient.getServices()
                .stream()
                .filter(x -> x.matches(serverPattern))
                .filter(x -> definitions.get(x) == null)
                .forEach(x -> {
                    RouteDefinition definition = new RouteDefinition();
                    definition.setId(x);
                    definition.setUri(URI.create("lb://" + x));

                    // 设置匹配断言 /serviceId/**
                    PredicateDefinition predicateDefinition = new PredicateDefinition();
                    predicateDefinition.setName("Path");
                    Map<String, String> predicateArgs = new HashMap<>(16);
                    predicateArgs.put("pattern", "/" + x + "/**");
                    predicateDefinition.setArgs(predicateArgs);

                    definition.setPredicates(Lists.newArrayList(predicateDefinition));

                    //设置过滤器  RewritePath: /serviceId/** -> /**
                    FilterDefinition filterDefinition = new FilterDefinition();
                    filterDefinition.setName("RewritePath");
                    Map<String, String> filterArgs = new HashMap<>(16);
                    filterArgs.put("regexp", "/" + x + "/(?<segment>.*)");
                    filterArgs.put("replacement", "/$\\{segment}");
                    filterDefinition.setArgs(filterArgs);

                    definition.setFilters(Lists.newArrayList(filterDefinition));

                    routeDefinitionWriter.save(Mono.just(definition)).subscribe();
                    definitions.put(x, definition);

                    log.info("auto registry discovery server router: {} -> {}", x, definition);
                });

        publisher.publishEvent(new RefreshRoutesEvent(this));
    }


    @Override
    public void afterPropertiesSet() {
        // nacos 通知中心
        NotifyCenter.registerSubscriber(new Subscriber(){
            @Override
            public void onEvent(Event event) {
                Event tmp = event;
            }

            @Override
            public Class<? extends Event> subscribeType() {
                return ServerlistChangeEvent.class;
            }
        });
        registryRouter();
    }
}
