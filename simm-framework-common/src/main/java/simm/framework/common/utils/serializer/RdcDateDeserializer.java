package simm.framework.common.utils.serializer;

import com.alibaba.fastjson.parser.DefaultJSONParser;
import com.alibaba.fastjson.serializer.DateCodec;
import org.springframework.util.StringUtils;

import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * RDC日期格式化
 * @author simm
 */
public class RdcDateDeserializer extends DateCodec {
    public final static RdcDateDeserializer instance = new RdcDateDeserializer();
    public static final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
    @Override
    public <T> T cast(DefaultJSONParser parser, Type clazz, Object fieldName, Object val){
        if(val==null){
            return null;
        }
        String strDate = String.valueOf(val);
        if(StringUtils.isEmpty(strDate)){
            return null;
        }
        // java8的日期解析只支持到毫秒级
        try {
            // 日期字符串只保留到毫秒
            return (T) formatter.parse(strDate.substring(0,23));
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
