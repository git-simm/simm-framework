package simm.test.nacos.consumer.sevices;

/**
 * 配置服务测试
 * @author simm
 */
public interface IConfigService {
    /**
     * 获取所有的属性信息
     * @return
     */
    String getUser();

    String getDb();

    String getRefreshVal();
}
