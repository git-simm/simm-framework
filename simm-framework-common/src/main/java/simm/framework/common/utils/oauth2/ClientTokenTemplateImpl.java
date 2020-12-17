package simm.framework.common.utils.oauth2;

import com.alibaba.fastjson.JSON;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.DefaultJWKSetCache;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.Base64Utils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import simm.framework.common.exception.BizException;
import simm.framework.common.exception.CodeEnum;
import simm.framework.common.lock.redis.RedisDistributedLockTemplate;
import simm.framework.common.model.AuthInfo;
import simm.framework.common.utils.redis.RedisUtil;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Collections;
import java.util.function.Consumer;

/**
 * 客户端token管理
 *
 * @author simm
 */
public class ClientTokenTemplateImpl implements ClientTokenTemplate {
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(ClientTokenTemplateImpl.class);
    /**
     * token分布式锁的 key定义
     */
    private String app_exchange_lock_key;
    private String app_exchange_token_key;
    /**
     * 授权地址
     */
    private String authorityUrl;
    private String appKey;
    private String appSecret;
    private String scope;
    /**
     * token获取
     */
    private final static String CONNECT_TOKEN = "/connect/token";
    /**
     * 自省端点
     */
    public final static String CONNECT_INTROSPECT = "/connect/introspect";
    /**
     * 授权密钥
     */
    public final static String OAUTH_JWKS = "/.well-known/openid-configuration/jwks";
    /**
     * 全局共享
     */
    private ConfigurableJWTProcessor jwtProcessor = null;
    private Object processorLock = new Object();

    @Override
    public ClientTokenTemplate setAuthorityUrl(String authorityUrl) {
        this.authorityUrl = authorityUrl;
        return this;
    }

    @Override
    public ClientTokenTemplate setAppKey(String appKey) {
        this.appKey = appKey;
        this.app_exchange_lock_key = appKey + "@client_token_lock";
        this.app_exchange_token_key = appKey + "@client_token";
        return this;
    }

    @Override
    public ClientTokenTemplate setAppSecret(String appSecret) {
        this.appSecret = appSecret;
        return this;
    }

    @Override
    public ClientTokenTemplate setScope(String scope) {
        this.scope = scope;
        return this;
    }

    /**
     * 请求模板
     */
    private final RestTemplate restTemplate;
    private final RedisDistributedLockTemplate redisDistributedLockTemplate;
    private final RedisUtil redisUtil;

    /**
     * 构造器
     *
     * @param restTemplate
     * @param redisDistributedLockTemplate
     * @param redisUtil
     */
    public ClientTokenTemplateImpl(RestTemplate restTemplate, RedisDistributedLockTemplate redisDistributedLockTemplate, RedisUtil redisUtil) {
        this.restTemplate = restTemplate;
        this.redisDistributedLockTemplate = redisDistributedLockTemplate;
        this.redisUtil = redisUtil;
    }

    /**
     * 得到64位编码
     *
     * @param text 内容
     * @return base64编码
     */
    private String getBase64Str(String text) {
        return Base64Utils.encodeToString(text.getBytes());
    }

    /**
     * 获取 redis token
     *
     * @return token信息
     */
    @Override
    public AuthInfo getRedisToken() {
        Object token = redisUtil.get(app_exchange_token_key);
        if (token != null) {
            return new AuthInfo(token.toString());
        }
        // 分布式锁 占用1s,锁定1s,每50毫秒重试一次
        return (AuthInfo) redisDistributedLockTemplate.execute(app_exchange_lock_key,
                1000, 1000, 50, success -> {
                    Object tempToken = redisUtil.get(app_exchange_token_key);
                    if (tempToken != null) {
                        return new AuthInfo(tempToken.toString());
                    }
                    if (success) {
                        return refreshToken();
                    }
                    return null;
                });
    }

    /**
     * 刷新token
     */
    @Override
    public AuthInfo refreshToken() {
        AuthInfo clientToken = getClientToken();
        long expired = Long.parseLong(clientToken.getExpires_in());
        // token 缓存至redis,比验证服务器提前5分钟过期
        clientToken.setAccess_token(clientToken.getToken_type() + " " + clientToken.getAccess_token());
        redisUtil.set(app_exchange_token_key, clientToken.getAccess_token(), expired - 5 * 60);
        return clientToken;
    }

