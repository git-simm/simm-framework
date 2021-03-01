```shell
在清理前内存使用情况 free -m

-m是单位，也可以-g

用以下命令清理内存

echo 1 > /proc/sys/vm/drop_caches
```
