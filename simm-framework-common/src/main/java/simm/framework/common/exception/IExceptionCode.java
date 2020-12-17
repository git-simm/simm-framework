package simm.framework.common.exception;

/**
 * 服务特征说明
 * @author miscr
 */
public interface IExceptionCode {
    /**
     * 异常编码
     * @return
     */
    int getKey() ;

    /**
     * 异常值
     * @return
     */
    String getValue();
}
