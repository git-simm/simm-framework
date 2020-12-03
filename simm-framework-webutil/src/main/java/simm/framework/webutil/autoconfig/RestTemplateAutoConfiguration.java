package simm.framework.webutil.autoconfig;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * @author simm
 */
@Configuration
@ConditionalOnMissingBean(RestTemplate.class)
@Order(1)
public class RestTemplateAutoConfiguration {
    /**
     * 返回RestTemplate-bean
     * @return
     */
    @Bean
    public RestTemplate restTemplate(){
        SimpleClientHttpRequestFactory clientHttpRequestFactory = new SimpleClientHttpRequestFactory();
        clientHttpRequestFactory.setConnectTimeout(20 * 1000);
        // 50秒超时
        clientHttpRequestFactory.setReadTimeout(50 * 1000);
        return new RestTemplate(clientHttpRequestFactory);
    }
}
