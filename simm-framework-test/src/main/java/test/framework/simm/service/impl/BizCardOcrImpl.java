package test.framework.simm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import simm.framework.common.model.BizException;
import test.framework.simm.model.BizLicenseInfo;
import test.framework.simm.service.BizCardOcr;
import test.framework.simm.service.impl.BizCardOcr.IBizCardOcr;

/**
 * 营业执照信息识别
 *
 * @author simm
 */
@Service
public class BizCardOcrImpl implements BizCardOcr {
    /**
     * 横屏解析
     */
    @Autowired
    @Qualifier("horizontal")
    private IBizCardOcr horizontalCardOcr;
    /**
     * 竖屏解析
     */
    @Autowired
    @Qualifier("vertical")
    private IBizCardOcr verticalCardOcr;
    /**
     * 解析身份证信息
     *
     * @param base64Img
     * @return
     * @throws BizException
     */
    @Override
    public BizLicenseInfo getInfoByType(String base64Img, Integer type) throws BizException {
        if (type.equals(1)) {
            // 横屏解析
            return horizontalCardOcr.getInfo(base64Img);
        } else if (type.equals(2)) {
            // 竖屏解析
            return verticalCardOcr.getInfo(base64Img);
        } else {
            return new BizLicenseInfo();
        }
    }

    /**
     * 解析身份证信息
     *
     * @param base64Img
     * @return
     * @throws BizException
     */
    @Override
    public BizLicenseInfo getInfo(String base64Img) throws BizException {
        return horizontalCardOcr.getInfo(base64Img);
    }
}
