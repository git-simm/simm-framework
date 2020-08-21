//--------------------------------------------------
/**
 * 字典项全局配置化
 */
let vue = {};
let VUE_STORE = {};
let dic = new Map();
// TODO 商品类目
dic.set("goodsCategoryI", [
  { key: 1, value: "水果绿植" },
  { key: 2, value: "肉禽水产" },
  { key: 3, value: "速冻食品" },
  { key: 4, value: "粮油干调" },
  { key: 5, value: "酒水冲饮" },
  { key: 6, value: "乳品日配" },
  { key: 7, value: "休闲食品" },
  { key: 8, value: "美妆个清" },
  { key: 9, value: "服饰家纺" },
  { key: 10, value: "家居百货" },
  { key: 11, value: "数码家电" },
  { key: 12, value: "生活服务" }
]);

//对账状态
dic.set("check_sheet_status", [
  { key: 0, value: "未对账" },
  { key: 1, value: "已对账" }
]);

//结算状态
dic.set("settle_status", [
  { key: 0, value: "未结算" },
  { key: 1, value: "已结算" }
]);

//支付类型
dic.set("account_type", [
  { key: 1, value: "银行" },
  { key: 2, value: "微信" },
  { key: 3, value: "支付宝" }
]);

//单据类型
dic.set("from_type", [
  { key: 1, value: "大品订单" },
  { key: 2, value: "大品退款单" }
]);

//请选择通道
dic.set("passageway", [
  { key: 1, value: "无票通道" },
  { key: 2, value: "有票通道" }
]);

//账号类型
dic.set("request_type", [
  { key: 1, value: "微信用户" },
  { key: 2, value: "供应商用户" }
]);
//打款状态
dic.set("request_status", [
  { key: 0, value: "未打款" },
  { key: 1, value: "已打款" },
  { key: 2, value: "打款中" },
  { key: 3, value: "打款失败" },
  { key: -1, value: "拒付" },
  { key: -2, value: "已取消" }
]);
//提现单状态
dic.set("cash_order_status", [
  { key: 0, value: "作废" },
  { key: 1, value: "审核中" },
  { key: 2, value: "已打款" }
]);

//退款类型
dic.set("return_type", [
  { key: 1, value: "取消订单" },
  { key: 2, value: "缺货退款" },
  { key: 3, value: "采购退货" },
  { key: 4, value: "收货数量有误" },
  { key: 5, value: "分装损耗" }
]);
//提现单状态
dic.set("cash_order_status", [
  { key: 0, value: "作废" },
  { key: 1, value: "审核中" },
  { key: 2, value: "已打款" }
]);

//打款审核状态 src\components\audit\paymentform\list.vue
dic.set("paymentform_status", [
  { key: 0, value: "已提交" },
  { key: 1, value: "已审核" },
  { key: 2, value: "打款成功" },
  { key: 3, value: "打款处理中" },
  { key: 4, value: "打款失败" },
  { key: -1, value: "审核不通过" }
]);

//状态 src\components\audit\settle\redflush\list.vue
dic.set("status", [
  { key: 0, value: "未审核" },
  { key: 1, value: "已审核" },
  { key: -1, value: "审核失败" }
]);

//状态 src\components\base\prod\category\list.vue
dic.set("category_status", [
  { key: 0, value: "禁用" },
  { key: 1, value: "启用" }
]);
//账号状态 src\components\client\clientmanage\add.vue
dic.set("client_status", [
  { key: 0, value: "未启用" },
  { key: 1, value: "启用" },
  { key: 2, value: "过期" },
  { key: 3, value: "禁用" }
]);

//开通授信
dic.set("credit_status", [
  { key: 0, value: "否" },
  { key: 1, value: "是" }
]);

//wms推送状态
dic.set("push_status", [
  { key: 0, value: "初始" },
  { key: 1, value: "下推成功" },
  { key: 2, value: "操作成功" },
  { key: -1, value: "操作失败或者删除" }
]);

