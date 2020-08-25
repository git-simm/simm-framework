package test.framework.simm.service;

import test.framework.simm.model.BizLicenseInfo;

import java.io.InputStream;

/**
 * 营业执照号识别
 * @author simm
 */
public interface BizCardOcr {
    BizLicenseInfo getInfo(InputStream inputStream) throws Exception;
}
