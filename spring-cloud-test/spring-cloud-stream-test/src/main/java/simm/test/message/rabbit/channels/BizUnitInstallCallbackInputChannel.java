package simm.test.message.rabbit.channels;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.SubscribableChannel;

/**
 * 安装状态回调接收通道
 * @author miscr
 */
public interface BizUnitInstallCallbackInputChannel {
    /**
     * 定义通道的名称
     */
    String INPUT = "bizunit-install-consumer";

    /**
     * 定义为输入通道
     * @return
     */
    @Input(INPUT)
    SubscribableChannel input();
}
