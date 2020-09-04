package simm.framework.common.model;

import lombok.Data;

import java.io.Serializable;

/**
 * @author simm
 */
@Data
public class JsonResult<T> implements Serializable {
    public JsonResult(){
        this.resultCode=ERROR;
    }

    public JsonResult(boolean flag){
        this.resultCode= flag?SUCCESS:ERROR;
    }

    public static final int SUCCESS = 1000;
    public static final int ERROR = 1001;
    public static final int NOPERMISSION = 1011;
    public static final int UNLOGIN = 1002;
    public static final int PAYPASS_NOTEXIST = 1003;
    public static final int UPDATE_APP_VERSION = 1004;
    public static final int LOTTERY_BIZ_EXCEPTION = 1005;
    public static final int PASSWORD_TOO_SIMPLE = 1006;
    public static final int PROD_OFF_SHELF=9999;
    public static final int WARN=2001;

    private int resultCode;
    private T data;
    private String message;
    private String error;

    public void setError(String error) {
        this.resultCode=ERROR;
        this.error = error;
    }

    public JsonResult error(String error){
        this.message=error;
        this.error=error;
        this.resultCode=ERROR;
        return this;
    }

    public JsonResult error(String error2, int errorcode) {
        this.message=error2;
        this.error=error2;
        this.resultCode=errorcode;
        return this;
    }
}
