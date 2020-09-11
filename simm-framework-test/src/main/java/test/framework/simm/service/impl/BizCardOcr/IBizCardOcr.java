package test.framework.simm.service.impl.BizCardOcr;

import simm.framework.common.model.BizException;
import test.framework.simm.model.BizLicenseInfo;

public interface IBizCardOcr {
    /**
     * 获取营业执照信息
     * @param base64
     * @return
     * @throws BizException
     */
    BizLicenseInfo getInfo(String base64) throws BizException;
}
