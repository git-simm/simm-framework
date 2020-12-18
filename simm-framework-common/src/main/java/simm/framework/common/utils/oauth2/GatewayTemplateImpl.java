package simm.framework.common.utils.oauth2;

import cn.hutool.core.lang.func.Func0;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.ParserConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import simm.framework.common.exception.BizException;
import simm.framework.common.exception.CodeEnum;
import simm.framework.common.model.AuthInfo;
import simm.framework.common.model.Constants;
import simm.framework.common.model.StringWrapper;
import simm.framework.common.utils.oauth2.model.IMethodFeature;
import simm.framework.common.utils.oauth2.model.IServiceFeature;
import simm.framework.common.utils.oauth2.model.ValidTypeEnum;
import simm.framework.common.utils.serializer.RdcDateDeserializer;

import java.util.Collections;
import java.util.Date;
import java.util.function.Consumer;

/**
 * 网关服务调用模板
 *
 * @author simm
 */
@Slf4j
public class GatewayTemplateImpl implements GatewayTemplate {
    /**
     * 请求模板
     */
    private final String host;
    private final RestTemplate restTemplate;
    private final ClientTokenTemplate clientTokenTemplate;

    public GatewayTemplateImpl(String host, RestTemplate restTemplate, ClientTokenTemplate clientTokenTemplate) {
        this.host = host;
        this.restTemplate = restTemplate;
        this.clientTokenTemplate = clientTokenTemplate;
    }

    /**
     * 获取请求目的地址
     *
     * @param serviceTypeEnum 服务类型
     * @param targetMethod    目标方法
     * @return 返回请求结果
     */
    private String getTargetUrl(IServiceFeature serviceTypeEnum, String targetMethod) {
        return String.format("%s/%s/%s", host, paramHandler(serviceTypeEnum.getName()), paramHandler(targetMethod));
    }

