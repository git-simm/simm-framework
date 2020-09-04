package test.framework.simm.service;

/**
 * opencv服务
 * @author simm
 */
public interface OpenCVService {
    /**
     * 图片扶正
     * @param base64
     * @return
     */
    String correct(String base64,String correctPath);
    String getTmpPath();
    Boolean getSaveTmpImg();
}
