package simm.framework.threadutils.multi;

import java.util.List;
import java.util.UUID;

/**
 * 保存服务接口
 * 2018.09.22 by simm
 * @param <T>
 */
public interface ISaveService<T> {
    /**
     * 子线程批量保存方法
     * @param list
     * @param endFlag
     * @param threadId
     * @return
     * @throws Exception
     */
    Integer batchSave(List<T> list, MultiEndFlag endFlag, UUID threadId) throws Exception;
}
