package simm.framework.jsonext;

import java.lang.reflect.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class ReflectUtil {
    /**
     * 同步锁
     */
    private static Object _lock = new Object();
    /**
     * 代理字段缓存
     */
    //对类型缓存做线程安全处理
    private static Map<String,Field> fieldCache = Collections.synchronizedMap(new HashMap<String,Field>());

    /**
     * 获取字段信息
     * @param entity
     * @param fieldName
     * @param <E>
     * @return
     */
    public static <E> Field getField(E entity,String fieldName){
        String key = entity.getClass().getName()+"@"+fieldName;
        if(fieldCache.containsKey(key)) return fieldCache.get(key);
        synchronized (_lock){
            //双重检查
            if(fieldCache.containsKey(key)) return fieldCache.get(key);
            //开始解析
            Field f = null;
            try {
                f = entity.getClass().getDeclaredField(fieldName);
                f.setAccessible(true);
            } catch (NoSuchFieldException e) {
                e.printStackTrace();
            }
            fieldCache.put(key,f);
        }
        return fieldCache.get(key);
    }
    /**
     * 获取list 属性的 泛型类型
     * @param entity
     * @param fieldName
     * @return
     */
    public static <E> Class<?> getActClazz(E entity, String fieldName){
        Field f = getField(entity,fieldName);
        if(f.getType() == java.util.List.class){
            // 如果是List类型，得到其Generic的类型
            Type genericType = f.getGenericType();
            if(genericType == null) return null;
            // 如果是泛型参数的类型
            if(genericType instanceof ParameterizedType){
                ParameterizedType pt = (ParameterizedType) genericType;
                //得到泛型里的class类型对象
                Class<?> genericClazz = (Class<?>)pt.getActualTypeArguments()[0];
                return genericClazz;
            }
        }
        return (Class<?>) f.getGenericType();
    }
    /**
     * 获取字段值
     * @param target
     * @param fieldName
     * @param <E>
     * @return
     * @throws Exception
     */
    public static <E> Object getFieldVal(E target, String fieldName){
        try {
            return getField(target,fieldName).get(target);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 设置字段值
     * @param target
     * @param fieldName
     * @param <E>
     * @return
     */
    public static <E> void setFieldVal(E target, String fieldName,Object value) {
        try {
            getField(target,fieldName).set(target,value);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }
}
