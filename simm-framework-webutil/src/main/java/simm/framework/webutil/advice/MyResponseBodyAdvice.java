package simm.framework.webutil.advice;

import com.alibaba.fastjson.JSON;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import simm.framework.common.model.JsonResult;

/**
 * 数据返回结构统一组装
 *
 * @author simm
 */
@ControllerAdvice
public class MyResponseBodyAdvice implements ResponseBodyAdvice {
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    /**
     * 处理string转换器
     */
    private final static String HTTP_MESSAGE_CONVERTER = "StringHttpMessageConverter";

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if(JsonResult.class.isAssignableFrom(body.getClass())){
            //异常已经被包装
            return body;
        }
        //将返回值包装成jsonresult结构
        JsonResult<Object> jsonResult = new JsonResult<>(true);
        jsonResult.setData(body);
        if (selectedConverterType.getSimpleName().contains(HTTP_MESSAGE_CONVERTER)) {
            return JSON.toJSONString(jsonResult);
        }
        return jsonResult;
    }
}
