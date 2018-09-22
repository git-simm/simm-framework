package interrupt;

import simm.framework.threadutils.interrupt.BaseThread;

public class SyncProductThread extends BaseThread {
    private ProductBiz productBiz;
    private ProductDetailinfo productInfo;
    /**
     * 构造函数
     * @param productBiz
     * @param productInfo
     */
    public SyncProductThread(ProductBiz productBiz, ProductDetailinfo productInfo){
        this.productBiz = productBiz;
        this.productInfo = productInfo;
    }
    @Override
    public void run() {
        boolean isNormaled = false;
        Exception exception = null;
        try{
            productBiz.syncProduct(productInfo);
            isNormaled = true;
        }catch(Exception e){
            e.printStackTrace();
            exception = e;
        }finally {
            //通知子线程运行完毕了
            super.getFlag().notifyEnd(isNormaled,exception);
        }
    }
}
