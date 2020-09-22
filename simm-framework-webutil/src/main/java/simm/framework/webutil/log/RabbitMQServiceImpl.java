package simm.framework.webutil.log;

import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * RabbitMQ 发送消息service
 * @author simm
 * */
@Slf4j
@Component
public class RabbitMQServiceImpl implements RabbitTemplate.ConfirmCallback, RabbitTemplate.ReturnCallback {

    private RabbitTemplate rabbitTemplate;

    /**
     * 消息模板配置
     * */
    @Autowired
    public RabbitMQServiceImpl(RabbitTemplate rabbitTemplate) {
        rabbitTemplate.setConfirmCallback(this);
        rabbitTemplate.setReturnCallback(this);
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * 确认消息发送成功与否后的操作
     * */
    @Override
    public void confirm(CorrelationData correlationData, boolean b, String s) {
        if (b) {
            System.out.println("发送RabbitMQ消息 ack确认 成功");
        } else {
            System.out.println("发送RabbitMQ消息 ack确认 失败");
        }
    }

    /**
     * 重发消息方法
     * */
    @Override
    public void returnedMessage(Message message, int i, String s, String s1, String s2) {
        log.error("log 发送RabbitMQ消息returnedMessage，出现异常，Exchange不存在或发送至Exchange却没有发送到Queue中，message：[{}], code[{}], s[{}], exchange[{}], routingKey[{}]",
                JSON.toJSONString(message), JSON.toJSONString(i), JSON.toJSONString(s), JSON.toJSONString(s1), JSON.toJSONString(s2));
    }

    /**
     * 发送消息
     * @param jsonData 传输的消息数据 JSON格式
     * @param exchange 消息绑定的交换机名称
     * @param routingKey 消息绑定的路由键
     * */
    public void send(String jsonData, String exchange, String routingKey, CorrelationData correlationData) {
        rabbitTemplate.convertAndSend(exchange, routingKey, jsonData, correlationData);
    }
}
