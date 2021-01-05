package simm.boot.test.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.WebSocketSession;
import simm.boot.test.websocket.SocketManager;

import java.util.Map;

/**
 * websocket控制器
 * @author simm
 */
@RestController
@AllArgsConstructor
@Slf4j
public class WebSocketController {
    private final SimpMessagingTemplate template;

    /**
     * 服务器指定用户进行推送,需要前端开通 var socket = new SockJS(host+'/myUrl' + '?token=1234');
     */
    @RequestMapping("/sendUser")
    public void sendUser(String token) {
        log.info("token = {} ,对其发送您好", token);
        WebSocketSession webSocketSession = SocketManager.get(token);
        if (webSocketSession != null) {
            // 主要防止broken pipe
            template.convertAndSendToUser(token, "/queue/sendUser", "您好");
        }

    }

    /**
     * 广播，服务器主动推给连接的客户端
     */
    @RequestMapping("/sendTopic")
    public void sendTopic() {
        template.convertAndSend("/topic/sendTopic", "大家晚上好");
    }

    /**
     * 客户端发消息，服务端接收
     *
     * @param message 消息
     */
    @MessageMapping("/sendServer")
    public void sendServer(String message) {
        log.info("message:{}", message);
    }

    /**
     * 客户端发消息，大家都接收，相当于直播说话
     *
     * @param message 消息
     * @return 返回消息
     */
    @MessageMapping("/sendAllUser")
    @SendTo("/topic/sendTopic")
    public String sendAllUser(String message) {
        // 也可以采用template方式
        return message;
    }

    /**
     * 点对点用户聊天，这边需要注意，由于前端传过来json数据，所以使用@RequestBody
     * 这边需要前端开通var socket = new SockJS(host+'/myUrl' + '?token=4567');   token为指定name
     * @param map
     */
    @MessageMapping("/sendMyUser")
    public void sendMyUser(@RequestBody Map<String, String> map) {
        log.info("map = {}", map);
        WebSocketSession webSocketSession = SocketManager.get(map.get("name"));
        if (webSocketSession != null) {
            log.info("sessionId = {}", webSocketSession.getId());
            template.convertAndSendToUser(map.get("name"), "/queue/sendUser", map.get("message"));
        }
    }
}