    /**
     * 远程请求
     *
     * @param methodEnum   远程方法
     * @param map          post的数据，当请求为post时传递
     * @param responseType 返回类型
     * @param args         url的路由参数
     * @param <T>
     * @return
     */
    @Override
    public <T> T getResponse(IMethodFeature methodEnum, Object map, Class<T> responseType, Object... args) {
        String targetUrl = getTargetUrl(methodEnum.getService(), methodEnum.getMethod());
        if (methodEnum.getService().isNeedAuth()) {
            return getResponseWithToken(targetUrl, methodEnum.getRequestType(), map
                    , methodEnum.getValid().equals(ValidTypeEnum.CLIENT), 1, responseType, args);
        }
        //post请求处理
        if (methodEnum.getRequestType().equals(HttpMethod.GET)) {
            return restTemplate.getForObject(targetUrl, responseType, args);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        HttpEntity entity;
        if (map == null) {
            entity = new HttpEntity<>(headers);
        } else {
            entity = new HttpEntity<>(JSON.toJSON(map), headers);
        }
        return restTemplate.postForObject(targetUrl, entity, responseType, args);
    }

    /**
     * 访问基础方法
     *
     * @param targetUrl     请求地址
     * @param requestMethod 请求方法
     * @param map           post参数
     * @param clientAuth    客户端授权
     * @param retryTimes    重试次数，客户端授权时使用
     * @param responseType  响应类型
     * @param args          get参数
     * @param <T>
     * @return
     */
    private <T> T getResponseWithToken(String targetUrl, HttpMethod requestMethod, Object map
            , boolean clientAuth, int retryTimes, Class<T> responseType, Object... args) {
        AuthInfo authInfo = getAuthInfo(clientAuth);
        // 组装请求参数
        if (!targetUrl.startsWith("http")) {
            targetUrl = String.format("%s/%s", host, targetUrl);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", authInfo.getAccess_token());
        try {
            if (HttpMethod.GET == requestMethod || HttpMethod.DELETE == requestMethod) {
                HttpEntity entity = new HttpEntity<String>(headers);
                if (map instanceof MultiValueMap) {
                    targetUrl = catUrl(targetUrl, (MultiValueMap<String, Object>) map, args);
                    //get请求
                    return restTemplate.exchange(targetUrl, requestMethod, entity, responseType).getBody();
                }
                //delete请求
                return restTemplate.exchange(targetUrl, requestMethod, entity, responseType, args).getBody();
            } else {
                //post请求处理
                headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
                HttpEntity entity;
                if (map == null) {
                    entity = new HttpEntity<>(headers);
                } else {
                    entity = new HttpEntity<>(JSON.toJSON(map), headers);
                }
                return restTemplate.postForEntity(targetUrl, entity, responseType, args).getBody();
            }
        } catch (HttpClientErrorException.MethodNotAllowed e) {
            // 未授权的访问
            e.printStackTrace();
            if (clientAuth && retryTimes > 0) {
                // 如果出现401为授权的情况，说明token过期，需要强行刷新redis
                clientTokenTemplate.refreshToken();
                // 重试方法
                retryTimes--;
                return getResponseWithToken(targetUrl, requestMethod, map, true, retryTimes, responseType, args);
            } else {
                throw e;
            }
        } catch(Exception e){
            e.printStackTrace();
            throw new BizException(e.getMessage(),e);
        }
    }

    /**
     * 拼接get请求的地址
     *
     * @param targetUrl 目标地址
     * @param map query参数
     * @param args url参数
     * @return
     */
    public static String catUrl(String targetUrl, MultiValueMap<String, Object> map,Object... args) {
        if (map == null) {
            return targetUrl;
        }
        //自动拼接后端地址
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(targetUrl);
        map.forEach((k, v) -> {
            if (v != null) {
                v.forEach(o -> {
                    builder.queryParam(k, o);
                });
            }
        });
        return builder.buildAndExpand(args).encode().toUriString();
    }

    private AuthInfo getAuthInfo(boolean clientAuth) {
        // 获取token信息
        AuthInfo authInfo;
        if (clientAuth) {
            authInfo = clientTokenTemplate.getRedisToken();
        } else {
            authInfo = BizContext.getValue(Constants.BizContextKey.AUTH);
        }
        if (authInfo == null || StringUtils.isEmpty(authInfo.getAccess_token())) {
            throw new BizException(CodeEnum.IllegalAccessError);
        }
        return authInfo;
    }

    /**
     * 上传文件
     *
     * @param methodEnum   方法枚举
     * @param formConsumer form表单的消费
     * @param retryTimes   重试次数
     * @param responseType 响应类型
     * @param <T>
     * @return
     */
    @Override
    public <T> T transferFile(IMethodFeature methodEnum, Consumer<MultiValueMap<String, Object>> formConsumer, int retryTimes, Class<T> responseType) {
        String targetUrl = getTargetUrl(methodEnum.getService(), methodEnum.getMethod());
        boolean clientAuth = methodEnum.getValid().equals(ValidTypeEnum.CLIENT);
        // 获取token信息
        AuthInfo authInfo = getAuthInfo(clientAuth);
        // 组装请求参数
        if (!targetUrl.startsWith("http")) {
            targetUrl = String.format("%s/%s", host, targetUrl);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", authInfo.getAccess_token());
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));
        try {
            MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
            if (formConsumer != null) {
                formConsumer.accept(form);
            }
            HttpEntity entity = new HttpEntity<>(form, headers);
            return restTemplate.postForEntity(targetUrl, entity, responseType).getBody();
        } catch (HttpClientErrorException.MethodNotAllowed e) {
            // 未授权的访问
            e.printStackTrace();
            if (clientAuth && retryTimes > 0) {
                // 如果出现401为授权的情况，说明token过期，需要强行刷新redis
                clientTokenTemplate.refreshToken();
                // 重试方法
                retryTimes--;
                return transferFile(methodEnum, formConsumer, retryTimes, responseType);
            } else {
                throw e;
            }
        }
    }

    /**
     * 参数处理
     *
     * @param url
     * @return
     */
    private String paramHandler(String url) {
        if (url.startsWith("/")) {
            url = url.substring(1);
        }
        return url;
    }

    /**
     * 反序列化，解决rdc日期精度到微秒的问题
     *
     * @param json
     * @param clazz
     * @param <T>
     * @return
     */
    @Override
    public <T> T parseWithRdcDateAndResultWrapper(String json, Class<T> clazz) {
        ParserConfig parserConfig = new ParserConfig();
        parserConfig.putDeserializer(Date.class, RdcDateDeserializer.instance);
        StringWrapper wrapper = JSON.parseObject(json, StringWrapper.class);
        return JSON.parseObject(wrapper.getResult(), clazz, parserConfig, JSON.DEFAULT_PARSER_FEATURE);
    }

    /**
     * 反序列化，解决rdc日期精度到微秒的问题
     *
     * @param json
     * @param clazz
     * @param <T>
     * @return
     */
    @Override
    public <T> T parseWithRdcDate(String json, Class<T> clazz) {
        ParserConfig parserConfig = new ParserConfig();
        parserConfig.putDeserializer(Date.class, RdcDateDeserializer.instance);
        return JSON.parseObject(json, clazz, parserConfig, JSON.DEFAULT_PARSER_FEATURE);
    }

    /**
     * 尝试执行(自动捕获异常，不影响主流程运行)
     *
     * @param func
     * @param message
     * @param defaultVal
     * @param <T>
     * @return
     */
    @Override
    public <T> T tryDispatch(Func0<T> func, String message, T defaultVal) {
        try {
            return func.call();
        } catch (Exception e) {
            e.printStackTrace();
            log.error(message);
        }
        return defaultVal;
    }
}
