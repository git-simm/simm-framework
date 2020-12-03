package simm.framework.webutil.autoconfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import redis.clients.jedis.JedisPoolConfig;
import simm.framework.common.utils.redis.RedisUtil;

/**
 * redis连接池的配置
 * @author simm
 */
@Configuration
@ConditionalOnProperty(name = "spring.redis.host")
@ConditionalOnMissingBean(RedisTemplate.class)
@Order(1)
public class RedisConfig {
    @Value("${spring.redis.host}")
    private String host;
    @Value("${spring.redis.password}")
    private String password;
    @Value("${spring.redis.port}")
    private Integer port;
    @Value("${spring.redis.database}")
    private int database;
    @Value("${spring.redis.jedis.pool.maxIdle}")
    private Integer maxIdle;
    @Value("${spring.redis.jedis.pool.minIdle}")
    private Integer minIdle;
    @Value("${spring.redis.jedis.pool.maxTotal}")
    private Integer maxTotal;
    @Value("${spring.redis.jedis.pool.maxWaitMillis}")
    private Integer maxWaitMillis;
    @Value("${spring.redis.jedis.pool.minEvictableIdleTimeMillis}")
    private Integer minEvictableIdleTimeMillis;
    @Value("${spring.redis.jedis.pool.numTestsPerEvictionRun}")
    private Integer numTestsPerEvictionRun;
    @Value("${spring.redis.jedis.pool.timeBetweenEvictionRunsMillis}")
    private long timeBetweenEvictionRunsMillis;
    @Value("${spring.redis.jedis.pool.testOnBorrow}")
    private boolean testOnBorrow;
    @Value("${spring.redis.jedis.pool.testWhileIdle}")
    private boolean testWhileIdle;
    @Value("${spring.redis.jedis.pool.softMinEvictableIdleTimeMillis}")
    private long softMinEvictableIdleTimeMillis = -1L;
    @Value("${spring.redis.jedis.pool.testOnReturn}")
    private boolean testOnReturn = false;
    @Value("${spring.redis.jedis.pool.blockWhenExhausted}")
    private boolean blockWhenExhausted = true;

    @Bean
    public JedisPoolConfig jedisPoolConfig() {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(this.maxTotal);
        poolConfig.setMaxIdle(this.maxIdle);
        poolConfig.setMinIdle(this.minIdle);
        poolConfig.setMaxWaitMillis(this.maxWaitMillis);
        poolConfig.setNumTestsPerEvictionRun(this.numTestsPerEvictionRun);
        poolConfig.setTimeBetweenEvictionRunsMillis(this.timeBetweenEvictionRunsMillis);
        poolConfig.setMinEvictableIdleTimeMillis(this.minEvictableIdleTimeMillis);
        poolConfig.setSoftMinEvictableIdleTimeMillis(this.softMinEvictableIdleTimeMillis);
        poolConfig.setTestOnBorrow(this.testOnBorrow);
        poolConfig.setTestOnReturn(this.testOnReturn);
        poolConfig.setTestWhileIdle(this.testWhileIdle);
        poolConfig.setBlockWhenExhausted(this.blockWhenExhausted);
        return poolConfig;
    }

    @Bean
    public JedisConnectionFactory jedisConnectionFactory(JedisPoolConfig poolConfig) {
        // 基础连接配置
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(host);
        redisStandaloneConfiguration.setPort(port);
        redisStandaloneConfiguration.setDatabase(database);
        redisStandaloneConfiguration.setPassword(RedisPassword.of(password));
        // 连接池的配置
        JedisClientConfiguration.JedisPoolingClientConfigurationBuilder jedisClientConfiguration = (JedisClientConfiguration.JedisPoolingClientConfigurationBuilder) JedisClientConfiguration.builder();
        jedisClientConfiguration.poolConfig(poolConfig);
        return new JedisConnectionFactory(redisStandaloneConfiguration,jedisClientConfiguration.build());
    }

    /**
     * 返回redis处理模板
     * @param jedisConnectionFactory
     * @return
     */
    @Bean
    public RedisTemplate redisTemplate(JedisConnectionFactory jedisConnectionFactory) {
        RedisTemplate redisTemplate = new RedisTemplate();
        redisTemplate.setConnectionFactory(jedisConnectionFactory);
        RedisSerializer stringSerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer jackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        redisTemplate.setKeySerializer(stringSerializer);
        redisTemplate.setHashKeySerializer(stringSerializer);
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
        redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);
        redisTemplate.setEnableTransactionSupport(false);
        return redisTemplate;
    }

    /**
     * redis工具
     * @param redisTemplate
     * @return
     */
    @Bean
    public RedisUtil redisUtil(RedisTemplate redisTemplate) {
        RedisUtil redisUtil = new RedisUtil();
        redisUtil.setRedisTemplate(redisTemplate);
        return redisUtil;
    }
}
