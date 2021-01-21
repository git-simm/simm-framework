package simm.framework.common.utils.reflect;

import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import simm.framework.common.utils.date.MyDateUtils;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 比较两个对象的变化
 *
 * @author simm
 */
@Slf4j
public class CompareUtils {

    /**
     * 记录每个修改字段的分隔符
     */
    public static final String separator = ";";

    /**
     * 比较两个对象,并返回不一致的信息
     *
     * @param oldObj 旧对象
     * @param newObj 新对象
     * @return
     */
    public static List<CompareItem> compare(Object oldObj, Object newObj) {

        List<CompareItem> items = new ArrayList<>();
        //获取对象的class
        Class<?> oldClass = oldObj.getClass();
        Class<?> newClass = newObj.getClass();
        //获取对象的属性列表
        Field[] oldFields = oldClass.getDeclaredFields();
        Field[] newFields = newClass.getDeclaredFields();
        for (int i = 0; i < oldFields.length; i++) {
            if ("serialVersionUID".equals(oldFields[i].getName())) {
                continue;
            }
            oldFields[i].setAccessible(true);
            newFields[i].setAccessible(true);

            // 这样就获取到这个注解属性了
            CompareMeta fieldChinese = oldFields[i].getAnnotation(CompareMeta.class);
            //无对应注解则说明该字段无需比较
            if (fieldChinese == null || StringUtils.isBlank(fieldChinese.name())) {
                continue;
            }
            //获取注解中字段名
            String fieldName = fieldChinese.name();

            PropertyDescriptor oldPd = null;
            try {
                oldPd = new PropertyDescriptor(oldFields[i].getName(), oldClass);
                PropertyDescriptor newPd = new PropertyDescriptor(newFields[i].getName(), newClass);
                Method oldReadMethod = oldPd.getReadMethod();
                Method newReadMethod = newPd.getReadMethod();
                //获取对应字段的值
                Object oldValue = oldReadMethod.invoke(oldObj);
                Object newValue = newReadMethod.invoke(newObj);
                //获取差异字段
                CompareItem item = getDifferenceFieldStr(oldFields[i].getName(), fieldName, oldValue, newValue);
                if (item != null) {
                    items.add(item);
                }
            } catch (Exception e) {
                e.printStackTrace();
                log.error(e.getMessage(),e);
            }
        }
        return items;
    }

    /**
     * 比较结果转json
     *
     * @param items 比较结果
     * @return json
     */
    public static String resultToJson(List<CompareItem> items) {
        return JSON.toJSONString(items, true);
    }

    /**
     * 比较结果转json
     *
     * @param items 比较结果
     * @return json
     */
    public static String resultToStr(List<CompareItem> items) {
        List<String> results = new ArrayList<>();
        items.forEach(item->{
            results.add(String.format("字段[%s],变更:[%s]->[%s]",item.getFieldName(),item.getOldVal(),item.getNewVal()));
        });
        return String.join("；", results);
    }

    /**
     * 获取差异字段新旧值
     *
     * @param field     字段名
     * @param fieldName 字段中文名
     * @param oldValue  旧值
     * @param newValue  新值
     * @return 返回比较结果
     */
    private static CompareItem getDifferenceFieldStr(String field, String fieldName, Object oldValue, Object newValue) {
        CompareItem item = null;
        if(oldValue instanceof Date){
            oldValue = MyDateUtils.getStringDate((Date)oldValue);
        }
        if(newValue instanceof Date){
            newValue = MyDateUtils.getStringDate((Date)newValue);
        }
        if (null == oldValue || StringUtils.isBlank(oldValue.toString())) {
            oldValue = "无";
        }
        if (null == newValue || StringUtils.isBlank(newValue.toString())) {
            newValue = "无";
        }
        if (!oldValue.equals(newValue)) {
            item = new CompareItem();
            item.setField(field);
            item.setFieldName(fieldName);
            item.setOldVal(oldValue);
            item.setNewVal(newValue);
            return item;
        } else {
            return null;
        }
    }
}