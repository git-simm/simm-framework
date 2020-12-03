package simm.framework.common.utils.orm;

import com.alibaba.druid.util.StringUtils;
import org.springframework.data.domain.Sort;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * jpa查询用工具类
 * @author simm
 */
public class JpaQueryUtil {
    /**
     * 排序字符串转成JPA的排序类
     * @param sortStr 默认格式 “id desc,name asc”,前端url传递格式“id+desc,name+asc”
     * @return
     */
    public static Sort getSort(String sortStr){
        if(StringUtils.isEmpty(sortStr)){
            return Sort.unsorted();
        }
        List<Sort.Order> orders = new ArrayList<>();
        //字符串处理
        sortStr = sortStr.replace("+"," ");
        String[] seqs = sortStr.split(",");
        Arrays.stream(seqs).forEach(s->{
            String[] arr = s.split("\\s+");
            orders.add(new Sort.Order(Sort.Direction.fromString(arr[1].trim()),arr[0].trim()));
        });
        return Sort.by(orders);
    }

    /**
     * 获取like过滤字符串，处理 _ %
     * @param cb
     * @param root
     * @param colmun
     * @param key
     * @return
     */
    public static Predicate like(CriteriaBuilder cb, Root<?> root, String colmun, String key) {
        key = key.trim();
        try {
            if(key.contains("_") || key.contains("%")){
                //注："\"被作为转义字符时必须也被转义
                key = key.replace("\\","\\\\").replace("_","\\_").replace("%","\\%");
                return cb.like(root.get(colmun), "%" + key + "%",'\\');
            }else{
                return cb.like(root.get(colmun), "%" + key + "%");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return cb.like(root.get(colmun), "%" + key + "%");
        }
    }
}
