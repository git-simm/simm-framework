package simm.spi.service;

import org.springframework.stereotype.Component;

import java.util.ServiceLoader;

@Component
public class MessageServiceLoader {
    public void loadAndSendMessage(String message) {
        ServiceLoader<MessageService> serviceLoader = ServiceLoader.load(MessageService.class);
        for (MessageService service : serviceLoader) {
            service.sendMessage(message);
        }
    }
}