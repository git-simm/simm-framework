package simm.framework.common.utils.reflect;

import java.lang.annotation.*;

/**
 * 比较的相关配置
 * @author simm
 */
@Retention(RetentionPolicy.RUNTIME) // 注解会在class字节码文件中存在，在运行时可以通过反射获取到
@Target({ElementType.FIELD,ElementType.METHOD})//定义注解的作用目标**作用范围字段、枚举的常量/方法
@Documented //说明该注解将被包含在javadoc中
public @interface CompareMeta {
    String name() default "";
    String description() default "";
}
