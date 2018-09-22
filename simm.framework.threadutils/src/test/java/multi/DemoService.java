package multi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import simm.framework.threadutils.multi.DefaultExecTask;
import simm.framework.threadutils.multi.ISaveService;
import simm.framework.threadutils.multi.MultiEndFlag;
import simm.framework.threadutils.multi.MultiExecutor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

/**
 * 损益单保存服务
 */
@Service
public class DemoService implements ISaveService<NoteCheckBalance> {
    private static final Logger logger = LoggerFactory.getLogger(DefaultExecTask.class);
    @Autowired
    private NoteCheckBalanceMapper noteCheckBalanceMapper;

    /**
     * 业务保存
     * @param list
     */
    public void save(List<NoteCheckBalance> list){
        for(NoteCheckBalance item :list){
            noteCheckBalanceMapper.insert(item);
        }
    }
    /**
     * 批量保存事件
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public Integer batchSave(List<NoteCheckBalance> list, MultiEndFlag endFlag, UUID threadId) throws Exception {
        int result = 0;
        try{
            //业务操作
            save(list);
            result = 1;
            //进行waitForEnd 操作，是为了确保所有的线程都最终通知同步协作标志
            endFlag.waitForEnd(threadId ,result);
            //其他线程异常手工回滚
            if(result==1 && !endFlag.isAllSuccess()){
                String message = "子线程未全部执行成功，对线程["+threadId+"]进行回滚";
                throw new Exception(message);
            }
            return result;
        }catch (Exception ex){
            logger.error(ex.toString());
            if(result ==0){
                //本身线程异常抛出异常，通知已经做完（判断是为了防止 与 try块中的通知重复）
                endFlag.waitForEnd(threadId ,result);
            }
            throw ex;
        }
    }

    /**
     * 调用示例
     * @param args
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //调用示例
        MultiExecutor.exec(new DemoService(), new ArrayList<NoteCheckBalance>(),500);
    }
}

