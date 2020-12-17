package simm.framework.common.model.httpbase;

import lombok.Data;

import java.io.Serializable;

/**
 * 请求基础参数
 * @author simm
 */
@Data
public abstract class BaseClientOptions implements Serializable {
    /**
     * 基础地址
     */
    private String baseAddress;
}
