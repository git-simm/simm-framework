package simm.autoservice.test.javafile;

import com.squareup.javapoet.*;

import javax.annotation.Nullable;
import javax.lang.model.element.Modifier;
import java.io.IOException;

/**
 * @author miscr
 */
public class JavaPoetStudy {
    public static void main(String[] args) {
        String packageName = "simm.autoservice.test.javafile";
        ClassName say = ClassName.get("simm.autoservice.test.javafile", "ISay");

        TypeSpec.Builder mainActivityBuilder = TypeSpec.classBuilder("MySay")
                .addModifiers(Modifier.PUBLIC)
//                .superclass(activity)
                .addSuperinterface(say);

        ParameterSpec name = ParameterSpec.builder(String.class, "name")
                .addAnnotation(Nullable.class)
                .build();

        MethodSpec onCreate = MethodSpec.methodBuilder("say")
                .addAnnotation(Override.class)
                .addModifiers(Modifier.PUBLIC)
                .addParameter(name)
                .addStatement("system.out.println(\"hello,\"+name)")
                .build();

        TypeSpec sayClazz = mainActivityBuilder.addMethod(onCreate).build();
        JavaFile file = JavaFile.builder(packageName, sayClazz).build();

        try {
            file.writeTo(System.out);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
