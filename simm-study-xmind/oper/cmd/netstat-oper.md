###### 干掉占用端口的进程
```shell script
netstat -aon|findstr "49157"
tasklist|findstr "20020"
taskkill /f /pid 20020
taskkill /f /t /im Tencentdl.exe
```