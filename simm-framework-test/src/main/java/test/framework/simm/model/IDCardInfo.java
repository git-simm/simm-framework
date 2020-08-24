package test.framework.simm.model;

import lombok.Data;

import java.io.Serializable;

/**
 * 身份证信息
 * @author simm
 */
@Data
public class IDCardInfo implements Serializable {
    /**
     * 名称
     */
    private String name;
    /**
     * 性别
     */
    private String sex;
    /**
     * 民族
     */
    private String nation;
    /**
     * 生日
     */
    private String birth;
    /**
     * 地址
     */
    private String address;
    /**
     * 身份证号
     */
    private String idNumber;
}
