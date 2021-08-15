package simm.test.nacos.consumer.sevices;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;

/**
 * 配置服务测试
 * @author simm
 */
@Service
@RefreshScope
public class ConfigServiceImpl implements IConfigService {
    @Value("${user:无名}")
    private String user;
    @Value("${db:未知}")
    private String db;
    @Override
    public String getUser() {
        return user;
    }

    @Override
    public String getDb() {
        return db;
    }
}
