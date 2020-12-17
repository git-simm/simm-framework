package simm.framework.test;

import org.junit.Assert;
import org.junit.Test;

/**
 * 状态测试
 */
public class StatusTest {
    /**
     * 上架状态
     */
    private final int onSaleStatus = 0b001;
    /**
     * 下架状态
     */
    private final int offSaleStatus = 0b010;
    /**
     * 有货状态变迁
     */
    private final int hasChange = 0b100;
    /**
     * 测试状态转换
     */
    @Test
    public void test(){
        // 有货、未上架、未下架
        int initStatus = 0b100;
        System.out.println("是否上架状态:"+ (initStatus & onSaleStatus));
        if((initStatus & onSaleStatus)==0){
            initStatus = initStatus | onSaleStatus;
            System.out.println("initStatus状态:"+ initStatus);
        }
        int hasStatus = 0b011;
        System.out.println("缺货状态变更:"+ ((initStatus ^ hasStatus) & hasChange));
        if(((initStatus ^ hasStatus) & hasChange) == hasChange){
            initStatus = (initStatus & hasStatus);
            System.out.println("initStatus状态:"+ initStatus);
        }
        hasStatus = 0b011;
        System.out.println("缺货状态变更:"+ ((initStatus ^ hasStatus) & hasChange));
        if(((initStatus ^ hasStatus) & hasChange) == hasChange){
            initStatus = (initStatus & hasStatus);
            System.out.println("initStatus状态:"+ initStatus);
        }
        hasStatus = 0b100;
        System.out.println("补货状态变更:"+ ((initStatus ^ hasStatus) & hasChange));
        if(((initStatus ^ hasStatus) & hasChange) == hasChange){
            initStatus = (initStatus | hasStatus);
            System.out.println("initStatus状态:"+ initStatus);
        }
        System.out.println("是否下架状态:"+ (initStatus & offSaleStatus));
        if((initStatus & offSaleStatus)==0){
            initStatus = initStatus | offSaleStatus;
            System.out.println("initStatus状态:"+ initStatus);
        }
        Assert.assertTrue(true);
    }
}
