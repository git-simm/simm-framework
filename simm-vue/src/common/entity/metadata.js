import sguExport from "./sgu-export";
import sguProdExport from "./sgu-prod-export";
import spuExport from "./spu-export";
import skuExport from "./sku-export";
import skuAllColExport from "./sku-all-export";
import sguFailExport from "./sgu-fail-export";
import supplySubAccOperaLogs from "./supply_subacc_opera_logs";
import clientLevel from "./clientLevel-export";
import sguChangeAll from "./sgu_changeAll";
import cmdDetailExport from "./cmd-detail-export";
import categoryCityExport from "./category-city-export";
import categoryExport from "./category-detail-export";
import soProdExport from "./so-prod-export";
import billInfoExport from "./bill-info-export";

/**
 * 属性转数组
 * @param {*} attrs
 */
let attrToArray = function (attrs) {
  var arr = [];
  for (var p in attrs) {
    attrs[p].prop = p;
    arr.push(attrs[p]);
  }
  return arr;
};

/**
 * 属性转数组
 * @param {*} attrs
 */
let objToMap = function (attrs) {
  var strmap = new Map();
  for (var p in attrs) {
    attrs[p].prop = p;
    strmap.set(p, attrs[p]);
  }
  return strmap;
};
/**
 * sgu导出
 */
export default {
  //属性转数组
  attrToArray,
  //对象转map集合
  objToMap,
  //sgu导出
  sguExport,
  //同步失败的SGU导出
  sguFailExport,
  //SGU商品模式导出
  sguProdExport,
  //spu导入
  spuExport,
  //sku部分字段导出
  skuExport,
  //sku全字段导出
  skuAllColExport,
  //城市列表导出
  clientLevel,
  //sgu批量上下架列表
  sguChangeAll,
  //指令详情导出
  cmdDetailExport,
  // 批量生成交行子账户异常数据
  supplySubAccOperaLogs,
  //城市类目列表导出
  categoryCityExport,
  //类目更改毛利率详情导出
  categoryExport,
  //订单商品维度导出
  soProdExport,
  //费用单导出
  billInfoExport
};
