package simm.framework.test.jpa;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import test.framework.simm.TestApplication;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestApplication.class)
//配置mock
@AutoConfigureMockMvc
public class ObjectMapperTest {
    @Autowired
    private ObjectMapper objectMapper;
    @Test
    public void writer() throws JsonProcessingException {
        List<Double> data = Arrays.asList(1.99D,2.09D);
        objectMapper.setConfig(objectMapper.getSerializationConfig().without(SerializationFeature.FAIL_ON_EMPTY_BEANS));
        ObjectWriter writer = objectMapper.writerFor(this.getJsonType(data));
        System.out.println(writer.writeValueAsString(data));
        Assert.assertTrue(true);
    }

    protected <T> TypeReference<T> getJsonType(T data) {
        final Type[] actualTypeArguments = ((ParameterizedType) data.getClass().getGenericSuperclass()).getActualTypeArguments();
        return actualTypeArguments != null && actualTypeArguments.length > 0 ? new TypeReference<T>() {
            public Type getType() {
                return actualTypeArguments[0];
            }
        } : null;
    }
}
