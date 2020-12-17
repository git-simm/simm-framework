package simm.framework.common.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @ClassName SguPlanImpFileInfo
 * @Author huangchenglong
 * @Date 2020/8/4 10:28
 */
@Data
@TableName(value = "sgu_plan_imp_file_info")
public class SguPlanImpFileInfo implements Serializable {

    @TableId(type = IdType.AUTO)
    private Integer id;
    /**
     * 计划名称
     */
    @TableField(value = "plan_name")
    private String planName;

    /**
     * 计划编码
     */
    @TableField(value = "plan_number")
    private String planNumber;
    /**
     *批量导入文件名称
     * */
    @TableField(value = "file_name")
    private String fileName;
    /**
     *批量导入文件URL
     * */
    @TableField(value = "url")
    private String url;
    /**
     *导入状态:0-失败,1-成功
     * */
    @TableField(value = "valid")
    private Integer valid;
    /**
     *备注
     * */
    @TableField(value = "remark")
    private String remark;

    /**
     * 成功记录条数
     */
    @TableField(value = "success_records")
    private Integer successRecords;

    /**
     * 失败记录数
     */
    @TableField(value = "error_records")
    private Integer errorRecords;

    /**
     * 创建人用户ID
     * */
    @TableField(value = "creator_id")
    private Integer creatorId;
    /**
     * 创建人名称
     * */
    @TableField(value = "creator_name")
    private String creatorName;
    /**
     * 数据创建时间
     * */
    @TableField(value = "create_time")
    private Date createTime;

    /**
     * 创建人等级:0-总部;1-省级;2-城市
     */
    @TableField(value = "creator_role")
    private Integer creatorRole;

    /**
     * 创建人所属城市名称/省份名称/总部
     */
    @TableField(value = "creator_belongs")
    private String creatorBelongs;

    /**
     * 创建人所属城市/省份/总部ID
     */
    @TableField(value = "creator_belongs_id")
    private Integer creatorBelongsId;

    /**
     * 修改人ID
     * */
    @TableField(value = "modifier_id")
    private Integer modifierId;
    /**
     * 修改人名称
     * */
    @TableField(value = "modifier_name")
    private String modifierName;
    /**
     * 修改时间
     * */
    @TableField(value = "modify_time")
    private Date modifyTime;
    /**
     * '逻辑删除标记:0-未删除,1-已删除'
     * */
    @TableField(value = "delete_flag")
    private Integer deleteFlag;

    @TableField(exist = false)
    private String beginCreateAt;

    @TableField(exist = false)
    private String endCreateAt;
    /**
     * 子任务明细
     */
    @TableField(exist = false)
    List<SguPlanBaseInfo> sguPlanBaseInfoList;
    /**
     * 错误信息
     */
    @TableField(exist = false)
    ErrorSummary errorSummary;

    /**
     * 已提交SGU总数
     */
    @TableField(exist = false)
    private Integer submitSum;

    /**
     * 草稿状态SGU总数
     */
    @TableField(exist = false)
    private Integer draftSum;

    /**
     * 作废总数
     */
    @TableField(exist = false)
    private Integer deleteSum;

    /**
     * 待编辑总数
     */
    @TableField(exist = false)
    private Integer waitEditSum;


}
