package simm.framework.jsonext.test;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.junit.Test;
import simm.framework.jsonext.ProxyJsonUtil;

import java.util.List;

/**
 * 调用测试
 */
public class CallerTest {
    /**
     * 获取集合数据(递归处理)
     * @param <E>
     * @return
     */
    public <E> List<E> postDeepArray(Class<E> clazz) {
        JSONArray array = new JSONArray();
        return ProxyJsonUtil.cast(array.toJavaList(JSONObject.class),clazz,true);
    }
    /**
     * 获取集合数据
     * @param <E>
     * @return
     */
    public <E> List<E> postArray(Class<E> clazz) {
        JSONArray array = new JSONArray();
        return ProxyJsonUtil.cast(array.toJavaList(JSONObject.class),clazz,false);
    }
    /**
     * 获取对象(深层调用)
     * @param <E>
     * @return
     */
    public <E> E postDeep(Class<E> clazz) {
        JSONObject obj = new JSONObject();
        return ProxyJsonUtil.cast(obj,clazz,true);
    }
    /**
     * 获取对象
     * @param <E>
     * @return
     */
    public <E> E post(Class<E> clazz) {
        JSONObject obj = new JSONObject();
        return ProxyJsonUtil.cast(obj,clazz,false);
    }
}
