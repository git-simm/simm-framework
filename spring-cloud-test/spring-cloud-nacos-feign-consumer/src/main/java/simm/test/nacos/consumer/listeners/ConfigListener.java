package simm.test.nacos.consumer.listeners;

import com.alibaba.cloud.nacos.NacosConfigManager;
import com.alibaba.nacos.api.config.listener.Listener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
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
