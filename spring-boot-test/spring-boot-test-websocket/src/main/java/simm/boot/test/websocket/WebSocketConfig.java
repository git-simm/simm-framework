package simm.boot.test.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

/**
 * WebSocketConfig配置
 * @author simm
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketDecoratorFactory webSocketDecoratorFactory;
    private final PrincipalHandshakeHandler principalHandshakeHandler;

    public WebSocketConfig(WebSocketDecoratorFactory webSocketDecoratorFactory, PrincipalHandshakeHandler principalHandshakeHandler) {
        this.webSocketDecoratorFactory = webSocketDecoratorFactory;
        this.principalHandshakeHandler = principalHandshakeHandler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // myUrl表示 你前端到时要对应url映射
        registry.addEndpoint("/mySocket")
                .setAllowedOrigins("*")
                .setHandshakeHandler(principalHandshakeHandler)
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // queue 点对点;topic 广播;user 点对点前缀
        registry.enableSimpleBroker("/queue", "/topic");
        // registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.addDecoratorFactory(webSocketDecoratorFactory);
    }
}
