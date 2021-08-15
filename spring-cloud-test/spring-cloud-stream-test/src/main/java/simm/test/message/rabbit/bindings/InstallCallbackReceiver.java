package simm.test.message.rabbit.bindings;

import com.alibaba.fastjson.JSON;
import com.rabbitmq.client.Channel;
import org.apache.tomcat.jni.User;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import simm.test.message.rabbit.channels.InstallCallbackInputChannel;

import java.io.IOException;
import java.util.List;

/**
 * 消费者服务
 *
 * @author miscr
 */
@EnableBinding({InstallCallbackInputChannel.class})
public class InstallCallbackReceiver {
    /**
     * 消息监听
     *
     * @param message
     */
    @StreamListener(value = InstallCallbackInputChannel.INPUT, condition = "headers['msgType']=='install'")
    private void receiver(@Payload List<String> message,
                          @Header(AmqpHeaders.CHANNEL) Channel channel,
                          @Header(AmqpHeaders.DELIVERY_TAG) Long deliveryTag) {
        try{
            System.out.println("template1:" + JSON.toJSONString(message));
            channel.basicAck(deliveryTag,true);
        }catch (Exception e){
            try {
                channel.basicAck(deliveryTag,false);
            } catch (IOException ioException) {
                System.out.println("确认失败");
            }
        }
    }

    /**
     * 消息监听
     *
     * @param message
     */
    @StreamListener(value = InstallCallbackInputChannel.INPUT, condition = "headers['msgType']=='bizunit'")
    private void receiver2(Object message) {
        System.out.println("template2:" + message.toString());
    }
}
