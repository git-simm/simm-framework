import sguExport from "./sgu-export";
import spuExport from "./spu-export";

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
  //spu导入
  spuExport
};