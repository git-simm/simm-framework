package simm.framework.test;

import org.junit.Test;
import sun.misc.Unsafe;

import java.lang.reflect.Field;

/**
 * 直接分配内存测试
 */
public class UnsafeTest {
    private static final int _1MB = 1024 * 1024;

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
}
