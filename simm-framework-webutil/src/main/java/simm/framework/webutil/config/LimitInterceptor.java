package simm.framework.webutil.config;

import com.google.common.collect.ImmutableList;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import simm.framework.common.lock.redis.RedisLuaScript;
import simm.framework.webutil.limit.Limit;
import simm.framework.webutil.limit.LimitType;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 流量拦截
 * @author simm
 */
@Aspect
@Configuration
public class LimitInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(LimitInterceptor.class);

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

    @Around("execution(public * *(..)) && @annotation(simm.framework.webutil.limit.Limit)")
    public Object interceptor(ProceedingJoinPoint pjp) {
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        Method method = signature.getMethod();
        Limit limitAnnotation = method.getAnnotation(Limit.class);
        LimitType limitType = limitAnnotation.limitType();
        String name = limitAnnotation.name();
        String key;
        int limitPeriod = limitAnnotation.period();
        int limitCount = limitAnnotation.count();
        switch (limitType) {
            case IP:
                key = getIpAddress();
                break;
            case CUSTOMER:
                key = limitAnnotation.key();
                break;
            default:
                key = StringUtils.upperCase(method.getName());
        }
        ImmutableList<String> keys = ImmutableList.of(String.format("%s%s",limitAnnotation.prefix(), key));
        boolean redisSucc = false;
        try {
            String luaScript = buildLuaScript();
            RedisScript<Number> redisScript = new DefaultRedisScript<>(luaScript, Number.class);
            Number count = (Number)redisLuaScript.eval(luaScript,keys, Arrays.asList(String.valueOf(limitCount),String.valueOf(limitPeriod)));
            redisSucc = true;
//            Number count = (Number) redisTemplate.execute(redisScript, keys, limitCount,limitPeriod);
            logger.info("Access try count is {} for name={} and key = {}", count, name, key);
            if (count != null && count.intValue() <= limitCount) {
                return pjp.proceed();
            } else {
                throw new RuntimeException("You have been dragged into the blacklist");
            }
        } catch (Throwable e) {
            if (e instanceof RuntimeException) {
                throw new RuntimeException(e.getLocalizedMessage());
            }
            throw new RuntimeException("server exception");
        }finally {
            if(redisSucc){
                String luaScript = buildDecrLuaScript();
                redisLuaScript.eval(luaScript,keys, Arrays.asList(String.valueOf(limitCount),String.valueOf(limitPeriod)));
            }
        }
    }

    /**
     * 限流脚本(进入)
     *
     * @return lua脚本
     */
    public String buildLuaScript() {
        StringBuilder lua = new StringBuilder();
        lua.append("local c");
        lua.append("\nc = redis.call('get',KEYS[1])");
        // 调用不超过最大值，则直接返回
        lua.append("\nif c and tonumber(c) > tonumber(ARGV[1]) then");
        lua.append("\nreturn c;");
        lua.append("\nend");
        // 执行计算器自加
        lua.append("\nc = redis.call('incr',KEYS[1])");
//        lua.append("\nif tonumber(c) == 1 then");
//        // 从第一次调用开始限流，设置对应键值的过期
//        lua.append("\nredis.call('expire',KEYS[1],ARGV[2])");
//        lua.append("\nend");
        lua.append("\nreturn c;");
        return lua.toString();
    }

    /**
     * 限流 脚本（退出）
     *
     * @return lua脚本
     */
    public String buildDecrLuaScript() {
        StringBuilder lua = new StringBuilder();
        lua.append("local c");
        lua.append("\nc = redis.call('get',KEYS[1])");
        // 调用不超过最大值，则直接返回
        lua.append("\nif c and tonumber(c)== 0 then");
        lua.append("\nreturn c;");
        lua.append("\nend");
        // 执行计算器自加
        lua.append("\nc = redis.call('decr',KEYS[1])");
        lua.append("\nreturn c;");
        return lua.toString();
    }

    private static final String UNKNOWN = "unknown";

    /**
     * 获取IP地址
     * @return
     */
    public String getIpAddress() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
