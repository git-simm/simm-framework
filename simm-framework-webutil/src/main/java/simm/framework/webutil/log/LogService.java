package simm.framework.webutil.log;

public interface LogService {

    /**
     * 发送日志消息
     * */
    void sendLogByMq(String messageData);
}
