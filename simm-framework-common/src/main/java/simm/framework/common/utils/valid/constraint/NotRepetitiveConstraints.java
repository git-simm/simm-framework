package simm.framework.common.utils.valid.constraint;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import simm.framework.common.utils.valid.NotRepetitive;

import javax.annotation.Resource;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;
import java.util.Map;

/**
 * @author zhuCan
 * @description 数据库字段重复存在验证实现
 * @since 2020-11-30 10:05
 **/
public class NotRepetitiveConstraints implements ConstraintValidator<NotRepetitive, String> {

    private String table;
    private String column;

    @Resource
    private JdbcTemplate jdbcTemplate;

    @Override
    public void initialize(NotRepetitive constraintAnnotation) {
        table = constraintAnnotation.table();
        column = constraintAnnotation.column();
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        String sql = "select " + column + " from " + table + " where " + column + " = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, s);
        return CollectionUtils.isEmpty(result);
    }

}
