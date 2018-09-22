package simm.framework.threadutils.interrupt;

import java.util.concurrent.TimeoutException;
/**
 * futuretask运行终止事件通知
 * 2018.09.22 by simm
 */
public class FTaskEndFlag {
    private volatile boolean isNormaled = false;
    private volatile boolean fired = false;
    private Exception exception =null;

    public boolean isNormaled() {
        return isNormaled;
    }

    /**
     * 获取子线程异常信息
     * @return
     */
    public Exception getException() {
        return exception;
    }

    /**
     * 通知结束
     * @param result
     * @param result
     */
    public synchronized void notifyEnd(boolean result){
        isNormaled = result;
        fired = true;
        notifyAll();
    }

    /**
     * 通知结束
     * @param result
     * @param result
     */
    public synchronized void notifyEnd(boolean result,Exception ex){
        isNormaled = result;
        exception = ex;
        fired = true;
        notifyAll();
    }

    /**
     * 执行结束通知
     */
    public synchronized void waitForEnd() throws InterruptedException {
        while (!fired) {
            //子线程挂起，释放synchronized同步块
            wait();
        }
    }
    /**
     * 执行结束通知
     */
    public void waitForEnd(Thread thread,Long timeout) throws TimeoutException {
        long begin = System.currentTimeMillis();
        while(System.currentTimeMillis()-begin <= timeout){
            waitFunc(10);
            //子线程已经执行完毕，则返回
            if(fired) return;
        }
        //超时未返回，则终止线程
        try{
            thread.stop();
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
        throw new TimeoutException("方法执行超出时限:"+timeout);
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