//审核状态 src\components\erp\assemble\confirmlist.vue
dic.set("assemble_audit_status", [
  { key: 0, value: "未审核" },
  { key: 1, value: "已审核" },
  { key: 2, value: "已取消" }
]);

//商品类型
dic.set("prod_type", [
  { key: 0, value: "普通产品" },
  { key: 1, value: "运费" },
  { key: 2, value: "分装子码" },
  { key: 3, value: "组装编码" }
]);

//审核状态 src\components\erp\orderitem\add.vue
dic.set("orderitem_audit_status", [
  { key: 0, value: "待仓库确认" },
  { key: 1, value: "已确认" },
  { key: 2, value: "已取消" }
]);
//单据类型
dic.set("to_type", [
  { key: 1, value: "盘盈" },
  { key: 2, value: "盘亏" },
  { key: 3, value: "报损出库" },
  { key: 4, value: "报溢入库" }
]);

//状态 src\components\erp\prod\changelist.vue
dic.set("changelist_status", [
  { key: 0, value: "初始" },
  { key: 1, value: "提交" },
  { key: 2, value: "完成" },
  { key: -1, value: "已作废" }
]);

//类型
dic.set("date_type", [
  { key: "01", value: "采购入库" },
  { key: "02", value: "销售退货" },
  { key: "03", value: "调拨入库" },
  { key: "04", value: "盘盈入库" },
  { key: "05", value: "报溢入库" },
  { key: "06", value: "其他入库" },
  { key: "07", value: "拆分入库" },
  { key: "08", value: "组合入库" }
]);

//核销状态 src\components\erp\prod\inventoryoutlist.vue
dic.set("status", [
  { key: 1, value: "正常状态" },
  { key: 2, value: "已经核销完" }
]);

//食享会订单数据
dic.set("import_status", [
  { key: 0, value: "未获取" },
  { key: 1, value: "获取中" },
  { key: 2, value: "获取完成" }
]);

//占用状态
dic.set("use_status", [
  { key: 0, value: "预占用" },
  { key: 1, value: "已确认占用" },
  { key: 2, value: "取消占用" }
]);

//收货地址状态
dic.set("address_status", [
  { key: 0, value: "不可用" },
  { key: 1, value: "可用" }
]);

//订单类型
dic.set("so_type", [
  { key: 1, value: "食享会销售订单" },
  { key: 2, value: "食享会退货订单" }
]);

//是否发货
dic.set("send_status", [
  { key: 0, value: "否" },
  { key: 1, value: "是" },
  { key: -1, value: "发货异常" }
]);

//售后状态
dic.set("after_status", [
  { key: 0, value: "待确认" },
  { key: 1, value: "已收货" },
  { key: 2, value: "取消" }
]);

//出库状态 src\components\erp\transfers\view.vue
dic.set("out_status", [
  { key: 0, value: "初始" },
  { key: 1, value: "提交" },
  { key: 2, value: "完成" }
]);

//入库状态 src\components\erp\transfers\view.vue
dic.set("in_status", [
  { key: 0, value: "初始" },
  { key: 1, value: "提交" },
  { key: 2, value: "完成" }
]);

//出库审核状态 src\components\erp\transfers\view.vue
dic.set("transfers_audit_status", [
  { key: 0, value: "未审核" },
  { key: 1, value: "审核通过" },
  { key: -1, value: "审核不通过" }
]);

//入库审核状态 src\components\erp\transfers\view.vue
dic.set("to_audit_status", [
  { key: 0, value: "未审核" },
  { key: 1, value: "审核通过" },
  { key: 2, value: "审核不通过" }
]);

//仓库类型
dic.set("store_type", [
  { key: 0, value: "临时库" },
  { key: 1, value: "erp库" },
  { key: 2, value: "正常库" }
]);

