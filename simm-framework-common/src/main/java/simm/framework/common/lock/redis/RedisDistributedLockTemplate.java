package simm.framework.common.lock.redis;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;

import javax.annotation.PostConstruct;

/**
 * RedisDistributedLockTemplate
 * @author simm
 */
@Configuration
public class RedisDistributedLockTemplate implements DistributedLockTemplate {
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(RedisDistributedLockTemplate.class);

    @Autowired
    private RedisTemplate redisTemplate;

    private RedisLuaScript redisLuaScript;

    /**
     * 初始化方案
     */
    @PostConstruct
    public void init() {
        redisLuaScript = (script, keys, args) -> redisTemplate.execute((RedisCallback) connection -> {
            Object nativeConnection = connection.getNativeConnection();
            // 集群模式和单点模式虽然执行脚本的方法一样，但是没有共同的接口，所以只能分开执行
            // 集群
            if (nativeConnection instanceof JedisCluster) {
                return ((JedisCluster) nativeConnection).eval(script, keys, args);
            }
            // 单点
            else if (nativeConnection instanceof Jedis) {
                return ((Jedis) nativeConnection).eval(script, keys, args);
            }
            return null;
        });
    }

    /**
     * 获取锁
     * @param lockId 锁id(对应业务唯一ID)
     * @param lockTimeout 单位毫秒,占有锁的最长时间
     * @param waitTimeout 单位毫秒，等待获取锁的最长获取时间
     * @param retryIntervel 重试间隔
     * @param callback 获取成功或失败时的回调函数
     * @return
     */
    @Override
    public Object execute(String lockId, int lockTimeout, int waitTimeout, int retryIntervel, Callback callback) {
        RedisReentrantLock distributedReentrantLock = null;
        boolean getLock = false;
        try {
            distributedReentrantLock = new RedisReentrantLock(redisLuaScript, lockId, lockTimeout,
                    retryIntervel > 0 ? retryIntervel : 100);
            if (distributedReentrantLock.tryLock(waitTimeout)) {
                getLock = true;
                return callback.callback(true);
            } else {
                return callback.callback(false);
            }
        } catch (InterruptedException ex) {
            LOGGER.error(ex.getMessage(), ex);
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            throw e;
        } finally {
            if (getLock) {
                distributedReentrantLock.unlock();
            }
        }
        return null;
    }
}
