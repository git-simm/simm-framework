package simm.framework.common.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.jedis.JedisClusterConnection;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import redis.clients.jedis.*;
import redis.clients.jedis.exceptions.JedisConnectionException;
import redis.clients.util.JedisClusterCRC16;
import redis.clients.util.Pool;

import javax.annotation.PostConstruct;
import java.lang.reflect.Field;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * redis 集群下的管道使用工具类 ：
 *  List<ResponseProxy> rlist=</ResponseProxy> execute((clusterPipeline) ->{
 *
 *               ResponseProxy abc=  clusterPipeline.get("abc");
 *
 *         });
 *
 * 结合现有redisTemplate 工具和当前key value 序列化结合。
 * 优先使用现有api 已有的批量操作API ，比如map 的批量获取key,批量删 ,list 批量等
 * @author simm
 */
@Component
public class RedisClusterPipelineSupport {

    static Field dataSourceField = ReflectionUtils.findField(Jedis.class, "dataSource", null);
    static Field handlerField = ReflectionUtils.findField(BinaryJedisCluster.class, null, JedisClusterConnectionHandler.class);
    static Field cacheField = ReflectionUtils.findField(JedisSlotBasedConnectionHandler.class, "cache", JedisClusterInfoCache.class);
    @Autowired
    RedisTemplate redisTemplate;

    private RedisSerializer keySerializer;

    private RedisSerializer valueSerializer;

    private RedisSerializer hashKeySerializer;

    private RedisSerializer hashValueSerializer;

    @FunctionalInterface
    public static interface PipelineAction {
        /**
         * 集群管道
         * @param pipeline
         * @return
         */
        public void action(ClusterPipeline pipeline);
    }

    @FunctionalInterface
    private static interface Action {
        /**
         * 具体执行节点的管道命令
         * @param pipeline
         * @return
         */
        public ResponseProxy exec(Pipeline pipeline);
    }

    public   class ResponseProxy{

        private Response internal;

        public ResponseProxy(Response b) {
            internal=b;
        }

        /**
         * 当pipeline 返回byte[] 且 有valueSerializer 时，序列化；反之返回原类型
         * @return
         */
        public Object get() {
            if(valueSerializer==null){
                return internal.get();
            }else{
                Object o=internal.get();
                if(o instanceof byte[]){
                    return valueSerializer.deserialize((byte[])o);
                }else if (o instanceof List){
                    List<byte[]> list=(List<byte[]>)o;

                    return list.stream().map(b -> valueSerializer.deserialize(b)).collect(Collectors.toList());
                }else{
                    return o;
                }
            }
        }
    }


    //JedisClusterInfoCache
    static {
        dataSourceField.setAccessible(true);
        handlerField.setAccessible(true);
        cacheField.setAccessible(true);
    }

    public  class ClusterPipeline {

        private Map<Jedis, Pipeline> pipelineHashMap = new HashMap<>();

        private Map<Pool, Jedis> connectionMap = new HashMap<>();

        private List<ResponseProxy> responseList = new ArrayList<>();


        public ResponseProxy exec(byte[] key, Action action) {
            int slot = JedisClusterCRC16.getSlot(key);
            try {
                Jedis connection = getConnection(slot);

                Pipeline pipeline = getPipeline(connection);
                ResponseProxy response = action.exec(pipeline);
                responseList.add(response);
                return response;
            } catch (JedisConnectionException jce) {
                jce.printStackTrace();
                releaseConnection();
                throw jce;
            } catch (IllegalAccessException e) {
                e.printStackTrace();
                throw new RuntimeException(e);
            }

        }
        // 由于没有key value 的序列化，不能操作使用当前redisTemlate 写入的值，因此从写部分命令，若要使用的命令不在方法中，集成该类自行实现

