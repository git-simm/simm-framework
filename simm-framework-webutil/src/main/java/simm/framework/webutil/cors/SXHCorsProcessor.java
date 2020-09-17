package simm.framework.webutil.cors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.DefaultCorsProcessor;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author simm
 */
@Slf4j
public class SXHCorsProcessor extends DefaultCorsProcessor {

    @Override
    protected boolean handleInternal(ServerHttpRequest request, ServerHttpResponse response, CorsConfiguration config, boolean preFlightRequest) throws IOException {
        String requestOrigin = request.getHeaders().getOrigin();
        String allowOrigin = this.checkOrigin(request);
        HttpHeaders responseHeaders = response.getHeaders();
        responseHeaders.addAll("Vary", Arrays.asList("Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        if (allowOrigin == null) {
            log.debug("Reject: '" + requestOrigin + "' origin is not allowed");
            this.rejectRequest(response);
            return false;
        } else {
            HttpMethod requestMethod = this.getMethodToUse(request, preFlightRequest);
            List<HttpMethod> allowMethods = this.checkMethods(config, requestMethod);
            if (allowMethods == null) {
                log.debug("Reject: HTTP '" + requestMethod + "' is not allowed");
                this.rejectRequest(response);
                return false;
            } else {
                List<String> requestHeaders = this.getHeadersToUse(request, preFlightRequest);
                List<String> allowHeaders = this.checkHeaders(config, requestHeaders);
                if (preFlightRequest && allowHeaders == null) {
                    log.debug("Reject: headers '" + requestHeaders + "' are not allowed");
                    this.rejectRequest(response);
                    return false;
                } else {
                    responseHeaders.setAccessControlAllowOrigin(allowOrigin);

                    responseHeaders.setAccessControlAllowMethods(allowMethods);

                    if (!allowHeaders.isEmpty()) {
                        responseHeaders.setAccessControlAllowHeaders(allowHeaders);
                    }

                    if (!CollectionUtils.isEmpty(config.getExposedHeaders())) {
                        responseHeaders.setAccessControlExposeHeaders(config.getExposedHeaders());
                    }

                    if (Boolean.TRUE.equals(config.getAllowCredentials())) {
                        responseHeaders.setAccessControlAllowCredentials(true);
                    }

                    if (config.getMaxAge() != null) {
                        responseHeaders.setAccessControlMaxAge(config.getMaxAge());
                    }

                    response.flush();
                    return true;
                }
            }
        }
    }

    @Nullable
    protected String checkOrigin(ServerHttpRequest request) {
        // 获取Header中的Referer， [Referer中记录跨域的来源页面的URL信息]
        List<String> refererList = request.getHeaders().get(HttpHeaders.REFERER);
        if(CollectionUtils.isEmpty(refererList) || StringUtils.isEmpty(refererList.get(0))) {
            return "";
        }
        String referer = refererList.get(0);
        try {
            URL url = new URL(referer);
            String host = url.getHost();
            int port = url.getPort();
            String origin = "http://" + host + (port != 80 ? ":" + port : "");
            return origin;
        } catch (Exception exp) {
            return request.getHeaders().getOrigin();
        }
    }

    @Nullable
    private HttpMethod getMethodToUse(ServerHttpRequest request, boolean isPreFlight) {
        return isPreFlight ? request.getHeaders().getAccessControlRequestMethod() : request.getMethod();
    }

    private List<String> getHeadersToUse(ServerHttpRequest request, boolean isPreFlight) {
        HttpHeaders headers = request.getHeaders();
        return (List)(isPreFlight ? headers.getAccessControlRequestHeaders() : new ArrayList(headers.keySet()));
    }
}
