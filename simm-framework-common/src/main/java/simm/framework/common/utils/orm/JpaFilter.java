package simm.framework.common.utils.orm;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;

/**
 * jpa过滤消费接口
 *
 * @author simm
 */
@FunctionalInterface
public interface JpaFilter<T> {
    /**
     * 追加过滤条件
     * @param predicates 条件集合
     * @param root 根
     * @param query 查询
     * @param criteriaBuilder 组装
     */
    void accept(List<Predicate> predicates, Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder);
}
