package simm.test.nacos.gateway.listener;

import com.netflix.loadbalancer.Server;
import com.netflix.loadbalancer.ServerStatusChangeListener;
import org.springframework.stereotype.Component;

import java.util.Collection;

/**
 * 服务状态变更监听
 * docs: https://www.cnblogs.com/zhangwanhua/p/7543412.html
 * docs: https://blog.csdn.net/feeltouch/article/details/97528245
 * @author miscr
 */
@Component
public class NacosServerStatusChangeListener implements ServerStatusChangeListener {
    @Override
    public void serverStatusChanged(Collection<Server> collection) {
        Collection<Server> tmp = collection;
    }
}
