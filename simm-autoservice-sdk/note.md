### 参考资料
https://www.cnblogs.com/limingblogs/p/8074582.html
https://www.lagou.com/lgeduarticle/82825.html
https://www.cnblogs.com/coder-chi/p/11316136.html

### 注意事项一
```
使用AutoService(Process.class)，
需要先创建/resources/META-INF/services/javax.annotation.processing.Processor 文件
```

### 注意事项二
```
把@AutoService Processor类拆到单独的Jar包里面，不要让它干扰到需要扫描的Spring项目
```