[基于Fluentd的日志收集方案](https://www.jianshu.com/p/09cbd7fb369a)  
[Fluentd](https://docs.fluentd.org/)    
[docker 安装es](https://www.cnblogs.com/pigll/p/13684134.html)    
[CentOS 7 时区设置](https://www.cnblogs.com/zhangeamon/p/5500744.html)  
[k8s~fluentd的configmap设置es索引前缀](https://www.cnblogs.com/lori/p/12923220.html)
## 一、安装es

```shell script
# https://www.kancloud.cn/yiyanan/elasticsearch_7_6/1651637
mkdir -p /usr/conf/es/config
mkdir -p /usr/conf/es/data
echo "http.host: 0.0.0.0" >> /usr/conf/es/config/elasticsearch.yml

# 增加执行权限
chmod -R 777 /usr/conf/es

# 下载并启动 es
docker run -d \
            --name elasticsearch \
            -p 9200:9200 \
            -p 9300:9300  \
            -e "discovery.type=single-node" \
            -e ES_JAVA_OPTS="-Xms64m -Xmx128m" \
            -v /usr/conf/es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
            -v /usr/conf/es/data:/usr/share/elasticsearch/data \
            -v /usr/conf/es/plugins:/usr/share/elasticsearch/plugins \
            elasticsearch:7.6.2
```
http://192.168.72.128:9200/

## 二、安装kibana
```shell script
mkdir -p /usr/conf/kibana
chmod -R 777 /usr/conf/kibana


cd /usr/conf/kibana

vim kibana.yml
```

```shell script
server.port: 5601
server.host: 0.0.0.0
elasticsearch.hosts: [ "http://192.168.72.128:9200" ]
i18n.locale: "zh-CN"
```

```shell script
docker run -p 5601:5601\
                    --name kibana \
                    -v /usr/conf/kibana/kibana.yml:/usr/share/kibana/config/kibana.yml \
                    -d kibana:7.6.2
```
http://192.168.72.128:5601/

## 三、docker客户端安装Fluentd可以搜集日志
1、本机/usr/conf/下创建docker-fluentd.conf
```xml
<source>
@type forward
</source>

<match *>
@type stdout
</match>
```
*复杂示例*
```xml
<source>
type tail
format json
path /var/log/*.log
pos_file /var/log/*.log.pos
tag test.*
</source>

<match **>
@id elasticsearch
@type elasticsearch
@log_level debug
type_name fluentd
host elasticsearch.elk
port 9200
logstash_format true
logstash_prefix test #表示索引的前缀，对应source里的tag，一个namespace可以是一个，对应一组微服务，方便进行日志追踪
flush_interval 10s
</match> 
```

2、构建个fluentd镜像，带es插件
```dockerfile
FROM fluent/fluentd
RUN echo "source 'https://mirrors.tuna.tsinghua.edu.cn/rubygems/'" > Gemfile && gem install bundler
RUN gem install fluent-plugin-elasticsearch -v 4.0.3 --no-document
CMD ["fluentd"]
```

3、执行构建
```shell script
docker build -t fluentd-es:v1.3.2 .
```

4、启动 Fluentd容器，路径 usr/conf/fluentd/docker-fluentd.conf
```shell script
docker run -d \
-p 24224:24224  -v /usr/conf/fluentd:/fluentd/etc \ 
-e FLUENTD_CONF=docker-fluentd.conf \ 
fluentd-es:v1.3.2
```

5、自制docker镜像的这一种，路径 usr/conf/fluentd/fluent.conf
```shell script
docker run -d -p 24224:24224  -v /usr/conf/fluentd:/etc/fluent \
-e FLUENTD_CONF=fluent.conf fluentd-es:v1.3.2
```

## 四、docker 日志输出到fluentd中
```shell script
docker run -e JAVA_OPTS='-Dserver.port=8088' \
    -e clientIp=10.8.8.8 -e clientPort=8888 \
    --log-driver fluentd \
    --log-opt fluentd-address=192.168.72.128:24224 \
    --log-opt tag="test-exchange"  \
    --log-opt fluentd-async-connect  \
    -p 8088:8088  \
    --name test-exchange \
    test-exchange
```

测试站点
http://192.168.72.128:8088

## 五、将 fluentd 转发到 es 中





