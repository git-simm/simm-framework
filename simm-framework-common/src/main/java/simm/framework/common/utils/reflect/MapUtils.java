package simm.framework.common.utils.reflect;

import org.springframework.cglib.beans.BeanMap;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * map处理工具类
 * @author simm
 */
public class MapUtils {
    /**
     * 实体转换成MultiValueMap
     * @param req 请求实体
     * @return map
     */
    public static MultiValueMap<String, Object> getMultiValueMap(Object req){
        MultiValueMap<String, Object> reqMap = new LinkedMultiValueMap<>();
        BeanMap beanMap = BeanMap.create(req);
        beanMap.keySet().stream().filter(y -> beanMap.get(y) != null)
                .forEach(key -> reqMap.add(key.toString(), beanMap.get(key) instanceof String ?
                                ((String) beanMap.get(key)).trim() : beanMap.get(key)));
        return reqMap;
    }
}
