package test.simm.grpc.server;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * @author miscr
 */
@Service
public class MyBusinessService {
    public MyBusinessService() {
    }

    @Transactional
    public void doSomeWork(String request) {
        System.out.println("收到消息:" + request);
    }

    public List<String> getNames() {
        return Arrays.asList("张三","李四","王五");
    }
}
