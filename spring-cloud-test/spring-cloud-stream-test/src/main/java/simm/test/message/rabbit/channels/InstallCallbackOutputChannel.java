package simm.test.message.rabbit.channels;

import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;

/**
 * 生产者通道
 * @author miscr
 */
public interface InstallCallbackOutputChannel {
    /**
     * 定义通道的名称
     */
    String installCallback = "installCallback";

    /**
     * 定义为输入通道
     * @return
     */
    @Output(installCallback)
    MessageChannel output();
}
