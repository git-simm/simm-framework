package simm.framework.webutil.log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author simm
 */
@Service
public class LogServiceImpl implements LogService {
    @Autowired
    private RabbitMQServiceImpl rabbitMQService;


    @Override
    public void sendLogByMq(String messageData) {
//        CorrelationData correlationData = new CorrelationData(LogMqConfig.YQM_LOG_PREFIX+UUID.randomUUID().toString());
//        rabbitMQService.send(messageData, LogMqConfig.YQM_XXL_LOG_EXCHANGE,LogMqConfig.YQM_XXL_LOG_ROUTING_KEY,correlationData);
    }
}
