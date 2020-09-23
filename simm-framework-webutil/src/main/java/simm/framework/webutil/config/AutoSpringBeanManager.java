package simm.framework.webutil.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import simm.framework.webutil.cors.SXHCorsProcessor;

import java.util.ArrayList;
import java.util.List;

/**
 * @author simm
 */
//@Configuration
public class AutoSpringBeanManager {

    @Bean
    @ConditionalOnProperty(name="spring.web.corsForLocalDebug")
    public SXHCorsProcessor sXHCorsProcessor() {
        return new SXHCorsProcessor();
    }

    @Bean
    @ConditionalOnProperty(name="spring.web.corsForLocalDebug")
    public CorsFilter corsFilter(SXHCorsProcessor sXHCorsProcessor) {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfig = new CorsConfiguration();
        // 跨域允许带Cookie
        corsConfig.setAllowCredentials(true);
        // 跨域允许访问的方法
        List<String> methodList = new ArrayList();
        methodList.add(HttpMethod.POST.name());
        methodList.add(HttpMethod.GET.name());
        methodList.add(HttpMethod.OPTIONS.name());
        corsConfig.setAllowedMethods(methodList);
        // 跨域允许携带的Headers
        List<String> headerList = new ArrayList();
        headerList.add(HttpHeaders.ACCEPT);
        headerList.add(HttpHeaders.COOKIE);
        headerList.add(HttpHeaders.AUTHORIZATION);
        headerList.add(HttpHeaders.USER_AGENT);
        headerList.add(HttpHeaders.CONNECTION);
        headerList.add(HttpHeaders.REFERER);
        headerList.add(HttpHeaders.HOST);
        headerList.add(HttpHeaders.ACCEPT_LANGUAGE);
        headerList.add(HttpHeaders.ACCEPT_ENCODING);
        headerList.add(HttpHeaders.CACHE_CONTROL);
        headerList.add(HttpHeaders.PRAGMA);
        headerList.add(HttpHeaders.CONTENT_TYPE);
        corsConfig.setAllowedHeaders(headerList);
        // 需要跨域的地址
        source.registerCorsConfiguration("/**", corsConfig);
        CorsFilter filter = new CorsFilter(source);
        filter.setCorsProcessor(sXHCorsProcessor);
        return filter;
    }
}
