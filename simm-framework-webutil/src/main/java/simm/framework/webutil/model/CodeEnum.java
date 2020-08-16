package simm.framework.webutil.model;

/**
 * @author simm
 */

public enum CodeEnum {

    Ok(1000, "处理成功"),
    Error(4001, "处理失败.");

    private int key;

    private String value;

    CodeEnum(int key, String value) {
        this.key = key;
        this.value = value;
    }

    public int getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }
}
