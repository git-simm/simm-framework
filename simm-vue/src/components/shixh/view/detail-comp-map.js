import sguView from "@/components/sgumanager/sgu-edit";
import prodView from "@/components/prod/prodmanage/view";

// ************* 查看组件注册  **********************

export let compMap = new Map();
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