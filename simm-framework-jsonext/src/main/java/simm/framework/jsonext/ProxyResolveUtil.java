package simm.framework.jsonext;

import org.springframework.data.util.Pair;
import simm.framework.jsonext.annotations.ProxyEntity;
import simm.framework.jsonext.annotations.ProxyProp;
import simm.framework.jsonext.entity.ProxyField;
import simm.framework.jsonext.entity.ProxyMsg;

import java.lang.reflect.Field;
import java.util.*;

/**
 * 代理信息解析工具
 */
public class ProxyResolveUtil {
    /**
     * 同步锁
     */
    private static Object _lock = new Object();
    /**
     * 代理类型缓存
     */
    //对类型缓存做线程安全处理
    private static Map<String,ProxyMsg> clazzCache = Collections.synchronizedMap(new HashMap<String,ProxyMsg>());

    /**
     * 获取代理信息
     * @param clazz
     * @return
     */
    public static ProxyMsg getProxyMsg(Class clazz){
        String key = clazz.getName();
        if(clazzCache.containsKey(key)) return clazzCache.get(key);
        synchronized (_lock){
            //双重检查
            if(clazzCache.containsKey(key)) return clazzCache.get(key);
            //开始解析
            clazzCache.put(key,getClazzProxyMsg(clazz));
        }
        return clazzCache.get(key);
    }

    /**
     * 获取类型代理信息
     * @param clazz
     * @return
     */
    private static ProxyMsg getClazzProxyMsg(Class clazz){
        ProxyEntity proxyEntity = (ProxyEntity) clazz.getAnnotation(ProxyEntity.class);
        if(proxyEntity==null) return null;
        ProxyMsg proxyMsg = new ProxyMsg();
        proxyMsg.setClazz(clazz);
        proxyMsg.setProxyName(proxyEntity.value());
        //解析字段信息
        List<ProxyField> propList = new ArrayList<>();
        List<Pair<String, String>> listConfig= new ArrayList<>();
        HashMap<String, String> mapConfig= new HashMap<>();
        for (Field field: clazz.getDeclaredFields()){
            ProxyProp proxyProp = field.getAnnotation(ProxyProp.class);
            if(proxyProp == null){
                mapConfig.put(field.getName(),field.getName());
                continue;
            }else{
                ProxyField pField = new ProxyField();
                pField.setField(field);
                pField.setFieldName(field.getName());
                pField.setProxyName(proxyProp.value());
                propList.add(pField);
                //beanutils 做属性拷贝时，使用该参数
                listConfig.add(Pair.of(pField.getProxyName(),pField.getFieldName()));
                mapConfig.put(pField.getProxyName(),pField.getFieldName());
            }
        }
        proxyMsg.setFields(propList);
        proxyMsg.setListConfig(listConfig);
        proxyMsg.setMapConfig(mapConfig);
        return proxyMsg;
    }
}
