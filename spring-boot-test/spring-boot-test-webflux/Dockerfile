FROM livingobjects/jre8
# 工作目录
WORKDIR /app
# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
# 拷贝文件到工作目录
ADD . /app
# 运行jar
ENV PORT=8580
ENTRYPOINT java -jar /app/spring-boot-test-webflux-1.0.jar --server.port=$PORT

# docker build -t flux:v1.0 .
# docker run -d -p 8580:8080 -e PORT=8080 --restart=always --name=flux flux:v1.0