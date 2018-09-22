package simm.framework.threadutils.interrupt;

/**
 * 基础线程
 * 2018.09.22 by simm
 */
public abstract class BaseThread extends Thread {
    /**
     * futuretask 等待标志
     */
    private FTaskEndFlag flag = new FTaskEndFlag();

    public FTaskEndFlag getFlag() {
        return flag;
    }
}
