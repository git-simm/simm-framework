package simm.framework.webutil.autoconfig.sdks;

import com.mingyuanyun.rdc.framework.sdks.workflow.IFlowCenterClient;
import com.mingyuanyun.rdc.framework.sdks.workflow.impl.FlowCenterClient;
import com.mingyuanyun.rdc.framework.sdks.workflow.module.FlowCenterOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.client.RestTemplate;

/**
 * 工作流自动启动类
 * @author simm
 */
@Configuration
@ConditionalOnProperty(name = "flow-center.enabled")
@ConditionalOnMissingBean(IFlowCenterClient.class)
@Slf4j
@Order(2)
public class WorkflowAutoConfig {
    @Value("${flow-center.base-address}")
    private String baseAddress;
    @Value("${flow-center.org-id:A484D916-9597-46AC-908F-225B7F7DA5E7}")
    private String orgId;
    @Value("${flow-center.app-id}")
    private String appId;
    @Value("${flow-center.jwt-key}")
    private String jwtKey;

    /**
     * 实例化流程客户端
     * @param restTemplate rest模板
     * @return
     */
    @Bean
    public IFlowCenterClient getFlowCenterClient(RestTemplate restTemplate) {
        FlowCenterOptions optionsConfig = new FlowCenterOptions();
        optionsConfig.setBaseAddress(baseAddress);
        optionsConfig.setOrgId(orgId);
        optionsConfig.setAppId(appId);
        optionsConfig.setJwtKey(jwtKey);
        return new FlowCenterClient(restTemplate,optionsConfig);
    }
}