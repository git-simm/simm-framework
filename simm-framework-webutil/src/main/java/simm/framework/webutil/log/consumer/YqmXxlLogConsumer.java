package simm.framework.webutil.log.consumer;

import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import simm.framework.webutil.config.LogMqConfig;

import java.io.IOException;


/**
 * 用户中心操作日志消费者
 * Created by kuan.zhou on 2020-05-14
 */
@Slf4j
@Component
@RabbitListener(queues = LogMqConfig.YQM_XXL_LOG_QUEUE)
public class YqmXxlLogConsumer {

//    @Autowired
//    private SysOperLogService sysOperLogService;

    @RabbitHandler
    public void process(@Payload String data, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try{
//            SysOperLog sysOperLog = JSON.parseObject(data, SysOperLog.class);
//            sysOperLogService.insertByMq(sysOperLog);
        }catch (Exception e){
            log.error(e.getMessage());
        }finally {
            channel.basicAck(tag, false);
        }

    }
}