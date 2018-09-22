package interrupt;

import simm.framework.threadutils.interrupt.BaseFutureTask;

/**
 * 产品同步的任务
 */
public class SyncProductTask extends BaseFutureTask {
    private ProductBiz productBiz;
    private ProductDetailinfo productInfo;
    /**
     * 构造函数
     * @param productBiz
     * @param productInfo
     */
    public SyncProductTask(ProductBiz productBiz, ProductDetailinfo productInfo){
        this.productBiz = productBiz;
        this.productInfo = productInfo;
    }

    /**
     * 调用方法
     * @return
     */
    @Override
    public Boolean call() {
        boolean isNormaled = false;
        try{
            productBiz.syncProduct(productInfo);
            isNormaled = true;
            return true;
        }finally {
            //通知子线程运行完毕了
            super.getFlag().notifyEnd(isNormaled);
        }
    }
}


//    @Autowired
//    private TimeoutProperties timeoutProperties;
//    /**
//     * 超时中断的同步方法
//     * @param productInfo
//     * @throws InterruptedException
//     * @throws ExecutionException
//     * @throws TimeoutException
//     */
//    public void syncProductTimeout(final ProductDetailinfo productInfo) throws Exception {
//        Long timeout = timeoutProperties.getSyncProduct_Timeout();
//        Long interval = timeoutProperties.getSyncProduct_Interval();
//        if(timeout.equals(0)){
//            timeout = 3000L;
//        }
//        if(interval.equals(0)){
//            interval = 1000L;
//        }
//        RetryUtil.execute(SyncProductThread.class,Arrays.asList(productBiz,productInfo),timeout,interval,3);
//        //RetryUtil.execute(new SyncProductTask(productBiz,productInfo),timeout,interval,3);
//    }
