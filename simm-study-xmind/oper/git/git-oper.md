###### 一、当 .idea项目被git误管理后，可以按照如下方法进行处理
``` shell script
git rm -rf --cached .idea
```

###### 二、移除git管理
``` shell script
find . -name ".git" | xargs rm -rf
```