//状态 src\components\erp\wareHouse\list.vue
dic.set("wareHouse_status", [
  { key: 0, value: "未开启" },
  { key: 1, value: "开启" }
]);

//盘点类型
dic.set("check_type", [
  { key: 1, value: "盘盈（加库存）" },
  { key: 2, value: "盘亏（减库存）" }
]);

//变化类型
dic.set("inventory_turnover_type", [
  { key: 1, value: "（城市）订购数量" },
  { key: 2, value: "（城市）退换数量" },
  { key: 3, value: "（城市）已卖数量" },
  { key: 4, value: "（团长）退换数量" },
  { key: 5, value: "（内部）销售调拨" },
  { key: 6, value: "（内部）采购调拨" },
  { key: 7, value: "（内部）加工出库" },
  { key: 8, value: "（内部）加工入库" },
  { key: 9, value: "（内部）组装出库" },
  { key: 10, value: "（内部）组装入库" },
  { key: 11, value: "（内部）盘亏" },
  { key: 12, value: "（内部）盘盈" }
]);

//促销类型
dic.set("activityType", [
  { key: "BUY_FREE", value: "买赠" },
  { key: "EACH_BUY_FREE", value: "每买赠" }
]);

//退款类型/售后类型
dic.set("apply_type", [
  { key: 3, value: "采购退货" },
  { key: 4, value: "收货数量有误" },
  { key: 5, value: "分装损耗" }
]);

//状态  src\components\procurement\list.vue
dic.set("statusData", [
  { key: 0, value: "待审核" },
  { key: 1, value: "审核通过" },
  { key: 2, value: "已完成" },
  { key: -1, value: "审核不通过" }
]);

//订单状态  src\components\procurement\view.vue
dic.set("so_status", [
  { key: 1, value: "待审核" },
  { key: 2, value: "待收货" },
  { key: 4, value: "已完成" },
  { key: -1, value: "已取消" }
]);

//售后状态  src\components\procurement\view.vue
dic.set("return_status", [
  { key: 0, value: "待审核" },
  { key: 1, value: "审核通过" },
  { key: 2, value: "已完成" },
  { key: 3, value: "已取消" },
  { key: -1, value: "审核不通过" }
]);

//状态 src\components\prod\process\planlist.vue
dic.set("process_status", [
  { key: 1, value: "未申请" },
  { key: 2, value: "待仓库确认" },
  { key: 3, value: "已确认" },
  { key: -1, value: "已取消" }
]);

//审核状态 src\components\prod\process\processlist.vue
dic.set("process_audit_status", [
  { key: 0, value: "未审核" },
  { key: 1, value: "已审核" },
  { key: 2, value: "已取消" }
]);

//商品状态
dic.set("is_onsale", [
  { key: "", value: "全部" },
  { key: "1", value: "上架" },
  { key: "0", value: "下架" }
]);

//类型  src\components\prod\prodstorage\list.vue
dic.set("inout_type", [
  { key: 1, value: "采购入库" },
  { key: 2, value: "销售出库" },
  { key: 3, value: "采购退回" }
]);

//状态  src\components\prod\prodstorage\list.vue
dic.set("order_type", [
  { key: 1, value: "已入库" },
  { key: 2, value: "已出库" }
]);

//客户类型
dic.set("user_type", [
  { key: 1, value: "KA卖场客户" },
  { key: 2, value: "批发客户" },
  { key: 3, value: "微商客户" }
]);

//账号状态
dic.set("account_status", [
  { key: 0, value: "未启用" },
  { key: 1, value: "启用" },
  { key: 2, value: "过期" },
  { key: 3, value: "禁用" }
]);

//账号类型
dic.set("is_supply_user", [
  { key: 0, value: "普通订货账号" },
  { key: 1, value: "供应商订货账号" }
]);

//支付方式 src\components\purchase\big\add.vue
dic.set("pay_type", [
  { key: "1", value: "立即支付" },
  { key: "3", value: "授信支付" }
]);

