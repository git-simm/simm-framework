- [quick-start](https://nacos.io/zh-cn/docs/quick-start.html)
- [docker-compose安装与使用](https://www.cnblogs.com/zhi-leaf/p/12090456.html)

## docker-compose的安装
```shell script
curl -L https://github.com/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
curl -L https://github.com/docker/compose/releases/download/1.25.0/docker-compose-Linux-x86_64 -o /usr/local/bin/docker-compose   # 等效上面的命令
chmod +x /usr/local/bin/docker-compose

# 查看版本
docker-compose --version
```

### docker-compose常用命令
```shell script
docker-compose -h                           # 查看帮助

docker-compose up                           # 创建并运行所有容器
docker-compose up -d                        # 创建并后台运行所有容器
docker-compose -f docker-compose.yml up -d  # 指定模板
docker-compose down                         # 停止并删除容器、网络、卷、镜像。

docker-compose logs       # 查看容器输出日志
docker-compose pull       # 拉取依赖镜像
dokcer-compose config     # 检查配置
dokcer-compose config -q  # 检查配置，有问题才有输出

docker-compose restart   # 重启服务
docker-compose start     # 启动服务
docker-compose stop      # 停止服务
```

## nacos快速开始
```shell script
# clone项目
git clone https://github.com/nacos-group/nacos-docker.git
cd nacos-docker

# 单机mysql-5.7
docker-compose -f example/standalone-mysql-5.7.yaml up

# 单机mysql-5.8
docker-compose -f example/standalone-mysql-8.yaml up

# 集群部署
docker-compose -f example/cluster-hostname.yaml up

```
## nacos的环境
|service|address|desc|
|---- |----  |----  |
|nacos集群地址|http://192.168.72.128:8848/nacos/ |----  |


[Nacos监控手册](https://nacos.io/zh-cn/docs/monitor-guide.html)
## Nacos 监控手册
