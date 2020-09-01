FROM java:8
LABEL author="214382122@qq.com"
VOLUME /tmp
ADD simm-framework-test-1.0.jar app.jar
EXPOSE 9999
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
ENTRYPOINT ["java","-jar","/app.jar"]