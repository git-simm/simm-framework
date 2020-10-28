package simm.framework.test.lock.reentrant;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantConditionTest {
    public final ReentrantLock lock = new ReentrantLock();
    public final Condition signal = lock.newCondition();
    public Integer num = 0;
    public AtomicInteger atomicInteger = new AtomicInteger(0);

    public void go(int type) {
        // condition 必须在lock内执行，否则会抛错 诡异的java.lang.IllegalMonitorStateException
        lock.lock();
        try {
            if (type == 1) {
                signal.signal();
            } else {
                signal.signalAll();
            }
        } catch (Exception e) {

        } finally {
            lock.unlock();
        }
    }

    public void test() throws InterruptedException {
        lock.lock();
        //等待计数完成后，所有任务一起跑
        signal.await();
        try {
            System.out.print("1.[" + System.currentTimeMillis() + "]当前锁获得线程：" + Thread.currentThread().getId() + "\r\n");
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
        ReentrantConditionTest testObj = new ReentrantConditionTest();
        ExecutorService executorService = Executors.newCachedThreadPool();
        for (int i = 0; i < 5; i++) {
            executorService.submit(() -> {
                try {
                    testObj.test();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
        //10s后，准备好的线程一起运行(第一名)
        TimeUnit.SECONDS.sleep(2);
        testObj.go(1);
        //10s后，准备好的线程一起运行(第二名)
        TimeUnit.SECONDS.sleep(2);
        testObj.go(1);
        //10s后，准备好的线程一起运行(争夺第三)
        TimeUnit.SECONDS.sleep(2);
        testObj.go(2);
    }
}
