#Centos7开机之后连不上网ens33mtu 1500 qdisc noop state DOWN group default qlen 1000
在开机之后，发现网卡没有启动起来，进行了如下操作,还是不行
1、[root@es1 es]# ifup ens33
错误：激活连接失败：No suitable device found for this connection.
2、[root@es1 es]#  systemctl start network
Job for network.service failed because the control process exited with error code. See "systemctl status network.service" and "journalctl -xe" for details

##解决、先停止网卡，设置disable，然后启动，发现网卡启动了
[root@es1 es]# systemctl stop NetworkManager
[root@es1 es]# systemctl disable NetworkManager
Removed symlink /etc/systemd/system/multi-user.target.wants/NetworkManager.service.
Removed symlink /etc/systemd/system/dbus-org.freedesktop.NetworkManager.service.
Removed symlink /etc/systemd/system/dbus-org.freedesktop.nm-dispatcher.service.
[root@es1 es]# service network restart