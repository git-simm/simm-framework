package simm.framework.webutil.config;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.springframework.data.redis.connection.RedisNode;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import redis.clients.jedis.JedisPoolConfig;
import simm.framework.common.redis.RedisUtil;

import java.util.ArrayList;
import java.util.Collection;

/**
 * @author simm
 */
@Data
@Configuration
//@ConditionalOnProperty(prefix = "redis.cluster", name = {"enabled"})
@ConfigurationProperties(prefix = "redis")
public class RedisClusterAutoConfiguration {
    // JedisPoolConfig 连接池配置
    private int maxTotal = 8;
    private int maxIdle = 8;
    private int minIdle = 0;
    private long maxWaitMillis = -1L;
    private int numTestsPerEvictionRun = 3;
    private long timeBetweenEvictionRunsMillis = -1L;
    private long minEvictableIdleTimeMillis = 1800000L;
    private long softMinEvictableIdleTimeMillis = -1L;
    private boolean testOnBorrow = false;
    private boolean testOnReturn = false;
    private boolean testWhileIdle = false;
    private boolean blockWhenExhausted = true;

    // RedisClusterConfiguration 集群配置
    private Integer maxRedirects;
    private String nodesAddr;

    // JedisConnectionFactory 连接参数配置
    private String password;

    // RedisCacheManager 缓存参数配置
    private long expiration;

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
    public RedisClusterConfiguration redisClusterConfiguration() {
        RedisClusterConfiguration redisClusterCfg = new RedisClusterConfiguration();
        redisClusterCfg.setMaxRedirects(this.maxRedirects);
        if(StringUtils.isBlank(this.nodesAddr)){
            throw new IllegalArgumentException("addr is blank");
        }
        String[] hostPortArray = this.nodesAddr.split(",");
        Collection<RedisNode> nodes = new ArrayList<RedisNode>();
        for (String hostPort : hostPortArray) {
            String[] tmpArr = hostPort.trim().split(":");
            if (tmpArr == null || tmpArr.length != 2) {
                assert false : "hostPort format error";
            }
            String host = tmpArr[0];
            String port = tmpArr[1];
            RedisNode node = new RedisNode(host, Integer.valueOf(port));
            nodes.add(node);
        }
        redisClusterCfg.setClusterNodes(nodes);
        return redisClusterCfg;
    }

    @Bean
    public JedisConnectionFactory jedisConnectionFactory(
            RedisClusterConfiguration redisClusterConfiguration,
            JedisPoolConfig jedisPoolConfig
    ) {
        JedisConnectionFactory jedisConnectionFactory =
                new JedisConnectionFactory(redisClusterConfiguration, jedisPoolConfig);
        jedisConnectionFactory.setPassword(this.password);
        return jedisConnectionFactory;
    }

    @Bean
    public RedisTemplate redisTemplate(JedisConnectionFactory jedisConnectionFactory) {
        RedisTemplate redisTemplate = new RedisTemplate();
        redisTemplate.setConnectionFactory(jedisConnectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(redisTemplate.getKeySerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        redisTemplate.setHashValueSerializer(redisTemplate.getValueSerializer());
        redisTemplate.setEnableTransactionSupport(false);
        return redisTemplate;
    }

//    public RedisCacheManager redisCacheManager(RedisTemplate redisTemplate) {
//        RedisCacheManager redisCacheManager = new RedisCacheManager(redisTemplate);
//        redisCacheManager.setDefaultExpiration(this.expiration);
//        return redisCacheManager;
//    }

    @Bean
    public RedisUtil redisUtil(RedisTemplate redisTemplate) {
        RedisUtil redisUtil = new RedisUtil();
        redisUtil.setRedisTemplate(redisTemplate);
        return redisUtil;
    }
}
