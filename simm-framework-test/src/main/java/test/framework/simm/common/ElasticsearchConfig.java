package test.framework.simm.common;

import org.apache.http.HttpHost;
import org.apache.http.client.config.RequestConfig;
import org.elasticsearch.client.Node;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Objects;

/**
 * @author
 * @date 2020-01-06 11:48
 * @description
 */
@Configuration
public class ElasticsearchConfig {

    private static final int ADDRESS_LENGTH = 2;
//    @Value("#{'${spring.data.elasticsearch.scheme:http}'.split(',')}")
//    private String test;
    @Value("${spring.data.elasticsearch.scheme:http}")
    private String scheme;
    @Value("${spring.data.elasticsearch.cluster-nodes:192.168.0.1:9200}")
    private String[] ipAddress;
    @Value("${spring.data.elasticsearch.connection-request-timeout}")
    private Integer connectionRequestTimeout;
    @Value("${spring.data.elasticsearch.socket-timeout}")
    private Integer socketTimeout;
    @Value("${spring.data.elasticsearch.connect-timeout}")
    private Integer connectTimeout;

    @Bean
    public RestClientBuilder restClientBuilder() {
        HttpHost[] hosts = Arrays.stream(ipAddress)
                .map(this::makeHttpHost)
                .filter(Objects::nonNull)
                .toArray(HttpHost[]::new);
        RestClientBuilder restClientBuilder = RestClient.builder(hosts);
        // 设置一个监听器，每次节点出现故障时都会收到通知，以防需要采取措施，
        // 当启用故障嗅探时在内部使用。
        restClientBuilder.setFailureListener(new RestClient.FailureListener() {
            @Override
            public void onFailure(Node node) {

            }
        });
        // 设置允许修改默认请求配置的回调
        //（例如请求超时，身份验证或org.apache.http.client.config.RequestConfig.Builder允许设置的任何内容）。
        restClientBuilder.setRequestConfigCallback(new RestClientBuilder.RequestConfigCallback() {
            @Override
            public RequestConfig.Builder customizeRequestConfig(RequestConfig.Builder requestConfigBuilder) {
                return requestConfigBuilder
                        .setConnectionRequestTimeout(connectionRequestTimeout)
                        .setSocketTimeout(socketTimeout)
                        .setConnectTimeout(connectTimeout);
            }
        });
        return restClientBuilder;
    }

    @Bean(name = "highLevelClient")
    public RestHighLevelClient highLevelClient(@Autowired RestClientBuilder restClientBuilder) {
        // TODO 此处可以进行其它操作
        return new RestHighLevelClient(restClientBuilder);
    }

    /**
     * 根据配置创建HttpHost
     * @param s
     * @return
     */
    private HttpHost makeHttpHost(String s) {
        String[] address = s.split(":");
        if (address.length == ADDRESS_LENGTH) {
            String ip = address[0];
            int port = Integer.parseInt(address[1]);
            return new HttpHost(ip, port, scheme);
        } else {
            return null;
        }
    }
}
