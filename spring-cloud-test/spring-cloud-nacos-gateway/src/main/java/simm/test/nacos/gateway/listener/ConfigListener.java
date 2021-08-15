package simm.test.nacos.gateway.listener;

import com.alibaba.cloud.nacos.NacosConfigManager;
import com.alibaba.cloud.nacos.NacosDiscoveryProperties;
import com.alibaba.cloud.nacos.registry.NacosRegistration;
import com.alibaba.nacos.api.config.listener.Listener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.cloud.client.discovery.event.InstancePreRegisteredEvent;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.context.event.EventListener;
import org.springframework.data.annotation.Reference;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringReader;
import java.util.Properties;
import java.util.concurrent.Executor;

/**
 * 配置变更监听器
 *
 * @author miscr
 */
@Component
public class ConfigListener implements ApplicationRunner {
    @Value("${user:无名}")
    String userName;

    @Value("${spring.profiles.active:prod}")
    String active;

    @Autowired
    private NacosConfigManager nacosConfigManager;

    @EventListener
    public void onInstancePreRegisteredEvent(InstancePreRegisteredEvent instancePreRegisteredEvent) {
        Registration registration = instancePreRegisteredEvent.getRegistration();
        NacosDiscoveryProperties nacosDiscoveryProperties = ((NacosRegistration)registration).getNacosDiscoveryProperties();
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println(String.format("Initial username=%s", userName));

        nacosConfigManager.getConfigService().addListener("db.yaml", active, new Listener() {
            @Override
            public void receiveConfigInfo(String configInfo) {
                Properties properties = new Properties();
                try {
                    properties.load(new StringReader(configInfo));
                } catch (IOException e) {
                    e.printStackTrace();
                }
                System.out.println("config changed: " + properties);
            }

            @Override
            public Executor getExecutor() {
                return null;
            }
        });
    }
}
