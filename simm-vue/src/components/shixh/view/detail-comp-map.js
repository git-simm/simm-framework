import sguView from "@/components/sgumanager/sgu-edit";
import prodView from "@/components/prod/prodmanage/view";
import supplyView from "@/components/suplier/detail";
import skuView from "@/components/base/prod/info/view";
import spuView from "@/components/spumanager/spu-edit";
import soView from "@/components/so/detail.vue";
import cmdView from "@/components/base/prod/category/adjust-controls/cmd-detail";
import categoryView from "@/components/base/prod/category/category-view";
import editGrossData from "@/components/base/prod/category/edit-gross-data";
import categoryDetail from "@/components/client/level/category-city-detail";
import billDetail from "@/components/suplier/bill/detail";

// ************* 查看组件注册  **********************

export let compMap = new Map();
compMap.set("cmdView", {
  name: "指令详情",
  getUrl: (param) => `/syscmd/view/${param.id}`,
  comp: cmdView,
});
compMap.set("sguView", {
  name: "SGU详情",
  getUrl: (param) => `/sgumanager/view/${param.id}`,
  comp: sguView,
});
compMap.set("prodView", {
  name: "商品详情",
  getUrl: (param) => `/prod/prodmanage/view/${param.id}`,
  comp: prodView,
});
compMap.set("skuView", {
  name: "SKU详情",
  getUrl: (param) => `/sku/view/${param.number}`,
  comp: skuView,
});
compMap.set("skuViewTab", {
  name: "SKU详情",
  getUrl: (param) => `/sku/viewtab/${param.number}/${param.tab}`,
  comp: skuView,
});
compMap.set("spuView", {
  name: "SPU详情",
  getUrl: (param) => `/spumanager/view/${param.id}`,
  comp: spuView,
});
compMap.set("supplyView", {
  name: "供应商详情",
  getUrl: (param) => `/suplier/detail/${param.id}`,
  comp: supplyView,
});
compMap.set("soView", {
  name: "采购订单详情",
  getUrl: (param) => `/so/detail/${param.id}/${param.flag}`,
  comp: soView,
});
compMap.set("categoryDetail", {
  name: "类目详情",
  getUrl: (param) => `/client/level/grossprofit/detail/${param.id}`,
  comp: categoryDetail,
});
// ************* 新增注册  **********************
compMap.set("onsale", {
  name: "商品上架",
  getUrl: (param) => `/sgumanager/add/${param.prodId}/${param.deliveryType}`,
});

compMap.set("categoryView", {
  name: "类目详情",
  getUrl: (param) => `/category/view/${param.id}`,
  comp: categoryView,
});
compMap.set("billDetail", {
  name: "费用单详情",
  getUrl: (param) => `/bill/view/${param.id}`,
  comp: billDetail,
});

compMap.set("editGrossData", {
  name: "同步数据",
  getUrl: (param) => `/category/editGrossData/${param.id}`,
  comp: editGrossData,
});
