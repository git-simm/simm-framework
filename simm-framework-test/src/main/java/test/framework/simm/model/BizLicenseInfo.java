package test.framework.simm.model;

import lombok.Data;

import java.io.Serializable;

/**
 * 营业执照号信息
 * @author simm
 */
@Data
public class BizLicenseInfo implements Serializable {
    /**
     * 名称
     */
    private String name;
    /**
     * 注册资本
     */
    private String capital;
    /**
     * 类型
     */
    private String bizType;
    /**
     * 成立日期
     */
    private String buildOn;
    /**
     * 法人
     */
    private String juridical;
    /**
     * 营业期限
     */
    private String bizLimit;
    /**
     * 经营范围
     */
    private String bizScope;
    /**
     * 住所
     */
    private String address;
    /**
     * 统一社会信用代码
     */
    private String creditCode;
}
