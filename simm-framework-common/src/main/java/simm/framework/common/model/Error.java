package simm.framework.common.model;

import lombok.Data;

/**
 * 异常返回
 * @author simm
 */
@Data
public class Error {
    private Integer code;
    private String message;
    private String details;
}
