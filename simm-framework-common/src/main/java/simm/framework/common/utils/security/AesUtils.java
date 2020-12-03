package simm.framework.common.utils.security;

import org.springframework.util.Base64Utils;

import javax.crypto.Cipher;
import java.security.Security;

/**
 * aes工具类
 *
 * @author simm
 */
public class AesUtils {
    public static String encrypt(String content, String password) throws Exception {
        byte[] raw = content.getBytes("utf-8");
        //"算法/模式/补码方式"
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding");
        CryptoHelper.setKeyIv(cipher, password);
        //此处使用BASE64做转码功能，同时能起到2次加密的作用。
        byte[] result = cipher.doFinal(raw);
        return Base64Utils.encodeToString(result);
    }
}
