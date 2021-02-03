package simm.test.nacos.provider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author xiaojing
 */
@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderApplication {
	public static void main(String[] args) {
		SpringApplication.run(NacosProviderApplication.class, args);
	}

	/**
	 * 控制器
	 */
	@RestController
	class EchoController {
		@Value("${server.port}")
		private int port;

		@GetMapping(value = "/echo/{string}")
		public String echo(@PathVariable String string) {
			return "Hello Nacos["+ port +"] Discovery " + string;
		}
	}
}