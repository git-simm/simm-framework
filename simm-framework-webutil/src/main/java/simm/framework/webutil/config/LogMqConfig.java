package simm.framework.webutil.config;

import lombok.Data;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;

/**
 * 日志消息配置
 * */
//@Configuration
@Data
public class LogMqConfig {
    /**
     * 交换机名称
     */
    public static final String YQM_XXL_LOG_EXCHANGE = "yqm_xxl_log_exchange";
    /**
     * 队列名称
     */
    public static final String YQM_XXL_LOG_QUEUE = "yqm_xxl_log_queue";
    /**
     * 路由键
     */
    public static final String YQM_XXL_LOG_ROUTING_KEY = "yqm_xxl_log_routing_key";

    /**
     *
     * */
    public static final String YQM_LOG_PREFIX = "YQM_LOG";


    /**
     * direct交换机
     * 把消息投递到那些binding key与routing key完全匹配的队列中
     */
    @Bean(YQM_XXL_LOG_EXCHANGE)
    @Qualifier(YQM_XXL_LOG_EXCHANGE)
    public DirectExchange yqmRechargeExchange() {
        return new DirectExchange(YQM_XXL_LOG_EXCHANGE);
    }

    /**
     * 队列
     */
    @Bean(YQM_XXL_LOG_QUEUE)
    @Qualifier(YQM_XXL_LOG_QUEUE)
    public Queue yqmRechargeQueue() {
        /** name 队列名称 durable 持久化*/
        return new Queue(YQM_XXL_LOG_QUEUE, true);
    }

    /**
     * 绑定队列 和交换机
     */
    @Bean
    public Binding bankRechargeBinding(@Qualifier(YQM_XXL_LOG_EXCHANGE) DirectExchange bankRechargeExchange, @Qualifier(YQM_XXL_LOG_QUEUE) Queue bankRechargeQueue) {
        return BindingBuilder.bind(bankRechargeQueue).to(bankRechargeExchange).with(YQM_XXL_LOG_ROUTING_KEY);
    }
}
