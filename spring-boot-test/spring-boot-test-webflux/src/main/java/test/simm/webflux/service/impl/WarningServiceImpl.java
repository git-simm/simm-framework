package test.simm.webflux.service.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import test.simm.webflux.events.WarningEvent;
import test.simm.webflux.service.IWarningService;

import javax.annotation.Resource;

/**
 * 报警服务实现类
 * @author miscr
 */
@Service
public class WarningServiceImpl implements IWarningService {
    @Resource
    ApplicationContext applicationContext;

//    @Async
    @Override
    public void run(String message) {
        applicationContext.publishEvent(new WarningEvent(this,message));
    }
}
