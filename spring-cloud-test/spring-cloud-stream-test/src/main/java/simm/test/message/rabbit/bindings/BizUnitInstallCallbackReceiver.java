package simm.test.message.rabbit.bindings;

import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import simm.test.message.rabbit.channels.BizUnitInstallCallbackInputChannel;
import simm.test.message.rabbit.channels.InstallCallbackInputChannel;

/**
 * 消费者服务
 *
 * @author miscr
 */
@EnableBinding(BizUnitInstallCallbackInputChannel.class)
public class BizUnitInstallCallbackReceiver {
    /**
     * 消息监听
     *
     * @param message
     */
    @StreamListener(BizUnitInstallCallbackInputChannel.INPUT)
    private void receiver(Object message) {
        System.out.println("bizunit-install" + message.toString());
    }
}
