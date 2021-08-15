package simm.test.message.rabbit.controller;

import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import simm.test.message.rabbit.channels.InstallCallbackOutputChannel;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * 测试
 *
 * @author miscr
 */
@RestController
public class TestController {
    @Resource
    @Output(InstallCallbackOutputChannel.OUTPUT)
    private MessageChannel messageChannel;

    @GetMapping("/send")
    public void sendMessage() {
        messageChannel.send(MessageBuilder.withPayload("install服务已经启动，准备安装消息")
                .setHeader("routing", "info")
                .setHeader("msgType", "install").build());
    }

    @GetMapping("/send2")
    public void sendMessage2() {
        messageChannel.send(MessageBuilder.withPayload("bizunit服务已经启动，准备安装消息")
                .setHeader("routing", "info")
                .setHeader("msgType", "bizunit").build());
    }
}
