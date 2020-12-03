package simm.framework.common.utils.oauth2;

import org.springframework.util.MultiValueMap;
import rx.functions.Func0;
import simm.framework.common.utils.oauth2.model.IMethodFeature;

import java.util.function.Consumer;

/**
 * 网关模板工具类
 * @author simm
 */
public interface GatewayTemplate {
    <T> T getResponse(IMethodFeature methodEnum, Object map, Class<T> responseType, Object... args);
    <T> T parseWithRdcDateAndResultWrapper(String json, Class<T> clazz);
    <T> T parseWithRdcDate(String json, Class<T> clazz);
    <T> T tryDispatch(Func0<T> func, String message, T defaultVal);

    /**
     * 上传文件
     * @param methodEnum 方法枚举
     * @param formConsumer form表单的消费
     * @param retryTimes 重试次数
     * @param responseType 响应类型
     * @param <T> 返回对象
     * @return
     */
    <T> T transferFile(IMethodFeature methodEnum, Consumer<MultiValueMap<String, Object>> formConsumer, int retryTimes, Class<T> responseType);
}
