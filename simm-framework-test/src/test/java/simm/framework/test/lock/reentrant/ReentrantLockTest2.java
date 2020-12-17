package simm.framework.test.lock.reentrant;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.ReentrantLock;

/**
 * ReentrantLock 测试
 */
public class ReentrantLockTest2 {
    public ReentrantLock lock = new ReentrantLock();
    /**
     * 外层方法加锁
     * @throws InterruptedException
     */
    public void test() throws InterruptedException {
        lock.lock();
        try {
            test2();
            // System.out.print("当前锁获得线程：" + Thread.currentThread().getName() + "\r\n");
        } catch (Exception e) {

        } finally {
            lock.unlock();
        }
    }
    /**
     * 内层方法加锁
     * @throws InterruptedException
     */
    public void test2() throws InterruptedException {
        lock.lock();
        try {
            test();
            System.out.print("当前锁获得线程：" + Thread.currentThread().getName() + "\r\n");
        } catch (Exception e) {

        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) throws Exception {
        ReentrantLockTest2 testObj = new ReentrantLockTest2();
        ExecutorService executorService = Executors.newCachedThreadPool();
        for (int i = 0; i < 2; i++) {
            int finalI = i;
            executorService.submit(() -> {
                try {
                    Thread.currentThread().setName("任务"+ finalI);
                    testObj.test();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
    }
}