//订单状态  src\components\purchase\big\list.vue
dic.set("statusData", [
  { key: 1, value: "待付款" },
  { key: 2, value: "待收货" },
  { key: 3, value: "已完成" },
  { key: 4, value: "已取消" }
]);

//是否付款  src\components\purchase\big\list.vue
dic.set("pay_status", [
  { key: 1, value: "未支付" },
  { key: 2, value: "已支付" }
]);

//支付方式  src\components\purchase\big\list.vue
dic.set("pay_type", [
  { key: 1, value: "下单即付" },
  { key: 2, value: "货到付款" },
  { key: 3, value: "授信付款" },
  { key: 4, value: "账期付款" },
  { key: 5, value: "果坊结算" }
]);

//选择在线支付方式
dic.set("payment_type", [
  { key: 1, value: "微信" },
  { key: 2, value: "支付宝" }
]);

//角色类型
dic.set("admin_role_type", [
  { key: "1", value: "平台级可授角色" },
  { key: "2", value: "区域可授角色" },
  { key: "3", value: "省级可授角色" }
]);

//状态 src\components\settle\redflush\list.vue
dic.set("redflush_status", [
  { key: "0", value: "未审核" },
  { key: "1", value: "已审核" },
  { key: "-1", value: "审核失败" }
]);

//处理人 src\components\settle\redflush\view.vue
dic.set("config_condition", [
  { key: "JS002", value: "区域负责人" },
  { key: "zxfzjl", value: "中心副总经理" },
  { key: "zxzjl", value: "中心总经理" },
  { key: "JS007", value: "财务审核" }
]);

//税务身份
dic.set("tax_identity", [
  { key: 1, value: "合作社" },
  { key: 2, value: "个体工商户" },
  { key: 3, value: "小规模纳税人" },
  { key: 4, value: "一般纳税人" }
]);

//打款状态 src\components\settleflow\view.vue
dic.set("request_status", [
  { key: 0, value: "未打款" },
  { key: 1, value: "打款成功" },
  { key: 2, value: "打款中" },
  { key: 3, value: "打款失败" },
  { key: 4, value: "待审核" },
  { key: -1, value: "拒付" },
  { key: -2, value: "已取消" }
]);

//是否申请预付款单
dic.set("purchase_status", [
  { key: "0", value: "否" },
  { key: "1", value: "是" }
]);

//是否赠品
dic.set("is_gift_prod", [
  { key: "0", value: "否" },
  { key: "1", value: "是" }
]);

//售后信息 src\components\so\auditlist.vue
dic.set("return_status", [
  { key: "0", value: "无售后" },
  { key: "1", value: "已售后" },
  { key: "2", value: "申请售后" }
]);

//订单类型 src\components\so\detail.vue
dic.set("so_type", [
  { key: 1, value: "普通订单" },
  { key: 2, value: "补发订单" },
  { key: 3, value: "代理计划单" },
  { key: 4, value: "代理订单" },
  { key: 5, value: "大品订单" },
  { key: 6, value: "大品转单" }
]);

//售后状态 src\components\so\records.vue
dic.set("records_status", [
  { key: 0, value: "待审核" },
  { key: 1, value: "待确认" },
  { key: 2, value: "已完成" },
  { key: 3, value: "已取消" },
  { key: -1, value: "审核不通过" }
]);

//状态 src\components\so\records.vue
dic.set("apply_status", [
  { key: 0, value: "待审核" },
  { key: 1, value: "待确认" },
  { key: 2, value: "已完成" },
  { key: -1, value: "审核不通过" }
]);

//售后状态 src\components\so\records.vue
dic.set("return_records_status", [
  { key: 1, value: "待审核" },
  { key: 2, value: "待确认" },
  { key: 3, value: "已取消" }
]);

//订单状态  src\components\so\report.vue
dic.set("so_status", [
  { key: 1, value: "已提交" },
  { key: 2, value: "已审核" },
  { key: 3, value: "已出库" },
  { key: 4, value: "已完成" },
  { key: -1, value: "已取消" }
]);

