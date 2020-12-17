package simm.framework.common.utils.oauth2;

import org.springframework.util.StringUtils;
import simm.framework.common.model.AuthInfo;
import simm.framework.common.model.Constants;

import java.util.HashMap;
import java.util.Map;

/**
 * 业务上下文,存储业务信息
 * @author simm
 */
public class BizContext {

    private static ThreadLocal<Map<String, Object>> local = new ThreadLocal<>();
    /**
     * 授权锁
     */
    private static Object AUTH_INFO_LOCK = new Object();
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
     * 获取授权信息
     * @return
     */
    public static AuthInfo getAuthInfo(){
        AuthInfo authInfo = getValue(Constants.BizContextKey.AUTH);
        if(authInfo!=null){
            return authInfo;
        }
        synchronized (AUTH_INFO_LOCK){
            AuthInfo authInfo2 = getValue(Constants.BizContextKey.AUTH);
            if(authInfo2!=null){
                return authInfo2;
            }
            AuthInfo auth = new AuthInfo();
            putValue(Constants.BizContextKey.AUTH,auth);
            return auth;
        }
    }
    /**
     * OAUTH2权限验证
     * @return
     */
    public static boolean isOAuthLogin(){
        AuthInfo authInfo = getValue(Constants.BizContextKey.AUTH);
        if(authInfo == null){
            return false;
        }
        return !StringUtils.isEmpty(authInfo.getAccess_token());
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
