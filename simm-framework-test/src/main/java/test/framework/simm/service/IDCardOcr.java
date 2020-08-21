package test.framework.simm.service;

import com.alibaba.fastjson.JSONObject;

import java.io.InputStream;

/**
 * 身份证识别
 */
public interface IDCardOcr {
    JSONObject getInfo(InputStream inputStream) throws Exception;
}
