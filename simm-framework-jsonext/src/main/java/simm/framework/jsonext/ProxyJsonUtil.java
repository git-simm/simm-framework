package simm.framework.jsonext;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.parser.ParserConfig;
import com.alibaba.fastjson.util.TypeUtils;
import org.springframework.data.util.Pair;
import simm.framework.jsonext.entity.ProxyMsg;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProxyJsonUtil {
    /**
     * 批量拷贝
     * @param source
     * @param clazz
     * @param <E>
     * @param deepCopy 是否需要递归处理
     * @return
     */
    public static <E> List<E> cast(List<JSONObject> source, Class<E> clazz,boolean deepCopy) {
        List<E> result = new ArrayList<>();
        for (JSONObject t : source) {
            E object = cast(t, clazz, deepCopy);
            result.add(object);
        }
        return result;
    }

    /**
     * 单条拷贝
     * @param source
     * @param clazz
     * @param <E>
     * @return
     */
    public static <E> E cast(JSONObject source, Class<E> clazz, boolean deepCopy) {
        return copyProperties(source, clazz, deepCopy);
    }

    /**
     * 拷贝属性
     * @param source
     * @param clazz
     * @param <E>
     * @param deepCopy
     * @return
     */
    private static <E> E copyProperties(JSONObject source, Class<E> clazz, boolean deepCopy) {
        try {
            E object = TypeUtils.castToJavaBean(source, clazz, ParserConfig.getGlobalInstance());
            copyProperties(source, object, deepCopy);
            return object;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * JsonObject属性值拷贝
     * @param source
     * @param target
     * @param <E>
     * @param deepCopy
     */
    private static <E> void copyProperties(JSONObject source,E target, boolean deepCopy) throws Exception {
        if(deepCopy){
            //深层递归，处理子对象赋值
            proxyEntityCast(source, target, deepCopy);
        }
        //代理字段赋值
        proxyFieldCast(source, target);
    }

    /**
     * 深层递归，处理子对象赋值
     * @param source
     * @param target
     * @param deepCopy
     * @param <E>
     * @throws Exception
     */
    private static <E> void proxyEntityCast(JSONObject source, E target, boolean deepCopy) throws Exception {
        ProxyMsg msg = ProxyResolveUtil.getProxyMsg(target.getClass());
        Map<String,String> map = msg.getMapConfig();
        for (Map.Entry<String, Object> entry : source.entrySet()){
            //映射实体不包含该属性，则退出代理赋值
            if(!map.containsKey(entry.getKey())) {
                continue;
            }
            //获取映射实体的字段名
            String fieldName = map.get(entry.getKey());
            Object value = entry.getValue();
            if(value instanceof JSONArray){
                jsonArrayCast(target, deepCopy, fieldName, (JSONArray) value);
            }else if(value instanceof JSONObject){
                jsonObjectCast(target, deepCopy, fieldName, (JSONObject) value);
            }
        }
    }

    /**
     * JSONObject转换处理
     * @param target
     * @param deepCopy
     * @param fieldName
     * @param value
     * @param <E>
     * @throws Exception
     */
    private static <E> void jsonObjectCast(E target, boolean deepCopy, String fieldName, JSONObject value) throws Exception {
        //属性是一个JSONObject 对象
        Object fieldTarget = ReflectUtil.getFieldVal(target, fieldName);
        if(fieldTarget == null){
            Type fieldType = ReflectUtil.getField(target, fieldName).getGenericType();
            ReflectUtil.setFieldVal(target, fieldName,copyProperties(value,(Class)fieldType,deepCopy));
        }else{
            //递归为JsonObject属性赋值
            copyProperties(value,fieldTarget,deepCopy);
        }
    }

    /**
     * JSONArray 字段处理
     * @param target
     * @param deepCopy
     * @param fieldName
     * @param value
     * @param <E>
     * @throws Exception
     */
    private static <E> void jsonArrayCast(E target, boolean deepCopy, String fieldName, JSONArray value) throws Exception {
        //属性是一个 JSONArray 的列表对象
        //获取需要被赋值的目标对象
        Object fieldTarget = ReflectUtil.getFieldVal(target, fieldName);
        //目标对象为空，退出运行
        Class<?> fieldGenericClazz = ReflectUtil.getActClazz(target,fieldName);
        if(fieldTarget == null){
            fieldTarget = new ArrayList();
            ReflectUtil.setFieldVal(target, fieldName,fieldTarget);
        }
        JSONArray tempList = value;
        if(fieldTarget instanceof List){
            // 如果是List类型，得到其Generic的类型
            List<Object> temps = (List<Object>)fieldTarget;
            for(int i=0;i<tempList.size();i++){
                //递归为JsonObject属性赋值
                if(temps.size()<=i){
                    //自动创建新对象
                    temps.add(copyProperties((JSONObject)tempList.get(i),fieldGenericClazz,deepCopy));
                }else{
                    copyProperties((JSONObject)tempList.get(i),temps.get(i),deepCopy);
                }
            }
        }
    }
    /**
     * 代理字段赋值
     * @param source
     * @param target
     * @param <E>
     */
    private static <E> void proxyFieldCast(JSONObject source, E target) {
        //代理字段赋值
        ProxyMsg msg = ProxyResolveUtil.getProxyMsg(target.getClass());
        for (Pair<String, String> pair : msg.getListConfig()) {
            String key = pair.getFirst();
            if(!source.containsKey(key)) {
                continue;
            }
            Object value = source.get(key);
            if(value instanceof JSONArray || value instanceof JSONObject) {
                continue;
            }
            ReflectUtil.setFieldVal(target, pair.getSecond(),value);
        }
    }
}
