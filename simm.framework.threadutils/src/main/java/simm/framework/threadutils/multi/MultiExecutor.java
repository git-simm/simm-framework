package simm.framework.threadutils.multi;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * 多线程切分执行器
 * 2018.09.22 by simm
 */
public class MultiExecutor {
    private static int maxThreadCount = 10;
    /**
     * 执行方法(分批创建子线程)
     * @param saveService
     * @param notes
     * @param groupLen
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public static <T> Boolean exec(ISaveService saveService,List<T> notes,int groupLen) throws ExecutionException, InterruptedException {
        if(notes==null || notes.size()==0) return true;
        //创建一个线程池，最大10个线程
        ExecutorService executorService = Executors.newFixedThreadPool(maxThreadCount);
        List<Future<Integer>> futures = new ArrayList<>();
        int noteSize = notes.size();
        int batches = (int) Math.ceil(noteSize * 1.0 /groupLen);
        //分组超长最大线程限制，则设置分组数为10，计算分组集合尺寸
        if(batches>maxThreadCount){
            batches = maxThreadCount;
            groupLen = (int) Math.ceil(noteSize * 1.0 /batches);
        }
        System.out.println("总长度："+noteSize+"  批次信息："+batches+"  分组长度："+groupLen);
        MultiEndFlag flag = new MultiEndFlag(batches);
        int startIndex, toIndex, maxIndex = notes.size();
        for(int i=0;i<batches;i++){
            startIndex = i * groupLen;
            toIndex = startIndex + groupLen;
            if(toIndex> maxIndex) {
                toIndex = maxIndex;
            }
            List<T> temp = notes.subList(startIndex,toIndex);
            if(temp == null || temp.size()==0) continue;
            futures.add(executorService.submit(new DefaultExecTask(saveService,temp,flag)));
        }
        flag.end();
        //子线程全部等待返回(存在异常，则直接抛向主线程)
        for(Future<Integer> future:futures){
            future.get();
        }
        //所有线程返回后，关闭线程池
        executorService.shutdown();
        return true;
    }
}
