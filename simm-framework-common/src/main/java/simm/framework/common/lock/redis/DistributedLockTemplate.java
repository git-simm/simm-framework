package simm.framework.common.lock.redis;

/**
 * @author figure.li
 * @date 2019年7月3日16:10:28
 */
@FunctionalInterface
public interface DistributedLockTemplate {

    /**
     * 分布式锁执行内部逻辑
     * @param lockId 锁id(对应业务唯一ID)
     * @param lockTimeout 单位毫秒,占有锁的最长时间
     * @param waitTimeout 单位毫秒，等待获取锁的最长获取时间
     * @Param retryInterval 单位毫秒，等待获取锁重试的间隔
     * @param callback 获取成功或失败时的回调函数
     * @return
     */
    public Object execute(String lockId, int lockTimeout, int waitTimeout, int retryInterval, Callback callback);
}
