package multi;

import org.junit.Assert;
import org.junit.Test;

/**
 * 字符串测试
 */
public class StringTest {
    /**
     * 测试intern
     */
    @Test
    public void testIntern() {
        String a = "a", b = "bc";
        final String a1 = "a", b1 = "bc";
        String s1 = "abc";
        String s2 = "abc";
        String s3 = new String("abc");
        String s4 = s3.intern();
        String s5 = new String("a") + new String("bc");
        String s6 = new StringBuffer("a").append("bc").toString();
        String s7 = s5.intern();
        String s8 = s6.intern();
        // 运行时赋值
        String s9 = a + b;
        // final 字符串，在编译期就会直接替换成常量
        String s10 = a1 + b1;
        System.out.println("s1==s2:" + (s1 == s2));
        System.out.println("s1==s3:" + (s1 == s3));
        System.out.println("s1==s4:" + (s1 == s4));
        System.out.println("s1==s5:" + (s1 == s5));
        System.out.println("s1==s6:" + (s1 == s6));
        System.out.println("s1==s7:" + (s1 == s7));
        System.out.println("s1==s8:" + (s1 == s8));
        System.out.println("s1==s9:" + (s1 == s9));
        System.out.println("s1==s10:" + (s1 == s10));
        Assert.assertTrue(true);
    }
}
