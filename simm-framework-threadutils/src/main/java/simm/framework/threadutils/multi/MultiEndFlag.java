package simm.framework.threadutils.multi;

import java.util.UUID;

/**
 * 多线程结束标志
 * 2018.09.22 by simm
 */
public class MultiEndFlag {
    private volatile boolean fired = false;
    //是否执行成功
    private volatile boolean isAllSuccess = false;
    private volatile int threadCount = 0;
    private volatile int failCount = 0;

    /**
     * 初始化子线程的总数
     * @param count
     */
    public MultiEndFlag(int count){
        threadCount = count;
    }

    public boolean isAllSuccess() {
        return isAllSuccess;
    }

    /**
     * 等待全部结束
     * @param threadId
     * @param result
     */
    public synchronized void waitForEnd(UUID threadId,int result){
        //统计失败的线程个数
        if(result==0){
            failCount++;
        }
        threadCount--;
        while (!fired){
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 执行结束通知
     */
    public synchronized void go(){
        fired = true;
        //结果都显示成功
        isAllSuccess = (failCount == 0);
        notifyAll();
    }
    /**
     * 等待结束
     */
    public void end(){
        while (threadCount > 0){
            waitFunc(50);
        }
        System.out.println("线程全部执行完毕通知");
        go();
    }

    /**
     * 等待
     */
    private void waitFunc(long millis){
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
