package test.simm.webflux.events;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.context.ApplicationEvent;

/**
 * 报警事件
 * @author miscr
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class WarningEvent extends ApplicationEvent {
    private String message;

    public WarningEvent(Object source, String message) {
        super(source);
        this.message = message;
    }
}
