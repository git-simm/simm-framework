package nacos.utils.test;

import com.alibaba.nacos.client.naming.utils.ThreadLocalRandom;
import org.junit.Assert;
import org.junit.Test;
import java.util.Arrays;

public class BinarySearchTest {
    @Test
    public void binarySearchValid(){
        double[] a = new double[3];
        a[0] = 1;
        a[1] = 100;
        a[2] = 1000;
        double random = ThreadLocalRandom.current().nextDouble(0.0D, 1.0D);
        int index = Arrays.binarySearch(a, random);
        System.out.println(index);
        Assert.assertTrue(true);
    }
}
