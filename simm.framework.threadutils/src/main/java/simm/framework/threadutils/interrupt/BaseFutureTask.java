package simm.framework.threadutils.interrupt;

import java.util.concurrent.Callable;

/**
 * 基础任务
 * 2018.09.22 by simm
 */
public abstract class BaseFutureTask implements Callable<Boolean> {
    /**
     * futuretask 等待标志
     */
    private FTaskEndFlag flag = new FTaskEndFlag();

    public FTaskEndFlag getFlag() {
        return flag;
    }
}
