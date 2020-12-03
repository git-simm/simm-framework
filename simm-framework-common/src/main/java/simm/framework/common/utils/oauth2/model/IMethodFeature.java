package simm.framework.common.utils.oauth2.model;

import org.springframework.http.HttpMethod;

/**
 * rpc方法特性
 * @author simm
 */
public interface IMethodFeature {
    String getMethod();

    void setMethod(String method);

    IServiceFeature getService();

    void setService(IServiceFeature service);

    HttpMethod getRequestType();

    void setRequestType(HttpMethod requestType);

    ValidTypeEnum getValid();

    void setValid(ValidTypeEnum valid);
}
