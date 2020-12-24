package simm.test.message.rabbit.bindings;

import lombok.AllArgsConstructor;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.context.annotation.Bean;
import org.springframework.integration.annotation.InboundChannelAdapter;
import org.springframework.integration.annotation.Poller;
import org.springframework.integration.core.MessageSource;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.messaging.support.MessageBuilder;
import simm.test.message.rabbit.channels.InstallCallbackOutputChannel;

import javax.annotation.PostConstruct;
import java.util.Date;

/**
 * 生产消息
 * @author miscr
 */
@EnableBinding(InstallCallbackOutputChannel.class)
@AllArgsConstructor
public class InstallCallbackSender {
    private final InstallCallbackOutputChannel installCallbackOutputChannel;

    @PostConstruct
    private void sendMessage(){
        installCallbackOutputChannel.output().send(MessageBuilder.withPayload("服务已经启动，准备安装消息").build());
    }
    @Bean
    @InboundChannelAdapter(value = InstallCallbackOutputChannel.installCallback,poller = @Poller(fixedDelay = "2000"))
    public MessageSource<Date> timerMessagaSource(){
        return ()->new GenericMessage<>(new Date());
    }
}
