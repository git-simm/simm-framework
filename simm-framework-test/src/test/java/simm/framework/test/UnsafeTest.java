package simm.framework.test;

import cn.hutool.core.lang.Assert;
import org.junit.Test;
import sun.misc.Unsafe;

import java.lang.reflect.Field;
import java.util.HashMap;

/**
 * 直接分配内存测试
 */
public class UnsafeTest {
    private static final int _1MB = 1024 * 1024;

    private final static ThreadLocal<HashMap<String,Object>> THREAD_LOCAL = new ThreadLocal<>();

    /**
     * java.lang.OutOfMemoryError 异常测试
     * @throws Exception
     */
    @Test
    public void allocate() throws Exception {
        Field unsafeField = Unsafe.class.getDeclaredFields()[0];
        unsafeField.setAccessible(true);
        Unsafe unsafe = (Unsafe) unsafeField.get(null);
        while (true) {
            unsafe.allocateMemory(_1MB);
        }
    }

    /**
     * 大对象直接分配在老年代
     */
    @Test
    public void testPretenureSizeThreshold(){
        byte[] allocation;
        //直接分配在老年代中
        allocation = new byte[4*_1MB];
        Assert.isTrue(true);
    }

    /**
     * 对象分配
     */
    @Test
    public void testTenuringThreshold(){
        byte[] allocation1,allocation2,allocation3;
        allocation1 = new byte[_1MB/4];
        allocation2 = new byte[4*_1MB];
        allocation3 = new byte[4*_1MB];
        allocation3 = null;
        allocation3 = new byte[4*_1MB];
        Assert.isTrue(true);
    }
}
