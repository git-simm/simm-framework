package simm.framework.test.schedule;

import java.util.concurrent.DelayQueue;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

/**
 * 延时队列的实现
 */
public class DelayQueueTest {
    public static void main(String[] args) throws Exception {
        DelayQueue<Order> orders = new DelayQueue<>();
        Order order1 = new Order(2000, "1x");
        Order order2 = new Order(4000, "2x");
        Order order3 = new Order(6000, "3x");
        Order order4 = new Order(8000, "4x");
        orders.add(order1);
        orders.add(order2);
        orders.add(order3);
        orders.add(order4);
        for (; ; ) {
            //没有到期会阻塞(使用 ReentranLock 完成阻塞的操作)
            Order take = orders.take();
            System.out.println(take);
        }
    }

    /**
     * 延时队列
     */
    static class Order implements Delayed {
        @Override
        public String toString() {
            return "DelayedElement{" + "delay=" + delayTime +
                    ", expire=" + expire +
                    ", data='" + data + '\'' +
                    '}';
        }

        Order(long delay, String data) {
            delayTime = delay;
            this.data = data;
            expire = System.currentTimeMillis() + delay;
        }

        private final long delayTime; //延迟时间
        private final long expire;  //到期时间
        private String data;   //数据

        /**
         * 剩余时间=到期时间-当前时间
         */
        @Override
        public long getDelay(TimeUnit unit) {
            return unit.convert(this.expire - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
        }

        /**
         * 优先队列里面优先级规则
         */
        @Override
        public int compareTo(Delayed o) {
            return (int) (this.getDelay(TimeUnit.MILLISECONDS) - o.getDelay(TimeUnit.MILLISECONDS));
        }
    }
}

