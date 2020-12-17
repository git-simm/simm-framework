package simm.framework.webutil.config;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.Node;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.Objects;

/**
 * Es配置
 * @author arthur_wang
 * @date 20200701
 */
//@Configuration
@Slf4j
public class ElasticsearchConfig {
    @Value("${es.address}")
    private String[] ipAddress;
    @Value("${es.timeout}")
    private Integer connectionRequestTimeout;
    @Value("${es.timeout}")
    private Integer socketTimeout;
    @Value("${es.timeout}")
    private Integer connectTimeout;
    @Value("${es.username}")
    private String username;
    @Value("${es.password}")
    private String password;

    @Bean
    public RestClientBuilder restClientBuilder() {
        HttpHost[] hosts = Arrays.stream(ipAddress)
                .map(this::makeHttpHost)
                .filter(Objects::nonNull)
                .toArray(HttpHost[]::new);
        RestClientBuilder restClientBuilder = RestClient.builder(hosts);
        // 有用户名 与 密码
        if(StringUtils.isNotEmpty(username) && StringUtils.isNotEmpty(password)){
            CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            //es使用账户密码登录
            credentialsProvider.setCredentials(AuthScope.ANY,
                    new UsernamePasswordCredentials(username, password));
            restClientBuilder.setHttpClientConfigCallback(httpClientBuilder -> {
                httpClientBuilder.disableAuthCaching();
                return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
            });
        }
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
        if (address != null && address.length > 0) {
            String ip = address[0];
            int port = Integer.parseInt(address[1]);
            return new HttpHost(ip, port);
        } else {
            return null;
        }
    }
}
