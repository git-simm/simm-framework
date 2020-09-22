package simm.framework.webutil.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import lombok.Data;
import org.apache.ibatis.plugin.Interceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

/**
 * 数据库组件加载
 * @author simm
 */
//@Configuration
//@ConfigurationProperties(prefix = "sxh-product")
//@EnableTransactionManagement
//@MapperScan("com.sxh.purchase.provider.mapper*")
@Data
public class MybatisConfig {
    private String driver;
    private String url;
    private String username;
    private String password;
    private int initialPoolSize;
    private int minPoolSize;
    private int maxPoolSize;
    private long maxWait;
    private long timeBetweenEvictionRunsMillis;
    private long minEvictableIdleTimeMillis;
    private boolean testWhileIdle;
    private boolean testOnBorrow;
    private boolean testOnReturn;
    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driver);
        dataSource.setUrl(url);
        // 用户名
        dataSource.setUsername(username);
        // 密码
        dataSource.setPassword(password);
        dataSource.setInitialSize(initialPoolSize);
        dataSource.setMinIdle(minPoolSize);
        dataSource.setMaxActive(maxPoolSize);
        dataSource.setMaxWait(maxWait);
        dataSource.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis);
        dataSource.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis);
        dataSource.setTestWhileIdle(testWhileIdle);
        dataSource.setTestOnBorrow(testOnBorrow);
        dataSource.setTestOnReturn(testOnReturn);
        return dataSource;
    }

    @Bean
    public PlatformTransactionManager txManager(){
        return new DataSourceTransactionManager(dataSource());
    }

    /**
     * Mybatis-plus 分页插件
     * 单页最大记录数 默认500
     */
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        // 单页最大记录数限制
        paginationInterceptor.setLimit(500L);
        return  paginationInterceptor;
    }

    @Bean
    public MybatisSqlSessionFactoryBean mybatisSqlSessionFactoryBean() throws Exception{
        MybatisSqlSessionFactoryBean mybatisSqlSessionFactoryBean = new MybatisSqlSessionFactoryBean();
        mybatisSqlSessionFactoryBean.setDataSource(dataSource());
        mybatisSqlSessionFactoryBean.setMapperLocations( new PathMatchingResourcePatternResolver()
                .getResources("classpath:mappers/*.xml"));
        mybatisSqlSessionFactoryBean.setPlugins(new Interceptor[]{paginationInterceptor()});
        return mybatisSqlSessionFactoryBean;
    }

}
