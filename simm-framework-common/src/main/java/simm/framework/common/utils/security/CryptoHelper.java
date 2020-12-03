package simm.framework.common.utils.security;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 加密助手
 * https://www.cnblogs.com/xinlulicheng/p/9528742.html
 * C#的byte    是 0-255
 * java的byte  是 -128-127
 *
 * @author simm
 */
public class CryptoHelper {
    /**
     * 与.net保持一致，目前为16位
     */
    private final static int IV_LENGTH = 16;
    private final static int KEY_LENGTH = 32;

    /**
     * 根据密文计算加密算法的key与iv
     *
     * @param cipher   加密工具
     * @param password 密码
     */
    public static Cipher setKeyIv(Cipher cipher, String password) throws Exception {
        try {
            //计算key 与 iv
            byte[] pwd = (password + "Mysoft!@#$%^&").getBytes("utf-8");
            byte[] md5 = getMd5Hash(pwd);
            byte[] sha1 = getsha1Hash(pwd);
            IvParameterSpec ivspec = new IvParameterSpec(getByteArray(md5, IV_LENGTH));
            SecretKeySpec keyspec = new SecretKeySpec(getByteArray(sha1, KEY_LENGTH), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keyspec, ivspec);
            return cipher;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 获取md5的hash值
     *
     * @param content 原字节数组
     * @return hash值
     * @throws NoSuchAlgorithmException
     */
    public static byte[] getMd5Hash(byte[] content) throws NoSuchAlgorithmException {
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        return md5.digest(content);
    }

    /**
     * 获取sha1的hash值
     *
     * @param content 原字节数组
     * @return hash值
     * @throws NoSuchAlgorithmException
     */
    public static byte[] getsha1Hash(byte[] content) throws NoSuchAlgorithmException {
        MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
        return sha1.digest(content);
    }

    private static byte[] getByteArray(byte[] src, int destLen) {
        byte[] dest = new byte[destLen];
        int p = 0;
        while (p < destLen) {
            for (byte b : src) {
                if (p >= destLen) {
                    return dest;
                } else {
                    dest[p++] = b;
                }
            }
        }
        return dest;
    }
}
