package simm.test.message.rabbit.channels;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.SubscribableChannel;
import org.springframework.stereotype.Component;

/**
 * 安装状态回调接收通道
 * @author miscr
 */
public interface InstallCallbackInputChannel {
    /**
     * 定义通道的名称
     */
    String INPUT = "install-consumer";

    /**
     * 定义为输入通道
     * @return
     */
    @Input(INPUT)
    SubscribableChannel input();
}
