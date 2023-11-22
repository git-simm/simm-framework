package simm.spi.demo.message;

import simm.spi.service.MessageService;
/**
 * 邮件服务
 */
public class EmailMessageService implements MessageService {
    @Override
    public void sendMessage(String message) {
        System.out.println("Sending email message: " + message);
    }
}
