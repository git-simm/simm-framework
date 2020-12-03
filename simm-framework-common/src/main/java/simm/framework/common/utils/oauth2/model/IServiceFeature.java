package simm.framework.common.utils.oauth2.model;

/**
 * 服务特征说明
 */
public interface IServiceFeature {
    int getKey();

    void setKey(int key);

    String getDesc();

    void setDesc(String desc);

    boolean isNeedAuth();

    void setNeedAuth(boolean needAuth);

    /**
     * 获取服务名
     */
    String getName();
}
