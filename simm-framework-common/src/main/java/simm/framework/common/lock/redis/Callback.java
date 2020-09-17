package simm.framework.common.lock.redis;

/**
 * @author figure.li
 * @date 2019年7月3日14:53:13
 */

@FunctionalInterface
public interface Callback {
    /**
     * 占有锁成功或失败时的回调
     * @param success
     * @return
     * @throws InterruptedException
     */
    public Object callback(boolean success) throws InterruptedException;
}
