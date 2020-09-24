package simm.framework.common.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.sun.org.glassfish.gmbal.Description;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Map;

/**
 * @ClassName SguPlanProdInfo
 * @Author huangchenglong
 * @Date 2020/8/3 17:07
 */
@Data
@TableName(value = "sgu_plan_prod_info")
public class SguPlanProdInfo implements Serializable {

    @TableId(type = IdType.AUTO)
    private Integer id;
    /**
     * 行号
     * */
    @TableField(value = "row_id")
    private Integer rowId;
    /**
     * 上架计划基本信息表ID
     * */
    @TableField(value = "plan_base_id")
    private Integer planBaseId;
    /**
     * SKU编码
     * */
    @TableField(value = "sku_number")
    @Description("SKU编码")
    private String skuNumber;
    /**
     * 平台服务费
     * */
    @TableField(value = "platform_service_fee")
    @Description("平台服务费")
    private BigDecimal platformServiceFee;
    /**
     * 销售价
     * */
    @TableField(value = "sale_price")
    @Description("销售价")
    private BigDecimal salePrice;
    /**
     * 成本价
     * */
    @TableField(value = "prod_price")
    @Description("成本价")
    private BigDecimal prodPrice;
    /**
     * 划线价
     * */
    @TableField(value = "market_price")
    @Description("划线价")
    private BigDecimal marketPrice;
    /**
     * 团长佣金
     * */
    @TableField(value = "commission_amount")
    @Description("团长佣金")
    private BigDecimal commissionAmount;
    /**
     * 分享佣金
     * */
    @TableField(value = "shared_commission_amount")
    @Description("分享佣金")
    private BigDecimal sharedCommissionAmount;
    /**
     * 可售数量
     * */
    @TableField(value = "sellable_stock")
    @Description("可售数量")
    private BigDecimal sellableStock;
    /**
     * 预计发货时间(小时)
     * */
    @TableField(value = "send_hours")
    @Description("预计发货时间")
    private Integer sendHours;
    /**
     * 预计发货时间
     * */
    @TableField(value = "send_date")
    @Description("预计发货时间")
    private String sendDate;
    /**
     * 是否限购
     * */
    @TableField(value = "is_limit")
    @Description("是否限购")
    private Integer isLimit;
    /**
     * 限购数量
     * */
    @TableField(value = "limit_amount")
    @Description("限购数量")
    private Integer limitAmount;
    /**
     * 虚拟销量
     * */
    @TableField(value = "init_sales")
    @Description("虚拟销量")
    private BigDecimal initSales;
    /**
     * 虚拟人数
     * */
    @TableField(value = "bought_people")
    @Description("虚拟人数")
    private Integer boughtPeople;
    /**
     * 售后周期
     * */
    @TableField(value = "after_sale_cycle")
    @Description("售后周期")
    private String afterSaleCycle;
    /**
     * 生产日期
     * */
    @TableField(value = "production_date")
    @Description("生产日期")
    private String productionDate;
    /**
     * 保质期
     * */
    @TableField(value = "guarantee_period")
    @Description("保质期")
    private String guaranteePeriod;
    /**
     * 预计到货时间
     * */
    @TableField(value = "arrival_date")
    @Description("预计到货时间")
    private Date arrivalDate;
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
     * 商品描述
     * */
    @TableField(value = "prod_desc")
    private String prodDesc;
    /**
     * '逻辑删除标记:0-未删除,1-已删除'
     * */
    @TableField(value = "delete_flag")
    private Integer deleteFlag;
    /**
     * prodId
     * */
    @TableField(exist = false)
    private Integer prodId;
    /**
     * 商品名称
     */
    @TableField(exist = false)
    private String prodName;
    /**
     * 商品信息
     */
    @TableField(exist = false)
    Map<String, Object> prodMap;
}
