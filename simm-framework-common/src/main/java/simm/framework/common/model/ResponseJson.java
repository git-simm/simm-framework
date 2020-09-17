package simm.framework.common.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class ResponseJson<T> implements Serializable {

    /**
     * 业务正常操作完成
     */
    public static final int CODE_OK = 1000;
    /**
     * 业务操作异常
     */
    public static final int CODE_ERR = 4001;
    /**
     * 无权限
     */
    public static final int NO_PERMISSION = 40003;
    /**
     * token过期
     */
    public static final int CODE_UN_AUTH = 60003;
    /**
     * 无token，未登录
     */
    public static final int CODE_UN_LOGIN = 10001;

    /**
     * 状态码
     */
    private int code;

    /**
     * 提示信息
     */
    private String message;

    /**
     * 返回的数据
     */
    private T data;

    /**
     * 正常返回：带数据
     * @param data
     * @return
     */
    public static <T> ResponseJson success(T data) {
        ResponseJson json = new ResponseJson();
        json.setCode(CODE_OK);
        json.setData(data);
        return json;
    }

    /**
     * 正常返回：不带数据
     * @return
     */
    public static <T> ResponseJson success() {
        ResponseJson json = new ResponseJson();
        json.setCode(CODE_OK);
        return json;
    }

    /**
     * 异常返回：带异常提示信息
     * @param message
     * @return
     */
    public static <T> ResponseJson fail(String message) {
        ResponseJson json = new ResponseJson();
        json.setCode(CODE_ERR);
        json.setMessage(message);
        return json;
    }

    /**
     * 异常返回：带异常编码和异常信息
     * @param message
     * @return
     */
    public static <T> ResponseJson fail(String message, int code) {
        ResponseJson json = new ResponseJson();
        json.setCode(code);
        json.setMessage(message);
        return json;
    }

}
