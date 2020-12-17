package simm.framework.webutil.autoconfig;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurerSupport;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.concurrent.*;

/**
 * 线程池(支持异步)
 * @author simm
 */
@Configuration
@ConditionalOnProperty(name = "threadPool.corePoolSize")
@EnableAsync
public class ThreadPoolConfig extends AsyncConfigurerSupport {
    /**
     * 核心线程数
     */
    @Value("${threadPool.corePoolSize}")
    private String corePoolSize;
    /**
     * 线程池最大的线程容量
     */
    @Value("${threadPool.maximumPoolSize}")
    private String maximumPoolSize;
    /**
     * 线程空闲可存活时间
     */
    @Value("${threadPool.keepAliveTime}")
    private String keepAliveTime;
    /**
     * 阻塞队列的容量
     */
    @Value("${threadPool.capacity}")
    private String capacity;

    @Value("${spring.application.name}")
    private String applicationName;

    @Bean(value = "consumerQueueThreadPool")
    public ExecutorService buildConsumerQueueThreadPool() {
        ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
                .setNameFormat(applicationName + "-thread-%d").build();
        ExecutorService pool = new ThreadPoolExecutor(Integer.valueOf(corePoolSize), Integer.valueOf(maximumPoolSize),
                Long.valueOf(keepAliveTime), TimeUnit.MILLISECONDS,
                new ArrayBlockingQueue<>(Integer.valueOf(capacity)),
                namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());
        return pool;
    }

    @Override
    public Executor getAsyncExecutor() {
        return buildConsumerQueueThreadPool();
    }
}