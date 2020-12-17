package simm.framework.common.utils.oauth2.model;

/**
 * 验证类型枚举
 * @author simm
 */
public enum ValidTypeEnum {
    /**
     * 无验证
     */
    NONE,
    /**
     * Code验证
     */
    USER,
    /**
     * 客户端验证
     */
    CLIENT;
    ValidTypeEnum() {
    }
}
