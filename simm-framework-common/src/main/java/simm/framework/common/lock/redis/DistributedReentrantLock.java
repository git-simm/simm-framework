package simm.framework.common.lock.redis;

public interface DistributedReentrantLock {

    /**
     * 获取锁
     * @param waitTimeout 等待时间
     * @return
     * @throws InterruptedException
     */
    public boolean tryLock(int waitTimeout) throws InterruptedException;

    /**
     * 释放锁
     */
    public void unlock();
}
