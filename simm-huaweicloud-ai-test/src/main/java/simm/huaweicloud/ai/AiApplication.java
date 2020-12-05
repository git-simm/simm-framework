package simm.huaweicloud.ai;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.util.unit.DataSize;
import org.springframework.util.unit.DataUnit;

import javax.servlet.MultipartConfigElement;

/**
 * @author simm
 */
@SpringBootApplication(scanBasePackages = {"simm.huaweicloud.ai","simm.framework.webutil"})
@EnableAsync
@EnableAspectJAutoProxy(exposeProxy = true)
public class AiApplication {
    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(AiApplication.class).web(WebApplicationType.SERVLET).run(args);
    }

    /**
     * 配置上传文件大小的配置
     *
     * @return
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        // 单个数据大小(插件版本允许2G,因此这里配成2G)
        factory.setMaxFileSize(DataSize.of(2, DataUnit.GIGABYTES));
        //总上传数据大小
        factory.setMaxRequestSize(DataSize.of(2,DataUnit.GIGABYTES));
        return factory.createMultipartConfig();
    }
}
