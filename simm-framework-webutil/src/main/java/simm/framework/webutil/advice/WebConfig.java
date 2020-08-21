package simm.framework.webutil.advice;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import simm.framework.webutil.common.CORSInterceptor;

import javax.annotation.Resource;

/**
 * mvc配置
 *
 * @author simm
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Resource
    private CORSInterceptor corsInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(corsInterceptor);
//        registry.addMapping("/**").allowedOrigins("http://localhost"+":9528")
//                .allowCredentials(true);
//        InterceptorRegistration interceptorRegistration;
//        String[] excludePathPatterns = new String[]{"/adminUser/login.json"
//                , "/adminUser/checkTime.json"
//                , "/checkcode.json"
//                , "/adminUser/changePassword.json"
//                , "/file/downloadTemp.json"};
//        if(propConfig.isEnabledPortal()){
//            interceptorRegistration = registry.addInterceptor(corsInterceptor);
//        }else{
//            interceptorRegistration = registry.addInterceptor(loginInterceptor);
//        }
//        interceptorRegistration.addPathPatterns("/**/*.json")
//                .excludePathPatterns(excludePathPatterns)
//                .excludePathPatterns("/doc.html");
    }
    /**
     * -设置url后缀模式匹配规则
     * -该设置匹配所有的后缀，使用.do或.action都可以
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseSuffixPatternMatch(true).setUseTrailingSlashMatch(true);
    }
}
