package simm.framework.webutil.config;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.springframework.beans.factory.annotation.Value;
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
@EnableAsync
public class ThreadPoolConfig extends AsyncConfigurerSupport {
    @Value("${threadPool.corePoolSize}")
    private String corePoolSize;
    @Value("${threadPool.maximumPoolSize}")
    private String maximumPoolSize;
    @Value("${threadPool.keepAliveTime}")
    private String keepAliveTime;
    @Value("${threadPool.capacity}")
    private String capacity;

    @Bean(value = "consumerQueueThreadPool")
    public ExecutorService buildConsumerQueueThreadPool() {
        ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
                .setNameFormat("my-test-thread-%d").build();
        ExecutorService pool = new ThreadPoolExecutor(Integer.valueOf(corePoolSize), Integer.valueOf(maximumPoolSize), Long.valueOf(keepAliveTime), TimeUnit.MILLISECONDS,
                new ArrayBlockingQueue<Runnable>(Integer.valueOf(capacity)), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());
        return pool;
    }

    @Override
    public Executor getAsyncExecutor() {
        return buildConsumerQueueThreadPool();
    }
}