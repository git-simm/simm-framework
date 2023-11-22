package simm.spi;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import simm.spi.service.MessageServiceLoader;

/**
 * 启用程序
 * @author miscr
 */
@SpringBootApplication(scanBasePackages = "simm.spi.service")
public class SPIApplication implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(SPIApplication.class, args);
    }

    private final MessageServiceLoader messageServiceLoader;

    public SPIApplication(MessageServiceLoader messageServiceLoader) {
        this.messageServiceLoader = messageServiceLoader;
    }
    @Override
    public void run(String... args) {
        messageServiceLoader.loadAndSendMessage("Hello, SPI Demo!");
    }
}