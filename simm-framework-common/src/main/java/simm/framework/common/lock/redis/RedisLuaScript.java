package simm.framework.common.lock.redis;

import java.util.List;

public interface RedisLuaScript {
    /**
     * redis lua 脚本执行
     * @param script
     * @param keys
     * @param args
     * @return
     */
    public Object eval(String script, List<String> keys, List<String> args);

}
