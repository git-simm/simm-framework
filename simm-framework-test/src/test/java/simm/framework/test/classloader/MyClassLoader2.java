package simm.framework.test.classloader;

import java.io.FileInputStream;
import java.lang.reflect.Method;

/**
 * 自定义类加载器
 */
public class MyClassLoader2 extends ClassLoader {
    private String classPath;

    public MyClassLoader2(String classPath) {
        this.classPath = classPath;
    }

    private byte[] loadByte(String name) throws Exception {
        name = name.replaceAll("\\.", "/");
        FileInputStream fis = new FileInputStream(classPath + "/" + name
                + ".class");
        int len = fis.available();
        byte[] data = new byte[len];
        fis.read(data);
        fis.close();
        return data;

    }

    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            byte[] data = loadByte(name);
            return defineClass(name, data, 0, data.length);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ClassNotFoundException();
        }
    }

    public static void main(String args[]) throws Exception {
        MyClassLoader2 classLoader = new MyClassLoader2("D:/test");
        Class clazz = classLoader.loadClass("com.huachao.cl.Test");
        Object obj = clazz.newInstance();
        Method helloMethod = clazz.getDeclaredMethod("hello", null);
        helloMethod.invoke(obj, null);
    }
};
