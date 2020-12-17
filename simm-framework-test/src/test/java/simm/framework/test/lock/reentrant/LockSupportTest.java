package simm.framework.test.lock.reentrant;

import java.util.concurrent.locks.LockSupport;

/**
 * Locksupport 学习
 */
public class LockSupportTest {
    public static void main(String[] args) {
        // 定义一个线程C，不干任何事情
        Thread c = new Thread(()->{
            LockSupport.park();
            System.out.println("我是C");
        },"线程C");

        // 定义一个线程B，执行一段输出后，自身进行等待
        Thread b = new Thread(()->{
            System.out.println(Thread.currentThread().getName() + ": 线程执行");
            System.out.println(Thread.currentThread().getName() + ": 阻塞");
            // 直接对线程C进行唤醒
            LockSupport.unpark(c);
            LockSupport.park();
            System.out.println(Thread.currentThread().getName() + ": 继续线程执行");
        },"线程B");

        // 定义一个线程C，自身等待一定时间后，对线程B进行唤醒
        Thread a  =new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName() + ": 线程执行");
                LockSupport.parkNanos(1*3000*3000*3000);
                System.out.println(Thread.currentThread().getName() + ": 线程继续执行");
                // 对线程B进行唤醒
                // Thread.State.WAITING
                LockSupport.unpark(b);
            } catch (Exception e) {}
        },"线程A");

        c.start();
        b.start();
        a.start();
    }
}
