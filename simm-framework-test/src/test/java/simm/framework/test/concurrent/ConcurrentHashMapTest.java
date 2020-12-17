package simm.framework.test.concurrent;

import org.junit.Assert;
import org.junit.Test;

import java.util.concurrent.ConcurrentHashMap;

/**
 * 并发库测试
 */
public class ConcurrentHashMapTest {
    @Test
    public void test() {
        ConcurrentHashMap<Integer, Object> concurrentHashMap = new ConcurrentHashMap<>(32);
        concurrentHashMap.put(1, "simm");
        concurrentHashMap.put(33, "wangjin");
        concurrentHashMap.put(65, "zhoukuan");
        //hash(100);
//        for (int i = 0; ; ++i) {
//            System.out.println("i值：" + i);
//            if (i > 100) {
//                break;
//            }
//        }
        Assert.assertTrue(true);
    }

    /**
     * >>:带符号的移位 >>>:是不带符号的移位(左右做补零处理)
     *
     * @param h
     * @return
     */
    private int hash(int h) {
        // Spread bits to regularize both segment and index locations,
        // using variant of single-word Wang/Jenkins hash.
        h += (h << 15) ^ 0xffffcd7d;
        h ^= (h >>> 10);
        h += (h << 3);
        h ^= (h >>> 6);
        h += (h << 2) + (h << 14);
        return h ^ (h >>> 16);
    }
}
