package simm.test.message.rabbit.bindings;

import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.context.annotation.Bean;
import org.springframework.integration.annotation.InboundChannelAdapter;
import org.springframework.integration.annotation.Poller;
import org.springframework.integration.core.MessageSource;
import org.springframework.messaging.support.GenericMessage;
import simm.test.message.rabbit.channels.InstallCallbackOutputChannel;

import java.util.Date;

/**
 * 生产消息
 * @author miscr
 */
@EnableBinding(InstallCallbackOutputChannel.class)
public class InstallCallbackSender {
    @Bean
    @InboundChannelAdapter(value = InstallCallbackOutputChannel.OUTPUT,poller = @Poller(fixedDelay = "2000"))
    public MessageSource<Date> timerMessagaSource(){
        return ()->new GenericMessage<>(new Date());
    }
}
