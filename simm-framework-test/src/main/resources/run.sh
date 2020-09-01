#!/bin/sh
echo "删除当前的镜像文件"
docker rm ocr-api
docker image rm ocr-api

echo "制作镜像"
docker build -t ocr-api:v1.0 .

echo "运行镜像"
docker run -it -v /usr/tessdata:/usr/tessdata -p 8080:8080 --name="ocr-api" ocr-api:v1.0

# sed -i "s/\r//" run.sh 执行此命令进行转格式