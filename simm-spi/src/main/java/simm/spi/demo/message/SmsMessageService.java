package simm.spi.demo.message;

import simm.spi.service.MessageService;

/**
 * 邮件服务
 * @author miscr
 */
public class SmsMessageService implements MessageService {
    @Override
    public void sendMessage(String message) {
        System.out.println("Sending SMS message: " + message);
    }
}
