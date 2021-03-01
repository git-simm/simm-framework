package simm.test.nacos.gateway.listener;

import com.netflix.loadbalancer.Server;
import com.netflix.loadbalancer.ServerListChangeListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 服务变更监听
 * @author miscr
 */
@Component
public class NacosServerChangeListener implements ServerListChangeListener {
    @Override
    public void serverListChanged(List<Server> list, List<Server> list1) {
        List<Server> tmp = list;
        List<Server> tmp1 = list1;
    }
}
