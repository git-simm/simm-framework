package test.simm.webflux.listeners;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import test.simm.webflux.events.WarningEvent;

import java.util.concurrent.TimeUnit;

/**
 * 报警监听
 * @author miscr
 */
@Component
public class WarningListener {
    /**
     * 异步消费消息
     * @param warningEvent
     * @throws InterruptedException
     */
    @Async
    @EventListener
    public void onApplicationEvent(WarningEvent warningEvent) throws InterruptedException {
        TimeUnit.SECONDS.sleep(5);
        System.out.println(warningEvent.getTimestamp()+ " - 收到了消息："+warningEvent.getSource()+" , 内容为："+warningEvent.getMessage());
    }
}
