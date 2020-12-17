package simm.framework.test;

import org.junit.Assert;
import org.junit.Test;

/**
 * 常量区测试
 */
public class StringTest {
    @Test
    public void test(){
//        ManagementFactory.getThreadMXBean();
        String s3 = "123" + "123";
        // 数据会放到heap(堆)上的 常量区
        s3.intern();
        String s4 = "123123";
        StringBuilder sb = new StringBuilder();
        sb.append("123123");
        System.out.println(s3 == s4);
        Assert.assertTrue(true);
    }
}