//订单状态  src\components\so\review.vue
dic.set("review_status", [
  { key: 0, value: "待付款" },
  { key: 1, value: "待审核" },
  { key: 2, value: "待发货" },
  { key: 3, value: "待收货" },
  { key: 4, value: "已完成" },
  { key: -1, value: "已取消" }
]);

//是否有此商品
dic.set("isHave", [
  { key: "0", value: "无" },
  { key: "1", value: "有" }
]);

//储藏温度
dic.set("storedEnvironment", [
  { key: 1, value: "常温" },
  { key: 2, value: "冷藏" },
  { key: 3, value: "冷冻" }
]);

//订单状态 src\components\stockroom\list.vue
dic.set("stockroom_status", [
  { key: 1, value: "待审核" },
  { key: 2, value: "已完成" },
  { key: 3, value: "已取消" },
  { key: 4, value: "退款中" }
]);

//售后类型
dic.set("user_after_sale_type", [
  { key: 1, value: "发错货" },
  { key: 2, value: "质量问题" },
  { key: 3, value: "商品少件/破损" }
]);
//审核状态
dic.set("supply_audit_status", [
  { key: 2, value: "编辑中" },
  { key: 0, value: "待审核" },
  { key: 1, value: "审核通过" },
  { key: -1, value: "审核不通过" }
]);
//移库原因
dic.set("transfer_reason", [
  { key: 1, value: "采购待退货" },
  { key: 2, value: "退货入库待分拣" },
  { key: 3, value: "质量问题" },
  { key: 4, value: "待报损" },
  { key: 5, value: "待换货" },
  { key: 6, value: "错误操作" }
]);

//调拨单据状态
dic.set("erp_move_status", [
  { key: 0, value: "初始状态" },
  { key: 1, value: "待出库" },
  { key: 2, value: "待入库" },
  { key: 3, value: "已完成" },
  { key: -1, value: "作废" }
]);
//分账类型
dic.set("sub_account_type", [
  { key: 0, value: "不分帐" },
  { key: 1, value: "供应商分账" },
  { key: 2, value: "商品分帐" }
]);
//采购订单类型
dic.set("purchase_so_type", [
  { key: 1, value: "普通订单" },
  { key: 2, value: "补发订单" },
  { key: 3, value: "代理计划单" },
  { key: 4, value: "代理订单" },
  { key: 5, value: "大品订单" },
  { key: 6, value: "大品转单" },
  { key: 7, value: "共享订单" }
]);
//--------------------------------------------------
/**
 * 获取配置项统一方法
 */
function getDic(key) {
  let userInfo = vue.$store.state.userInfo;
  let dic = userInfo.dic;
  return dic.get(key);
}
/**
 * 获取配置项的拷贝对象
 */
function getDicClone(key) {
  let userInfo = vue.$store.state.userInfo;
  let dic = userInfo.dic;
  return JSON.parse(JSON.stringify(dic.get(key)));
}
/**
 * 获取具体的值
 * @param {*} dicKey
 * @param {*} key
 * @param {*} defaultVal 默认值
 */
function getVal(dicKey, key, defaultVal = null) {
  var list = getDic(dicKey);
  if (list == null || list.length == 0) {
    if (defaultVal == null) return key;
    return defaultVal;
  }
  var item = list.find(a => a.key == key);
  if (item == null) {
    if (defaultVal == null) return key;
    return defaultVal;
  }
  return item.value;
}

function setVueStore(vueInstance) {
  vue = vueInstance;
  VUE_STORE = vue.$store;
}

function appendDic(map) {
  for (let [k, v] of map) {
    // if (!dic.has(k)) {
    dic.set(k, v)
    // }
  }
  return dic;
}


export default {
  dic,
  getDic,
  getDicClone,
  getVal,
  setVueStore,
  appendDic
};
