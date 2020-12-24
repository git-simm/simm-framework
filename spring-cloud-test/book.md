- [spring cloud stream集成rabbitmq](https://www.cnblogs.com/suruozhong/p/11539992.html)
- [CentOS使用Docker安装RabbitMq](https://www.jianshu.com/p/5d1f7652107b)
```shell script
docker pull rabbitmq:3.8.3-management
docker run -d --hostname my-rabbit -p 5672:5672 -p 15672:15672  --name some-rabbit rabbitmq:3.8.3-management

```
- [Docker安装rabbitmq 原](https://cloud.tencent.com/developer/article/1413491)
------------------------------------
- [CentOS7 Docker配置阿里镜像源](https://blog.csdn.net/github_38336924/article/details/101111482)