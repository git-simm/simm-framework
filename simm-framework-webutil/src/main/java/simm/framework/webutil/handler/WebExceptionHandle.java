package simm.framework.webutil.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import simm.framework.common.model.ResponseJson;

/**
 * @author simm
 */ //@ControllerAdvice 各项目组自由决定是否注册全局的MVC异常拦截器
@ResponseBody
@Slf4j
public class WebExceptionHandle {

    /**
     * 400 - Bad Request
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseJson handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error("web请求参数解析失败", e);
        return ResponseJson.fail("Controller请求参数解析失败！");
    }

    /**
     * 405 - Method Not Allowed
     */
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseJson handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error("不支持当前请求方法", e);
        return ResponseJson.fail("Controller请求的Method不支持！");
    }

    /**
     * 415 - Unsupported Media Type
     */
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseJson handleHttpMediaTypeNotSupportedException(Exception e) {
        log.error("不支持当前媒体类型", e);
        return ResponseJson.fail("Controller请求的MediaType不支持！");
    }

//    /**
//     * 200
//     */
//    @ResponseStatus(HttpStatus.OK)
//    @ExceptionHandler(Exception.class)
//    public ResponseJson handleException(Exception exp) {
//        if (exp instanceof BizException){
//            return ResponseJson.fail(((BizException) exp).getErrMessage(), ((BizException) exp).getErrorCode());
//        } else if(exp instanceof RpcException) {
//            // TODO
//            return ResponseJson.fail("RPC服务调用异常，原始异常信息：" + exp.getMessage());
//        } else if(exp instanceof NoPermissionException) {
//            // 无权限
//            return ResponseJson.fail(exp.getMessage(), ResponseJson.NO_PERMISSION);
//        }
//        log.error("未捕获的异常", exp);
//        ResponseJson result = ResponseJson.fail("请求异常，请重试或联系系统管理员！");
//        result.setData(ExceptionUtils.getStackTrace(exp));
//        return result;
//    }
}