        /**
         * key-value :get
         * @param key utf-8编码
         * @return
         */
        public ResponseProxy get(String key) {

            byte[] key1=keySerializer==null?key.getBytes(Charset.forName("utf-8")) :keySerializer.serialize(key);
            return exec(key1, new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {

                    return new ResponseProxy(pipeline.get(keySerializer.serialize(key1)));

                }
            });
        }
        public ResponseProxy set(String key,Object value) {

            byte[] key1=keySerializer==null?key.getBytes(Charset.forName("utf-8")) :keySerializer.serialize(key);
            return exec(key1, new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {

                    return new ResponseProxy(pipeline.set(keySerializer.serialize(key1),valueSerializer.serialize(value)));

                }
            });
        }
        public ResponseProxy expire(String key,int seconds) {

            byte[] key1=keySerializer==null?key.getBytes(Charset.forName("utf-8")) :keySerializer.serialize(key);
            return exec(key1, new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {

                    return new ResponseProxy(pipeline.expire(keySerializer.serialize(key1),seconds));

                }
            });
        }
        public ResponseProxy incr(String key,long integer) {

            byte[] key1=keySerializer==null?key.getBytes(Charset.forName("utf-8")) :keySerializer.serialize(key);
            return exec(key1, new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {
                    return new ResponseProxy(pipeline.incrBy(keySerializer.serialize(key1),integer));
                }
            });
        }
        public ResponseProxy decr(String key,long integer) {

            byte[] key1=keySerializer==null?key.getBytes(Charset.forName("utf-8")) :keySerializer.serialize(key);
            return exec(key1, new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {
                    return new ResponseProxy(pipeline.decrBy(keySerializer.serialize(key1),integer));
                }
            });
        }
        public ResponseProxy lrange(String key, long start, long end) {

            byte[] key1=keySerializer==null?key.getBytes(Charset.forName("utf-8")) :keySerializer.serialize(key);
            return exec(key1, new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {
                    return new ResponseProxy(pipeline.lrange(keySerializer.serialize(key1),  start,  end));
                }
            });
        }
        public ResponseProxy lrem(String key, long count, String value ) {

            byte[] key1=keySerializer==null?key.getBytes(Charset.forName("utf-8")) :keySerializer.serialize(key);
            return exec(key1, new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {
                    return new ResponseProxy(pipeline.lrem(keySerializer.serialize(key1),  count,  valueSerializer.serialize(value)));
                }
            });
        }


        private Pipeline getPipeline(Jedis jedis) {
            Pipeline pipeline = pipelineHashMap.get(jedis);
            if (pipeline == null) {
                pipeline = jedis.pipelined();
                pipelineHashMap.put(jedis, pipeline);

            }
            return pipeline;
        }

        private Jedis getConnection(int slot) throws IllegalAccessException {
            JedisClusterInfoCache cache = (JedisClusterInfoCache) cacheField.get(jedisSlotBasedConnectionHandler);
            JedisPool pool = cache.getSlotPool(slot);
            Jedis jedis = null;
            if (pool != null) {
                if (connectionMap.containsKey(pool)) {
                    return connectionMap.get(pool);
                } else {
                    jedis = pool.getResource();
                    connectionMap.put(pool, jedis);
                    return jedis;
                }
            } else { // 复用{@link JedisSlotBasedConnectionHandler.getConnectionFromSlot(slot)} 的后半段代码
                jedis = jedisSlotBasedConnectionHandler.getConnectionFromSlot(slot);
                pool = (JedisPool) dataSourceField.get(jedis);
                if (connectionMap.containsKey(pool)) {// THIS IF SHOULD NEVER BE EXECUTED
                    jedis.close();
                    return connectionMap.get(pool);
                } else {
                    connectionMap.put(pool, jedis);
                    return jedis;
                }

            }
        }

        private void sync() {
            try {
                pipelineHashMap.values().parallelStream().forEach(p -> p.sync());

            } finally {
                releaseConnection();
            }

        }

        public List<Object> syncAndReturnAll() {

            sync();
            return responseList.parallelStream().map(
                    r->r.get()
            ).collect(Collectors.toList());
        }

        private void releaseConnection() {
            connectionMap.values().parallelStream().forEach(c -> c.close());
        }
    }



    @PostConstruct
    public void init() throws IllegalAccessException {
        JedisClusterConnection jedisClusterConnection = (JedisClusterConnection) redisTemplate.getConnectionFactory().getClusterConnection();
        JedisCluster jedisCluster = jedisClusterConnection.getNativeConnection();

        jedisSlotBasedConnectionHandler = (JedisSlotBasedConnectionHandler) handlerField.get(jedisCluster);
        keySerializer=redisTemplate.getKeySerializer();
        valueSerializer=redisTemplate.getValueSerializer();
        hashKeySerializer=redisTemplate.getHashKeySerializer();
        hashValueSerializer=redisTemplate.getHashValueSerializer();
    }


    private JedisSlotBasedConnectionHandler jedisSlotBasedConnectionHandler;

    public List<Object> execute(PipelineAction action) {
        ClusterPipeline pipeline = new ClusterPipeline();
        action.action(pipeline);
        return pipeline.syncAndReturnAll();
    }

    public void setRedisTemplate(RedisTemplate t){
        this.redisTemplate=t;
    }

    public void test() {

        execute((clusterPipeline) ->{

            ResponseProxy abc=  clusterPipeline.get("abc");

        });

        // had not support

        execute((clusterPipeline) ->{

            ResponseProxy abc= clusterPipeline.exec("abc".getBytes(), new Action() {
                @Override
                public ResponseProxy exec(Pipeline pipeline) {
                    // do yourself command
                    return null;
                }
            });

        });
    }

}
