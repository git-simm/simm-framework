package test.framework.simm.service;

import simm.framework.common.model.BizException;
import test.framework.simm.model.IDCardInfo;

import java.io.IOException;

/**
 * 身份证识别
 * @author simm
 */
public interface IDCardOcr {
    /**
     * 获取身份证信息
     * @param base64
     * @return
     * @throws BizException
     * @throws IOException
     */
    IDCardInfo getInfo(String base64) throws BizException, IOException;
}
