package simm.framework.common.model;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * @author zhuCan
 * @description token相关常量
 * @since 2020-12-03 11:22
 **/
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TokenConstant {

    public static final String AUTH_TYPE = "authorizationType";

    public static final String CLIENT_AUTH = "client";

    public static final String NONE_AUTH = "none";

    public static final String GATEWAY_AUTH_HEADER = AUTH_TYPE + "=" + CLIENT_AUTH;
}
