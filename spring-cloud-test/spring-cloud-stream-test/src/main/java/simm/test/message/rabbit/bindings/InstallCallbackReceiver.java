package simm.test.message.rabbit.bindings;

import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import simm.test.message.rabbit.channels.InstallCallbackInputChannel;

/**
 * 消费者服务
 *
 * @author miscr
 */
@EnableBinding(InstallCallbackInputChannel.class)
public class InstallCallbackReceiver {
    /**
     * 消息监听
     *
     * @param message
     */
    @StreamListener(InstallCallbackInputChannel.INPUT)
    private void receiver(Object message) {
        System.out.println("template" + message.toString());
    }
}
