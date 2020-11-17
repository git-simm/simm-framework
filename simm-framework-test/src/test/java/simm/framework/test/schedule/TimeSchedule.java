package simm.framework.test.schedule;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 定时调度器
 */
public class TimeSchedule {
    public static void main(String... args) {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(
                () -> {
                    System.out.println("我在执行：" + System.currentTimeMillis());
                }, 0, 100, TimeUnit.MILLISECONDS);
        System.out.println("执行完毕");
    }
}
