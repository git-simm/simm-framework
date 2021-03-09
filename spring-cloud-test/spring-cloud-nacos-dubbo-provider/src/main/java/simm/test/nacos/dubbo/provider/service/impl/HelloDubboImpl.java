package simm.test.nacos.dubbo.provider.service.impl;

import org.apache.dubbo.config.annotation.DubboService;
import simm.test.nacos.dubbo.provider.service.IHelloDubbo;

/**
 * dubbo服务
 * @author miscr
 */
@DubboService(version = "${service.version:1.0.0}")
public class HelloDubboImpl implements IHelloDubbo {
    @Override
    public String hello(String who) {
        return "[dubbo] - 你好，"+who;
    }
}
