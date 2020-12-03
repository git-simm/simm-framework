package simm.framework.common.exception;

/**
 * @Desc: 业务异常封装
 * @Author: simm
 * @Date: 2020/11/9 11:30
 */
public enum CodeEnum implements IExceptionCode {
    IllegalAccessError(401,"未登录授权，操作非法"),
    Error(10000, "处理失败"),
    DATA_NOT_EXISTS(10001, "数据不存在"),
    JwtTimeoutError(10002,"客户JWT凭证已过期");

    private int key;

    private String value;

    CodeEnum(int key, String value) {
        this.key = key;
        this.value = value;
    }
    @Override
    public int getKey() {
        return key;
    }
    @Override
    public String getValue() {
        return value;
    }
}
