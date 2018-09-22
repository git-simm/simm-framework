package simm.framework.threadutils.multi;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;

/**
 * 默认的执行任务
 * 2018.09.22 by simm
 */
public class DefaultExecTask<T> implements Callable<Integer> {
    private List<T> list;
    private ISaveService saveService;
    private MultiEndFlag endFlag;
    private UUID threadId;
    /**
     * 盘库子任务
     * @param saveService
     * @param notes
     * @param flag
     */
    public DefaultExecTask(ISaveService saveService, List<T> notes, MultiEndFlag flag){
        this.saveService = saveService;
        this.list = notes;
        this.endFlag = flag;
        this.threadId = UUID.randomUUID();
    }
    @Override
    public Integer call() throws Exception {
        return saveService.batchSave(this.list,this.endFlag,this.threadId);
    }
}
