package simm.framework.webutil.limit;

/**
 * 限流类型
 * @author simm
 */
public enum LimitType {
    /**
     * 自定义key
     */
    CUSTOMER,
    /**
     * 根据请求者IP
     */
    IP
}
