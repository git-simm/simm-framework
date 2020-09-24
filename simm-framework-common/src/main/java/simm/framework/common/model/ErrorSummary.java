package simm.framework.common.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 错误统计
 * @author simm
 */
@Data
public class ErrorSummary {
    /**
     * 错误信息
     */
    public Map<Integer, String> errors = new HashMap<>();
    /**
     * 错误的行号
     */
    public List<Integer> errorRows = new ArrayList<>();
    /**
     * 计划信息
     */
    SguPlanImpFileInfo sguPlanImpFileInfo;
}
