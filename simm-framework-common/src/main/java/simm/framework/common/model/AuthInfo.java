package simm.framework.common.model;

import lombok.Data;

import java.util.List;

/**
 * 权限信息
 * @author simm
 */
@Data
public class AuthInfo{
    /**
     * 授权token
     */
    private String access_token;
    /**
     * token类型
     */
    private String token_type;
    /**
     * 过期时间
     */
    private String expires_in;
    /**
     * 用户主键
     */
    private String sub;
    private String iss;
    /**
     * 授权
     */
    private List<String> aud;
    /**
     * 域信息
     */
    private List<String> scope;
    private String client_id;
    private User user;

    public AuthInfo(){
        this(null);
    }
    public AuthInfo(String token){
        this.access_token = token;
    }

    /**
     * 用户信息
     */
    @Data
    public static class User{
        private String name;
        private String userName;
        private String email;
        private String phone;
        private String avatarFileName;
        private String dn;
        private Boolean isOuter;
    }
}