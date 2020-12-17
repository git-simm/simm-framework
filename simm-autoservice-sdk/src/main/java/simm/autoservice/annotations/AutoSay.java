package simm.autoservice.annotations;

import java.lang.annotation.*;

/**
 * @author miscr
 */
@Documented
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.SOURCE)
public @interface AutoSay {
    String start() default "hello";
}
