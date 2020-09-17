package simm.framework.common.lock.redis;

import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.LockSupport;

/**
 * 锁实现
 * @author simm
 */
public class RedisLockInternals {
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(RedisLockInternals.class);

    private RedisLuaScript script;

    /**
     * 重试间隔时间 单位毫秒
     */
    private int retryInterval=300;

    private int lockTimeout=2000;

    private String lockId;


    public RedisLockInternals(RedisLuaScript script) {
        this.script = script;
    }

    public RedisLockInternals(RedisLuaScript script,String lockId,int lockTimeout,int retryInterval){
        this.script=script;
        this.lockTimeout=lockTimeout;
        this.retryInterval=retryInterval;
        this.lockId=lockId;
    }
    /**
     *
     * @Title: tryRedisLock
     * @Description: 获取锁，如果锁获取到返回lockValue;如果获取不到，重试waitTimeout ms,间隔 retryInterval ms 时间。
     * @param waitTimeout 持有锁的时间，单位ms
     * @return String lockValue
     */
    public String tryLock(int waitTimeout) {
        final long startMillis = System.currentTimeMillis();
        String lockValue=null;
        while (lockValue==null){
            lockValue=createRedisKey(lockTimeout);
            if(lockValue!=null){
                return lockValue;
            }
            if(System.currentTimeMillis()-startMillis-retryInterval>waitTimeout){
                break;
            }
            LockSupport.parkNanos(TimeUnit.MILLISECONDS.toNanos(retryInterval));
        }
        return lockValue;
    }

    private String createRedisKey(int lockTimeout) {
        try {
            String value=lockId+randomId(1);
            String luaScript = ""
                    + "\nlocal r = tonumber(redis.call('SETNX', KEYS[1],ARGV[1]));"
                    + "\nif r == 1 then"
                    + "\nredis.call('PEXPIRE',KEYS[1],ARGV[2]);"
                    + "\nend"
                    + "\nreturn r";
            List<String> keys = new ArrayList<>();
            keys.add(lockId);
            List<String> args = new ArrayList<>();
            args.add(value);
            args.add(lockTimeout+"");
            Long ret = (Long) script.eval(luaScript, keys, args);
            if( new Long(1).equals(ret)){
                return value;
            }
        }finally {
        }
        return null;
    }

    public void unlock(String key,String value) {
        try {
            String luaScript=""
                    +"\nlocal v = redis.call('GET', KEYS[1]);"
                    +"\nlocal r= 0;"
                    +"\nif v == ARGV[1] then"
                    +"\nr =redis.call('DEL',KEYS[1]);"
                    +"\nend"
                    +"\nreturn r";
            List<String> keys = new ArrayList<>();
            keys.add(key);
            List<String> args = new ArrayList<>();
            args.add(value);
            Object r=script.eval(luaScript, keys, args);
        } finally {

        }
    }

    private final static char[] DIGITS = {'0', '1', '2', '3', '4', '5', '6', '7', '8',
            '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
            'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
            'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
            'Z'};

    private String randomId(int size) {
        char[] cs = new char[size];
        for (int i = 0; i < cs.length; i++) {
            cs[i] = DIGITS[ThreadLocalRandom.current().nextInt(DIGITS.length)];
        }
        return new String(cs);
    }
}
