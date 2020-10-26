package test.framework.simm.service.impl;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ApplicationContextEvent;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * 我的bean生命周期测试
 * @author simm
 */
@Service
public class MybeanService
        implements ApplicationListener<ApplicationContextEvent>
{
    public MybeanService(){
        System.out.println("我是构造函数");
    }
    /**
     * 先执行
     */
    @PostConstruct
    public void init() {
        System.out.println("PostConstruct 的 调用时机");
    }

    /**
     * 后执行
     * @param applicationContextEvent
     */
    @Override
    public void onApplicationEvent(ApplicationContextEvent applicationContextEvent) {
        System.out.println("IDCardOcrImpl.ApplicationContextEvent 的 调用时机");
    }
}
