package simm.framework.jsonext.entity;

import java.lang.reflect.Field;

/**
 * 代理字段信息
 */
public class ProxyField {
    private Field field;
    private String fieldName;
    private String proxyName;

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public String getProxyName() {
        return proxyName;
    }

    public void setProxyName(String proxyName) {
        this.proxyName = proxyName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
}