    /**
     * 获取客户端token
     *
     * @return 客户端token
     */
    private AuthInfo getClientToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Basic " + getBase64Str(appKey + ":" + appSecret));
        //定义请求参数类型
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        //定义返回类型
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        //RestTemplate带参传的时候要用HttpEntity<?>对象传递
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");
        map.add("scope", scope);
        HttpEntity<?> entity = new HttpEntity<>(map, headers);
        String tokenRtn = restTemplate.postForObject(this.authorityUrl + CONNECT_TOKEN, entity, String.class);
        return JSON.parseObject(tokenRtn, AuthInfo.class);
    }

    /**
     * 自由请求
     *
     * @param method          方法
     * @param map             参数
     * @param headersConsumer header头部
     * @return
     */
    @Override
    public String getResponse(String method, Object map, Consumer<HttpHeaders> headersConsumer) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Basic " + getBase64Str(appKey + ":" + appSecret));
        headersConsumer.accept(headers);
        HttpEntity<?> entity;
        if (map != null) {
            entity = new HttpEntity<>(map, headers);
        } else {
            entity = new HttpEntity<>(headers);
        }
        return restTemplate.postForObject(this.authorityUrl + method, entity, String.class);
    }

    /**
     * 从token中获取到了用户信息
     *
     * @param token
     * @return
     */
    @Override
    public boolean isAuthPass(String token) {
        JWTClaimsSet claimsSet = null;
        try {
            claimsSet = getClaimsSet(token);
            return claimsSet != null;
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            return false;
        }
    }

    /**
     * 从token中获取到了用户信息
     *
     * @param token
     * @return
     */
    @Override
    public boolean validAndStoreUserInfo(String token) {
        return validAndStoreUserInfo(token, appKey);
    }

    /**
     * app授权的key
     *
     * @param token
     * @return
     */
    @Override
    public boolean validAndStoreUserInfo(String token, String keys) {
        JWTClaimsSet claimsSet;
        try {
            claimsSet = getClaimsSet(token);
            if (claimsSet != null) {
                //解析用户信息
                AuthInfo authInfo = parseAndStoreUserInfo(claimsSet);
                String[] keyArr = keys.replace("\\s+", ",").split(",");
                // 判断当前token是否对本应用授过权
                if (authInfo.getAud().stream().noneMatch(a -> Arrays.asList(keyArr).contains(a))) {
                    throw new BizException(CodeEnum.IllegalAccessError);
                }
                return true;
            } else {
                throw new BizException(CodeEnum.IllegalAccessError);
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            throw new BizException(CodeEnum.IllegalAccessError);
        }
    }

    /**
     * 解析并存储用户信息
     *
     * @param claimsSet 权限信息
     * @return
     */
    @Override
    public AuthInfo parseAndStoreUserInfo(JWTClaimsSet claimsSet) throws ParseException {
        AuthInfo authInfo = BizContext.getAuthInfo();
        authInfo.setSub(claimsSet.getStringClaim("sub"));
        authInfo.setIss(claimsSet.getStringClaim("iss"));
        authInfo.setClient_id(claimsSet.getStringClaim("client_id"));
        authInfo.setAud(claimsSet.getAudience());
        authInfo.setScope(claimsSet.getStringListClaim("scope"));
        String user = claimsSet.getStringClaim("user");
        authInfo.setUser(JSON.parseObject(user, AuthInfo.User.class));
        return authInfo;
    }

    /**
     * 获取用户信息
     *
     * @param token 校验的token
     * @return
     * @throws MalformedURLException
     */
    @Override
    public JWTClaimsSet getClaimsSet(String token) throws Exception {
        // 完成jwt的处理器初始化
        if (jwtProcessor == null) {
            synchronized (processorLock) {
                if (jwtProcessor == null) {
                    String jwkEndpoint = this.authorityUrl + OAUTH_JWKS;
                    //建立解析处理对象
                    jwtProcessor = new DefaultJWTProcessor();
                    //提供公钥地址来获取(默认缓存15分钟)
                    JWKSource keySource = new RemoteJWKSet(new URL(jwkEndpoint), null, new DefaultJWKSetCache());
                    //提供解析算法，算法类型要写对，服务器用的是什么就是什么，目前是RSA256算法
                    //填写 RSA 公钥来源从提供公钥地址获取那边得到
                    JWSKeySelector keySelector = new JWSVerificationKeySelector(JWSAlgorithm.RS256, keySource);
                    //设置第一步建立的解析处理对象
                    jwtProcessor.setJWSKeySelector(keySelector);
                }
            }
        }
        //处理收到的token（令牌),错误则返回对象
        SecurityContext ctx = null;
        JWTClaimsSet claimsSet = null;
        try {
            claimsSet = jwtProcessor.process(token.replaceFirst("Bearer", "").trim(), ctx);
        } catch (ParseException | JOSEException | BadJOSEException e) {
            e.printStackTrace();
            throw e;
        }
        return claimsSet;
    }
}
