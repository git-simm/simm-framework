package simm.framework.common.utils.valid;

import simm.framework.common.utils.valid.constraint.NotRepetitiveConstraints;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

/**
 * @author zhuCan
 * @description 验证字段是否重复
 * @since 2020-11-30 09:58
 **/
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(NotRepetitive.List.class)
@Documented
@Constraint(
        validatedBy = {NotRepetitiveConstraints.class}
)
public @interface NotRepetitive {

    String message() default "{com.mingyuanyun.application.exchange.infrastructure.annotation.NotRepetitive.message}";

    /**
     * 关联的表
     *
     * @return table
     */
    String table();

    /**
     * 关联的字段
     *
     * @return column
     */
    String column();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    @Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @interface List {
        NotRepetitive[] value();
    }
}
