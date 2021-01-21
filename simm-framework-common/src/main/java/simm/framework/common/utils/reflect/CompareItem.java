package simm.framework.common.utils.reflect;

import lombok.Data;

/**
 * 比较的单项
 * @author simm
 */
@Data
public class CompareItem {
    /**
     * 字段名
     */
    private String field;
    /**
     * 字段中文名
     */
    private String fieldName;
    /**
     * 旧值
     */
    private Object oldVal;
    /**
     * 新值
     */
    private Object newVal;
}
