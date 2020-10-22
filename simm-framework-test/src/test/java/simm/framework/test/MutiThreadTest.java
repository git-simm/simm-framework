package simm.framework.test;

import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

/**
 * 多线程测试
 */
public class MutiThreadTest {
    /**
     * 捕获当前线程信息
     *
     * @param args
     */
    public static void main(String[] args) {
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        ThreadInfo[] threadInfos = threadMXBean.dumpAllThreads(false, false);
//        TimeUnit.SECONDS.sleep(100);
        for (ThreadInfo t : threadInfos) {
            System.out.println("[" + t.getThreadId() + "]" + t.getThreadName());
        }
    }
}
