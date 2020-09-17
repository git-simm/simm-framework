package simm.framework.common.lock.redis;

import com.google.common.collect.Maps;

import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * redis锁
 * @author simm
 */
public class RedisReentrantLock implements DistributedReentrantLock {

    private final ConcurrentMap<Thread, LockData> threadData = Maps.newConcurrentMap();

    private RedisLuaScript script;

    private RedisLockInternals internals;

    private String lockId;


    public RedisReentrantLock(RedisLuaScript script,String lockId,int lockTimeout,int retryInterval) {
        this.script = script;
        this.lockId=lockId;
        this.internals=new RedisLockInternals(script,lockId,lockTimeout,retryInterval);
    }

    private static class LockData {
        final Thread owningThread;
        final String lockVal;
        final AtomicInteger lockCount = new AtomicInteger(1);

        private LockData(Thread owningThread, String lockVal) {
            this.owningThread = owningThread;
            this.lockVal = lockVal;
        }
    }

    @Override
    public boolean tryLock(int waitTimeout) throws InterruptedException{
        Thread currentThread = Thread.currentThread();
        LockData lockData = threadData.get(currentThread);
        if ( lockData != null ) {
            lockData.lockCount.incrementAndGet();
            return true;
        }
        String lockVal = internals.tryLock(waitTimeout);
        if ( lockVal != null ) {
            LockData newLockData = new LockData(currentThread, lockVal);
            threadData.put(currentThread, newLockData);
            return true;
        }
        return false;
    }

    @Override
    public void unlock() {
        Thread currentThread = Thread.currentThread();
        LockData lockData = threadData.get(currentThread);
        if ( lockData == null ) {
            throw new IllegalMonitorStateException("You do not own the lock: " + lockId);
        }
        int newLockCount = lockData.lockCount.decrementAndGet();
        if ( newLockCount > 0 ) {
            return;
        }
        if ( newLockCount < 0 ) {
            throw new IllegalMonitorStateException("Lock count has gone negative for lock: " + lockId);
        }
        try {
            internals.unlock(lockId,lockData.lockVal);
        } finally {
            threadData.remove(currentThread);
        }
    }
}
