package simm.framework.common.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.springframework.data.rest.core.annotation.Description;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @ClassName SguPlanBaseInfo
 * @Author huangchenglong
 * @Date 2020/8/3 16:07
 */
@Data
@TableName(value = "sgu_plan_base_info")
public class SguPlanBaseInfo implements Serializable {

    @TableId(type = IdType.AUTO)
    private Integer id;
    /**
     * 批量导入文档主键ID
     * */
    @TableField(value = "file_id")
    private Integer fileId;

    @TableField(value = "plan_number")
    private String planNumber;
    /**
     * SGU_ID
     * */
    @TableField(value = "sgu_id")
    private Integer sguId;
    /**
     *sgu编码
     * */
    @TableField(value = "sgu_number")
    private String sguNumber;
    /**
     *供应商编码
     * */
    @TableField(value = "supply_number")
    @Description("供应商编码")
    private String supplyNumber;
    /**
     * '销售类型：0-预售,1-安全库存,2-实物库存'
     * */
    @TableField(value = "sale_type")
    @Description("销售类型")
    private Integer saleType;
    /**
     * SGU类型 2:自提SGU; 1:包邮SGU;
     * */
    @TableField(value = "sgu_type")
    @Description("SGU类型")
    private Integer sguType;

    /**
     * 配送方式 2:自提; 1:包邮;
     * */
    @TableField(value = "delivery_type")
    @Description("配送方式")
    private Integer deliveryType;
    /**
     * SGU排序号
     * */
    @TableField(value = "sort")
    @Description("SGU排序号")
    private Integer sort;
    /**
     * 仅团长可见:0-否,1-是
     * */
    @TableField(value = "only_partner")
    @Description("仅团长可见")
    private Integer onlyPartner;
    /**
     * 是否次日达：0、否；1、是
     * */
    @TableField(value = "is_next_day")
    @Description("是否次日达")
    private Integer isNextDay;
    /**
     * 是否换购:0-否 ，1-是
     * */
    @TableField(value = "exchange")
    @Description("是否换购")
    private Integer exchange;
    /**
     * 上架时间
     * */
    @TableField(value = "on_sale_time")
    @Description("上架时间")
    private Date onSaleTime;
    /**
     * 下架时间
     * */
    @TableField(value = "taken_off_time")
    @Description("下架时间")
    private Date takenOffTime;
    /**
     * 循环上架标记:0-否,1-是
     * */
    @TableField(value = "is_cycle_onsale")
    @Description("循环上架标记")
    private Integer isCycleOnSale;
    /**
     * 配送范围模板ID
     * */
    @TableField(value = "distribution_template_id")
    @Description("配送范围模板ID")
    private Integer distributionTemplateId;
    /**
     * 销售名称前缀
     * */
    @TableField(value = "prefix_name")
    @Description("销售名称前缀")
    private String prefixName;
    /**
     * 标签
     * */
    @TableField(value = "tag")
    @Description("标签")
    private String tag;
    /**
     * 计划状态:0-待编辑;1-SGU草稿;2-SGU已提交
     * */
    @TableField(value = "base_status")
    private Integer baseStatus;
    /**
     * 备注
     * */
    @TableField(value = "remark")
    @Description("备注")
    private String remark;
    /**
     * 是否有效标记:1-有效,0-无效)
     * */
    @TableField(value = "valid")
    private Integer valid;
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
    private List<SguPlanProdInfo> sguPlanProdInfoList;
    /**
     * ID 集合
     */
    @TableField(exist = false)
    private List<Integer> ids;
    /**
     * sku码
     * */
    @TableField(exist = false)
    private String skuNumber;
    /**
     * prodId
     * */
    @TableField(exist = false)
    private Integer prodId;

    @TableField(exist = false)
    private List<Integer> baseStatusList;
}
