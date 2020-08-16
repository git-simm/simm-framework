package simm.framework.webutil.model;

/**
 * @author simm
 */
public class BizException extends RuntimeException {

    private CodeEnum codeEnum;

    private Object data;

    public BizException(String message) {
        super(message);
        this.codeEnum = CodeEnum.Error;
    }

    public BizException(CodeEnum codeEnum, String message) {
        super(message);
        this.codeEnum = codeEnum;
    }

    public BizException(CodeEnum codeEnum, Object data) {
        this.codeEnum = codeEnum;
        this.data = data;
    }

    public BizException(CodeEnum codeEnum, String message, Object data) {
        super(message);
        this.codeEnum = codeEnum;
        this.data = data;
    }

    public CodeEnum getCodeEnum() {
        return codeEnum;
    }

    public void setCodeEnum(CodeEnum codeEnum) {
        this.codeEnum = codeEnum;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
