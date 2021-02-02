package nacos.utils.test;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.nacos.common.utils.MD5Utils;
import org.junit.Assert;
import org.junit.Test;

/**
 * md5工具测试
 */
public class MD5UtilTest {
    @Test
    public void calcMd5(){
        JSONObject json = new JSONObject();
        json.put("name","司满");
        json.put("age",99);
        json.put("remark","nacos测试用户");
        String md5 = MD5Utils.md5Hex(JSON.toJSONString(json),"utf-8");
        System.out.println(md5);
        Assert.assertTrue(true);
    }
}
