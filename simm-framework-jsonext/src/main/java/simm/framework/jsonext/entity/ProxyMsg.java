package simm.framework.jsonext.entity;

import org.springframework.data.util.Pair;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 代理实体的信息
 */
public class ProxyMsg {
    //类型名
    private Class clazz;
    //字段名
    private String proxyName;
    //代理字段列表
    private List<ProxyField> fields;
    List<Pair<String,String>> listConfig;
    //json需要主要处理的字段映射
    HashMap<String,String> mapConfig;

    public Class getClazz() {
        return clazz;
    }

    public void setClazz(Class clazz) {
        this.clazz = clazz;
    }

    public String getProxyName() {
        return proxyName;
    }

    public void setProxyName(String proxyName) {
        this.proxyName = proxyName;
    }

    public List<ProxyField> getFields() {
        return fields;
    }

    public void setFields(List<ProxyField> fields) {
        this.fields = fields;
    }

    public HashMap<String, String> getMapConfig() {
        return mapConfig;
    }
    public void setMapConfig(HashMap<String, String> mapConfig) {
        this.mapConfig = mapConfig;
    }

    public List<Pair<String, String>> getListConfig() {
        return listConfig;
    }

    public void setListConfig(List<Pair<String, String>> listConfig) {
        this.listConfig = listConfig;
    }
}
