FROM java:8
LABEL ANTHOR="siman(214382122@qq.com)" VERSION="1.0.0" BUILD_DATE="2020-09-01" \
      RESOURCES="https://github.com/tesseract-ocr/tesserac http://www.leptonica.org/index.html https://github.com/tesseract-ocr/tessdata"
VOLUME /tmp
ADD simm-framework-test-1.0.jar app.jar
EXPOSE 9999
# 环境变量(tesseract)
ENV LD_LIBRARY_PATH="/usr/local/lib" \
    LIBLEPT_HEADERSDIR="/usr/local/include" \
    PKG_CONFIG_PATH="/usr/local/lib/pkgconfig" \
    TESSDATA_PREFIE=/usr/tessdata
# 安装tesseract环境
ADD   tesseract-4.1.1.tar.gz /
ADD   leptonica-1.80.0.tar.gz /
ADD   sources.list /
# ADD   tesseract_langs.tar.gz /usr/local/share/tessdata/
# 清空文件
# RUN  apt-get install -y apt-transport-https
# 更换镜像源
RUN  apt-get clean
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak && mv sources.list /etc/apt/
RUN sed -i 's/deb\.debian\.org/mirrors.aliyun.com/' /etc/apt/sources.list
# 更新镜像索引
#RUN echo "deb [check-valid-until=no] http://cdn-fastly.deb.debian.org/debian jessie main" > /etc/apt/sources.list.d/jessie.list
#RUN echo "deb [check-valid-until=no] http://dev.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
#RUN sed -i '/deb http:\/\/deb.debian.org\/debian jessie-updates main/d' /etc/apt/sources.list
RUN apt-get -o Acquire::Check-Valid-Until=false update
#RUN  apt-get update -y
# RUN   apt-get install yum -y
RUN   apt-get -y install file automake libjpeg-devel libpng-devel libtiff-devel zlib-devel libtool gcc-c++ make \
      && cd /leptonica-1.80.0 && ./configure && make && make install \
      && cd /tesseract-4.1.1 && ./autogen.sh && ./configure && make && make install \
      && rm -rf /leptonica-1.80.0 /tesseract-4.1.1

# 时区设置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

# 启动入口
ENTRYPOINT ["java","-jar","/app.jar"]