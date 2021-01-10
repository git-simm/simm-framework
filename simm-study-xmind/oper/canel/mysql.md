[CentOS7利用docker安装MySQL5.7](https://www.cnblogs.com/wjw1014/p/12149399.html)
```shell script
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
docker pull daocloud.io/library/mysql:5.7
docker run -d -p 3306:3306 --restart always --privileged=true -v /docker/mysql/conf/my.cnf:/etc/my.cnf -v /docker/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql mysql:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci
```