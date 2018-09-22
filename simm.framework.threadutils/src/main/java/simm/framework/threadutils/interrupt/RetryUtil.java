package simm.framework.threadutils.interrupt;

import java.lang.reflect.Constructor;
import java.util.List;
import java.util.concurrent.*;
/**
 * 方法超时重试工具
 * 2018.09.20  by simm
 */
public class RetryUtil {
    /**
     * 可缓存线程执行器(依jvm情况自行回收创建)
     */
    private static ExecutorService executorService = Executors.newCachedThreadPool();

    /**
     * 默认方法(3秒超时,重试3次)
     * @param callable
     * @return
     * @throws InterruptedException
     * @throws ExecutionException
     * @throws TimeoutException
     */
    public static Boolean execute(BaseFutureTask callable) throws InterruptedException, ExecutionException, TimeoutException {
        return execute(callable,3000,1000,3);
    }

    /**
     * 方法超时控制
     * @param callable 方法体
     * @param timeout 超时时长
     * @param interval 间隔时长
     * @param retryTimes 重试次数
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     * @throws TimeoutException
     */
    public static Boolean execute(BaseFutureTask callable, long timeout,long interval, int retryTimes) throws ExecutionException, InterruptedException, TimeoutException {
        Boolean result = false;
        FutureTask<Boolean> futureTask = new FutureTask<>(callable);
        executorService.execute(futureTask);
        try {
            result = futureTask.get(timeout, TimeUnit.MILLISECONDS);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            futureTask.cancel(true);
            throw e;
        }catch(TimeoutException e){
            futureTask.cancel(true);
            callable.getFlag().waitForEnd();
            if(callable.getFlag().isNormaled()){
                return true;
            }
            e.printStackTrace();
            //超时重试
            retryTimes--;
            if(retryTimes > 0){
                Thread.sleep(interval);
                execute(callable,timeout,interval,retryTimes);
            }else{
                throw e;
            }
        }
        return result;
    }

    /**
     * 默认方法(3秒超时,重试3次)
     * @param syncThread
     * @param params
     * @param <T>
     * @return
     * @throws Exception
     */
    public static <T extends BaseThread> Boolean execute(Class<T> syncThread, List<Object> params) throws Exception {
        return execute(syncThread,params,3000,1000,3);
    }

    /**
     * 方法超时控制
     * @param syncThread 线程类
     * @param params 线程构造参数
     * @param timeout
     * @param interval
     * @param retryTimes
     * @param <T>
     * @return
     * @throws Exception
     */
    public static <T extends BaseThread> Boolean execute(Class<T> syncThread, List<Object> params, long timeout, long interval, int retryTimes) throws Exception {
        Boolean result = false;
        try{
            //参数类型数组
            Class[] parameterTypeArrs = new Class[params.size()];
            for(int i=0;i<params.size();i++){
                Class c =  params.get(i).getClass();
                if(c.getName().indexOf("$$")>0){
                    String clsName = c.getName().substring(0,c.getName().indexOf("$$"));
                    parameterTypeArrs[i] = Class.forName(clsName);
                }else{
                    parameterTypeArrs[i] = c;
                }
            }
            //根据参数类型获取相应的构造函数
            Constructor constructor= syncThread.getConstructor(parameterTypeArrs);
            //参数数组
            Object[] parameters= params.toArray();
            //根据获取的构造函数和参数，创建实例
            BaseThread processor = (BaseThread) constructor.newInstance(parameters);
            processor.start();
            //等待线程结束
            processor.getFlag().waitForEnd(processor,timeout);
            boolean r = processor.getFlag().isNormaled();
            if(!r){
                throw processor.getFlag().getException();
            }
            return processor.getFlag().isNormaled();
        }catch (TimeoutException e) {
            //超时重试
            retryTimes--;
            if(retryTimes > 0){
                System.out.println("方法开始重试："+retryTimes);
                Thread.sleep(interval);
                execute(syncThread,params,timeout,interval,retryTimes);
            }else{
                throw e;
            }
        }
        return result;
    }
}
