package simm.framework.test.spring;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import test.framework.simm.TestApplication;
import test.framework.simm.controller.TestController;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestApplication.class)
//配置mock
@AutoConfigureMockMvc
public class HelloControllerTest {
    @Autowired
    private TestController testController;

    @Autowired
    private MockMvc mvc;

    /**
     * springboot测试
     */
    @Test
    public void getHello(){
        final String greeting = testController.search();
        Assert.assertEquals("hello world!",greeting);
    }

    @Test
    public void getHello2() throws Exception {
        MvcResult testResult = mvc.perform(MockMvcRequestBuilders.get("/test/hello").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn();
        String str = testResult.getResponse().getContentAsString();
    }
}
