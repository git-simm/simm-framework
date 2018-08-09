package simm.framework.jsonext.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 代理属性(用于json序列化&反序列化)
 */
@Retention(value = RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface ProxyProp {
    //属性名
    String value();
}
