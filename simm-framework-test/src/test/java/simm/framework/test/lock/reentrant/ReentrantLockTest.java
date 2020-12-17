package simm.framework.test.lock.reentrant;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

/**
 * ReentrantLock 测试
 */
public class ReentrantLockTest {
    public ReentrantLock lock = new ReentrantLock();
    public CountDownLatch countDownLatch = new CountDownLatch(1);
    public Integer num = 0;
    public AtomicInteger atomicInteger = new AtomicInteger(0);

    public void test() throws InterruptedException {
        lock.lock();
        //等待计数完成后，所有任务一起跑
        countDownLatch.await();
        try {
            System.out.print("1.当前锁获得线程：" + Thread.currentThread().getId() + "\r\n");
            //不安全
            num++;
            System.out.print("2.当前num：" + num + "\r\n");
            //安全共享变量
            System.out.print("3.当前atomicInteger：" + atomicInteger.incrementAndGet() + "\r\n");

        } catch (Exception e) {

        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) throws Exception {
        ReentrantLockTest testObj = new ReentrantLockTest();
        ExecutorService executorService = Executors.newCachedThreadPool();
        for (int i = 0; i < 100; i++) {
            executorService.submit(() -> {
                try {
                    testObj.test();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
        //10s后，准备好的线程一起运行
        TimeUnit.SECONDS.sleep(5);
        testObj.countDownLatch.countDown();
    }
}
