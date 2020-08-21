let math = require("mathjs");
/**
 * 基础判断
 */
//是否分账
let isSubAccount = v => Number(v.sgu.isSubAccount) === 1;
//城市编辑
let isCityEdit = v => v.baseData.cityEdit;
//是否直购
let isDirect = v =>
  v.sgu.distributionType === v.baseData.distributionMode.direct;
let canEditFunc = v => v.baseData.canEdit;
//审批完成
let processCompleted = v => Number(v.sgu.processStatus) === 3;
//是否代理
let isAgent = v => Number(v.sgu.isAgent) === 1;
//是否包邮品(直购 or 团购包邮)
let isDelivery = v => Number(v.sgu.deliveryType) === 1;
//是否实物库存
let isRealStock = v => v.sgu.saleType == v.baseData.saleMode.realStock;
//是否包邮
let isOnlyPartner = v => v.sgu.onlyPartner == v.baseData.onlyPartnerEnum.yes;
//是否安全库存
let isSaftStock = v => v.sgu.saleType == v.baseData.saleMode.safeStock;
//是否预售
let isAdvance = v => v.sgu.saleType === v.baseData.saleMode.advance;
//是否选品列表
let isProdList = v => v.addProdPage;
// 显示增加库存
let isAddedStock = v => {
  //审批通过 && 预售模式 && (首页直购 或 尾页商城))
  return processCompleted(v) && isAdvance(v);
};
// 显示实物库存
let showRealStock = v => {
  //非直购,非仅团长可见 都可以显示实物库存字段
  return !isDirect(v) && !isOnlyPartner(v);
};
let isNextDayTo = v => Number(v.sgu.isNextDay) === 1;
// **************************************
/**
 * 编辑管控
 */
let editPropMap = new Map();
//销售价
editPropMap.set("salePrice", {
  editValid: v => canEditFunc(v) && !isSubAccount(v)
});
//服务费
editPropMap.set("isSubAccount", {
  showValid: v => isSubAccount(v)
});
//平均价
editPropMap.set("prodPrice", {
  showValid: v => !isSubAccount(v)
});
//佣金比例
editPropMap.set("commissionRate", {
  showValid: v => !processCompleted(v) && isDirect(v)
});
//分享佣金、分享比例
editPropMap.set("isDirect", {
  showValid: v => isDirect(v)
});
//团长实得佣金
editPropMap.set("isAgent", {
  showValid: v => isAgent(v)
});
//虚拟销量、人数
editPropMap.set("initSales", {
  editValid: v => canEditFunc(v) && isAdvance(v)
});
//安全数量,可售库存
editPropMap.set("safeStock", {
  showValid: v => isSaftStock(v),
  editValid: v => !isProdList(v) && processCompleted(v)
});
//预售 - 可售库存
editPropMap.set("sellableStock", {
  showValid: v => isAdvance(v)
});
//能否增减库存
editPropMap.set("isAddedStock", {
  showValid: v => isAddedStock(v)
});
//实物库存 - 可售库存
editPropMap.set("isLimit", {
  showValid: v => isProdList(v) || isDirect(v) || isCityEdit(v)
});
//预售 实物库存
editPropMap.set("stockSellableStock", {
  showValid: v => {
    return showRealStock(v);
  }
})
/**
 * 商品验证
 */
export default {
  methods: {
    isRealStock() {
      return isRealStock(this);
    },
    isSaftStock() {
      return isSaftStock(this);
    },
    isNextDayTo() {
      return isNextDayTo(this);
    },
    isDirectOrCityEdit() {
      return isDirect(this) || isCityEdit(this);
    },
    isDelivery() {
      return isDelivery(this);
    },
    getArrivalDateName() {
      //获取预计到货时间的显示名称
      if (isDelivery(this)) {
        //包邮品
        return "预计发货";
      }
      return "预计到货";
    },


    setSendDate(val, row) {
      if (val) {
        row.sendDate = `${val}小时内发货`;
      } else {
        row.sendDate = "";
      }
    }
  }
};