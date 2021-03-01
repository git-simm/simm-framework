package test.simm.webflux.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

/**
 * 门户测试
 *
 * @author miscr
 * docs: https://blog.csdn.net/yeweilei/article/details/80109584
 * poll: https://www.cnblogs.com/twodog/p/12137487.html
 * https://zhuanlan.zhihu.com/p/92460075
 */
@RestController
@Slf4j
public class HomeController {
    @GetMapping({"", "/"})
    public Mono<String> hello() {
        log.info("开始接待");
        // Mono<String> result = Mono.just(getInfo()); 阻塞式
        //非阻塞式
        Mono<String> result = Mono.fromSupplier(() -> getInfo());
        log.info("接待完毕");
        return result;
    }

    @GetMapping(value = "poll",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> poll() {
        log.info("开始接待");
        return Flux.interval(Duration.ofSeconds(3))
                .doOnNext(e -> log.info(e.toString()))
                .doOnError(e -> e.printStackTrace())
                .map(data -> "hello flux,--"+data.toString());
    }

    /**
     * Flux : 返回0-n个元素
     * 注：需要指定MediaType
     * @return
     */
    @GetMapping(value = "/3", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    private Flux<String> flux() {
        Flux<String> result = Flux.fromStream(IntStream.range(1, 5).mapToObj(i -> {
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                    }
                    return "flux data--" + i;
                }));
        return result;
    }

    private String getInfo() {
        log.info("开始服务");
        try {
            TimeUnit.SECONDS.sleep(5);
            return "Hello webflux.";
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            log.info("服务完毕");
        }
        return "Hello webflux.";
    }
}
