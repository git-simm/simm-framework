package test.framework.simm.service;

import simm.framework.common.model.BizException;
import test.framework.simm.model.BizLicenseInfo;

/**
 * 营业执照号识别
 * @author simm
 */
public interface BizCardOcr {
    /**
     * 获取营业执照信息
     * @param base64
     * @return
     * @throws BizException
     */
    BizLicenseInfo getInfo(String base64) throws BizException;
}
