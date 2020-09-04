package simm.framework.webutil.advice;

import io.netty.util.internal.ThrowableUtil;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.HandlerMethod;
import simm.framework.common.model.BizException;
import simm.framework.common.model.JsonResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author simm
 */
@ControllerAdvice
public class MyExceptionHandlerAdvice {
    /**
     * 处理业务异常
     * @param request
     * @param response
     * @param handler
     * @param ex
     * @return
     */
    @ExceptionHandler(BizException.class)
    @ResponseBody
    JsonResult handleBizException(HttpServletRequest request, HttpServletResponse response, HandlerMethod handler, Throwable ex) {
        JsonResult result = new JsonResult(false);
        result.error(ex.getMessage());
        return result;
    }

    /**
     * 处理业务异常
     * @param request
     * @param response
     * @param handler
     * @param ex
     * @return
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    JsonResult handleException(HttpServletRequest request, HttpServletResponse response, HandlerMethod handler, Throwable ex) {
        JsonResult result = new JsonResult(false);
        result.error(ThrowableUtil.stackTraceToString(ex));
        return result;
    }
}