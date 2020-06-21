package test.framework.simm.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.async.DeferredResult;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * 启动时就要加载
 * @author simm
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    private String version;

    @Bean
    public Docket createRestApi() {
        //.globalOperationParameters(pars);
        return new Docket(DocumentationType.SWAGGER_2)
                .genericModelSubstitutes(DeferredResult.class)
                .select()
                .paths(PathSelectors.any())
                .build().apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("道可道的测试服务")
                .description("****")
//                .termsOfServiceUrl("http://www.siman.com")
                .version("1.0").build();
    }
}