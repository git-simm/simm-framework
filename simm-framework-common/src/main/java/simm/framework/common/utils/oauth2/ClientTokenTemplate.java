package simm.framework.common.utils.oauth2;

import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.http.HttpHeaders;
import simm.framework.common.model.AuthInfo;

import java.text.ParseException;
import java.util.function.Consumer;

/**
 * 客户端token操作模板
 */
public interface ClientTokenTemplate {
    ClientTokenTemplate setAuthorityUrl(String authorityUrl);
    ClientTokenTemplate setAppKey(String appKey);
    ClientTokenTemplate setAppSecret(String appSecret);
    ClientTokenTemplate setScope(String scope);
    AuthInfo getRedisToken();
    AuthInfo refreshToken();
    String getResponse(String method,Object map, Consumer<HttpHeaders> headersConsumer);
    boolean isAuthPass(String token);
    boolean validAndStoreUserInfo(String token);
    boolean validAndStoreUserInfo(String token,String keys);
    AuthInfo parseAndStoreUserInfo(JWTClaimsSet claimsSet) throws ParseException;
    JWTClaimsSet getClaimsSet(String token) throws Exception;
}
