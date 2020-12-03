package simm.framework.common.model;

import lombok.Data;

import java.io.Serializable;

/**
 * 服务调用结果组装
 * @author simm
 */
@Data
public class StringWrapper implements Serializable {
    private String result;
    /**
     * 错误码
     */
    private Integer code;
    /**
     * 是否成功
     */
    private Boolean success;
    /**
     * 错误消息
     */
    private String message;

    private Boolean unAuthorizedRequest;

    private String targetUrl;
    /**
     * 异常信息
     */
    private Error error;

    /**
     * 是否为成功码
     * @return
     */
    public boolean isSuccessCode(){
        return this.code==1;
    }
}
