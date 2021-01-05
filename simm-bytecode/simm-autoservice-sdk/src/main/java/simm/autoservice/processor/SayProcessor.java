package simm.autoservice.processor;

import com.google.auto.service.AutoService;
import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.MethodSpec;
import com.squareup.javapoet.ParameterSpec;
import com.squareup.javapoet.TypeSpec;
import simm.autoservice.annotations.AutoSay;
import simm.autoservice.interfaces.ISay;

import javax.annotation.Nullable;
import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.PackageElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.util.Elements;
import javax.tools.Diagnostic;
import java.io.IOException;
import java.util.Set;

/**
 * 讲话类处理
 * @author miscr
 */
//指定支持的Java版本，这里是Java8
@SupportedSourceVersion(SourceVersion.RELEASE_8) //指定支持的Java版本，这里是Java8
//指定注解的类型
@SupportedAnnotationTypes({"simm.autoservice.annotations.AutoSay"})
@AutoService(Processor.class)
public class SayProcessor extends AbstractProcessor {
    private Filer filer;
    private Messager messager;
    private Elements elementUtils;
    public static final String doc = "\n This codes are generated automatically.";

    @Override
    public synchronized void init(ProcessingEnvironment processingEnvironment) {
        super.init(processingEnvironment);
        this.filer = this.processingEnv.getFiler();
        this.messager = processingEnvironment.getMessager();
        this.elementUtils = processingEnvironment.getElementUtils();
        this.messager.printMessage(Diagnostic.Kind.NOTE, "自动创建类型" );
    }

    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        this.messager.printMessage(Diagnostic.Kind.NOTE, "Processor : " + this.getClass().getSimpleName());
        Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(AutoSay.class);
        elements.forEach((x) -> {
            PackageElement packageElement = this.elementUtils.getPackageOf(x);
            String packageName = packageElement.getQualifiedName().toString();
            AutoSay annotation = x.getAnnotation(AutoSay.class);

            TypeSpec.Builder clazz = TypeSpec.classBuilder(x.getSimpleName() + "Impl")
                    .addModifiers(Modifier.PUBLIC, Modifier.FINAL)
//                    .addAnnotation(AnnotationSpec.builder(Converter.class)
//                            .addMember("autoApply", CodeBlock.builder().add("$L", new Object[]{annotation.autoApply()}).build()).build())
                    .addJavadoc(" This codes are generated automatically. Do not modify!")
//                    .superclass(ParameterizedTypeName.get(ClassName.get(AbstractJsonConverter.class),new TypeName[]{ClassName.get((TypeElement)x)})).build()
                    .addSuperinterface(ISay.class);

            ParameterSpec name = ParameterSpec.builder(String.class, "name")
                    .addAnnotation(Nullable.class)
                    .build();

            MethodSpec onCreate = MethodSpec.methodBuilder("run")
                    .addAnnotation(Override.class)
                    .addModifiers(Modifier.PUBLIC)
                    .addParameter(name)
                    .addStatement("System.out.println(\""+annotation.start()+",\"+name)")
                    .build();
            TypeSpec sayClazz = clazz.addMethod(onCreate).build();
            try {
                JavaFile javaFile = JavaFile.builder(packageName, sayClazz).build();
                javaFile.writeTo(this.filer);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        return false;
    }
}
