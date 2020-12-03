package simm.framework.common.exception;

import java.io.Serializable;

/**
 * @Desc: 业务异常封装
 * @Author: simm
 * @Date: 2020/11/9 11:30
 */
public class BizException extends RuntimeException implements Serializable {

    private IExceptionCode codeEnum;

    private Object data;

    private Exception exception;
    public BizException(String message,Exception exception) {
        super(message);
        this.codeEnum = CodeEnum.Error;
        this.exception = exception;
    }
    public BizException(String message) {
        super(message);
        this.codeEnum = CodeEnum.Error;
    }
    public BizException(IExceptionCode codeEnum) {
        super(codeEnum.getValue());
        this.codeEnum = codeEnum;
    }
    public BizException(IExceptionCode codeEnum, String message) {
        super(message);
        this.codeEnum = codeEnum;
    }

    public BizException(IExceptionCode codeEnum, Object data) {
        this.codeEnum = codeEnum;
        this.data = data;
    }

    public BizException(IExceptionCode codeEnum, String message, Object data) {
        super(message);
        this.codeEnum = codeEnum;
        this.data = data;
    }

    public IExceptionCode getCodeEnum() {
        return codeEnum;
    }

    public void setCodeEnum(IExceptionCode codeEnum) {
        this.codeEnum = codeEnum;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Exception getException() {
        return exception;
    }

    public void setException(Exception exception) {
        this.exception = exception;
    }
}