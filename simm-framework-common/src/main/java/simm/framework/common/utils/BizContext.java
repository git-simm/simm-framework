package simm.framework.common.utils;


import java.util.HashMap;
import java.util.Map;

/**
 * 业务上下文,存储业务信息
 */
public class BizContext {

    private static ThreadLocal<Map<String, Object>> local = new ThreadLocal<>();

    /**
     * 设置值
     * @param key
     * @param value
     * @param <V>
     */
    public static <V> void putValue(String key, V value) {
        if (null == local.get()) {
            local.set(new HashMap<>());
        }
        Map<String, Object> context = local.get();
        context.put(key, value);
    }

//    public static void putUser(AdminUser user) {
//        putValue("user",user);
//        putValue("userId",user.getId());
//        putValue("userName",user.getAdmin_user_name());
//    }
//
//    /**
//     * 用户
//     * @return
//     */
//    public static AdminUser getUser() {
//        return getValue("user");
//    }
//

    /**
     * 获取值
     * @param key
     * @param <T>
     * @return
     */
    public static <T> T getValue(String key) {
        if (null == local.get()) {
            return null;
        }
        Map<String, Object> context = local.get();
        if(!context.containsKey(key)){
        	return null;
        }
        return (T) context.get(key);
    }

    /**
     * 清空
     */
    public static void clear() {
        if (null != local.get()) {
            local.set(null);
        }
    }
}
