package simm.test.message.rabbit.channels;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.SubscribableChannel;

/**
 * 安装状态回调接收通道
 * @author miscr
 */
public interface InstallCallbackInputChannel {
    /**
     * 定义通道的名称
     */
    String installCallback = "installCallback";

    /**
     * 定义为输入通道
     * @return
     */
    @Input(installCallback)
    SubscribableChannel input();
}
