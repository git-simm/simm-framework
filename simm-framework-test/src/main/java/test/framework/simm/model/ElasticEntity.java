package test.framework.simm.model;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * ElasticEntity
 * @author simm
 */
@Data
public class ElasticEntity implements Serializable {
    private String id;
    private String name;
    private Integer age;
    private BigDecimal money;
    private String address;
    private String birthday;
}
