package simm.framework.webutil.config;

import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.RabbitListenerContainerFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;

//@EnableRabbit
//@Configuration
public class RabbitConfig {
    @Value("${spring.rabbitmq.addresses}")
    private String addresses;

    @Value("${spring.rabbitmq.username}")
    private String username;

    @Value("${spring.rabbitmq.password}")
    private String password;

    @Value("${spring.rabbitmq.prefetchcount}")
    private Integer prefetchCount;

    public static final int DEFAULT_CONCURRENT =10;

    public static final int MAX_CONCURRENT =50;

    /**
     Broker:它提供一种传输服务,它的角色就是维护一条从生产者到消费者的路线，保证数据能按照指定的方式进行传输,
     Exchange：消息交换机,它指定消息按什么规则,路由到哪个队列。
     Queue:消息的载体,每个消息都会被投到一个或多个队列。
     Binding:绑定，它的作用就是把exchange和queue按照路由规则绑定起来.
     Routing Key:路由关键字,exchange根据这个关键字进行消息投递。
     vhost:虚拟主机,一个broker里可以有多个vhost，用作不同用户的权限分离。
     Producer:消息生产者,就是投递消息的程序.
     Consumer:消息消费者,就是接受消息的程序.
     Channel:消息通道,在客户端的每个连接里,可建立多个channel.
     */
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setAddresses(addresses);
        connectionFactory.setUsername(username);
        connectionFactory.setPassword(password);
        connectionFactory.setVirtualHost("/");
        connectionFactory.setPublisherConfirms(true);
        return connectionFactory;
    }

    @Bean
    public RabbitListenerContainerFactory<?> rabbitListenerContainerFactory(ConnectionFactory connectionFactory){
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(new Jackson2JsonMessageConverter());
        //开启手动 ack
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        factory.setConcurrentConsumers(DEFAULT_CONCURRENT);
        factory.setMaxConcurrentConsumers(MAX_CONCURRENT);
        factory.setPrefetchCount(prefetchCount);
        return factory;
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate template = new RabbitTemplate(connectionFactory());
        template.setMessageConverter(new Jackson2JsonMessageConverter());
        return template;
    }
}
