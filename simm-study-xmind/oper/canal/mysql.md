- [canal v1.1.4 文档手册](https://www.bookstack.cn/read/canal-v1.1.4/e015ba3570152b7a.md)
- [CentOS7利用docker安装MySQL5.7](https://www.cnblogs.com/wjw1014/p/12149399.html)
- [canal-admin的高可用使用，单机使用，HA使用，阿里的canal的UI界面，管理canal的实例](https://www.icode9.com/content-4-454188.html)
- [mysql主从复制](https://baijiahao.baidu.com/s?id=1685556899002728376&wfr=spider&for=pc)
```shell script
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
docker pull daocloud.io/library/mysql:5.7
```
```shell script
mkdir -p /mysql/data   /mysql/logs  /mysql/conf
cd /mysql/conf
touch my.cnf
```

```shell script
docker run -d -p 3306:3306 \
--restart always  \
--privileged=true  \
-v /docker/mysql/conf:/etc/mysql/conf.d \
-v /mysql/logs:/logs \
-v /docker/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456  \
--name mysql 718a6da099d8 \
--character-set-server=utf8mb4 \
--collation-server=utf8mb4_general_ci
```


[Canal Server+Canal Admin](https://www.cnblogs.com/dalianpai/p/13620035.html)
- 对于自建 MySQL , 需要先开启 Binlog 写入功能，配置 binlog-format 为 ROW 模式，my.cnf 中配置如下
```
[mysqld]
log-bin=mysql-bin 	# 开启 binlog
binlog-format=ROW 	# 选择 ROW 模式
server_id=1 		# 配置 MySQL replaction 需要定义，不要和 canal 的 slaveId 重复
```

- 授权 canal 链接 MySQL 账号具有作为 MySQL slave 的权限, 如果已有账户可直接 grant
```sql
-- 新建用户
CREATE USER canal IDENTIFIED BY 'canal';  

-- GRANT ALL PRIVILEGES ON *.* TO 'canal'@'%' ;
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'canal'@'%';

-- 刷新权限
FLUSH PRIVILEGES;
```

## Canel Admin部署
- 下载镜像
```shell script
[root@nacos ~]#  docker pull canal/canal-admin:v1.1.4
v1.1.4: Pulling from canal/canal-admin
1c8f9aa56c90: Pull complete
c5e21c824d1c: Pull complete
4ba7edb60123: Pull complete
6c0a775b3e51: Pull complete
ff741e81e02e: Pull complete
1532a9748c0a: Pull complete
a18427141526: Pull complete
Digest: sha256:c3ac54daae37b14ec32fb6a125dc9ceb243377dd147ac53af9f9f6cdf18aeac3
Status: Downloaded newer image for canal/canal-admin:v1.1.4
docker.io/canal/canal-admin:v1.1.4
```

- 启动容器
```shell script
[root@nacos ~]# sh  run_admin.sh -e server.port=8089 \
>          -e canal.adminUser=admin \
>          -e canal.adminPasswd=admin
docker run -d -it -h 192.168.1.118 -e server.port=8089 -e canal.adminUser=admin -e canal.adminPasswd=admin --name=canal-admin --net=host -m 1024m canal/canal-admin
Unable to find image 'canal/canal-admin:latest' locally
latest: Pulling from canal/canal-admin
1c8f9aa56c90: Already exists
c5e21c824d1c: Already exists
4ba7edb60123: Already exists
6c0a775b3e51: Already exists
789e835e240f: Pull complete
43cb563af61a: Pull complete
db2286df2f2d: Pull complete
Digest: sha256:b3b21de49922a361286e3074fb36a457dab54a6bbb545234a5ff8fd56a2b51fe
Status: Downloaded newer image for canal/canal-admin:latest
749993e3f7f0ace2692a839a326e9ece3654f0952984190376c5fd14c3053292
[root@nacos ~]# docker logs canal-admin
DOCKER_DEPLOY_TYPE=VM
==> INIT /alidata/init/02init-sshd.sh
==> EXIT CODE: 0
==> INIT /alidata/init/fix-hosts.py
==> EXIT CODE: 0
==> INIT DEFAULT
Generating SSH1 RSA host key:                              [  OK  ]
Starting sshd:                                             [  OK  ]
Starting crond:                                            [  OK  ]
==> INIT DONE
==> RUN /home/admin/app.sh
==> START ...
start mysql ...
Starting mysqld:                                           [  OK  ]
start mysql successful
start admin ...
```