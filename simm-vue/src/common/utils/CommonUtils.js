import {
  Loading,
  MessageBox,
  Message
} from "element-ui";
import AuditLogList from "@/components/process/process-list";
import PordSelectList from "@/components/prod/common/prod-list";
import saleInfo from "@/components/so/sale-info";
import deliveryTypeSelector from "@/components/prod/prodmanage/delivery-type-selector";
import SguProdsSettings from "@/components/sgumanager/controls/prods-batch-settings";
import responsePreview from "@/components/shixh/file/sxh-response-preview";
import submitPreview from "@/components/shixh/file/sxh-submit-preview";
import SguOnSaleTimeChange from "@/components/sgumanager/sgu_onSaleTime_change";
import ContractEditor from "@/components/suplier/controls/contract-editor";
import ContractDetail from "@/components/suplier/contract-detail";
import SuplierUploadBail from "@/components/suplier/controls/Suplier_uploadBail";
import layerUtil from "./LayerUtil";
import FormValidUtil from "./FormValidUtil";
import moment from "moment";

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function NewGuid() {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

//应用常量
let appConst = {
  nullNo: "系统自动生成",
  dateFormat: "yyyy/MM/dd",
  timeFormat: "HH:mm:ss",
  dateTimeFormat: "yyyy/MM/dd HH:mm:ss",
  NewGuid,
  //深拷贝
  deepClone(data) {
    if (data == null) return null;
    return JSON.parse(JSON.stringify(data));
  },
};

//es5方式，返回布尔值
const isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
};
// 判断字符串
const isArray = isType("Array");
const throwEx = (msg) => {
  //兼容两种用法，可以不传递 this指针了
  message.alert(msg, "warning");
  throw new Error(msg);
};
const baseValid = (func, msg) => {
  if (func && func()) {
    throwEx(msg);
  }
};
const emptyValid = (val, msg) => {
  baseValid(() => val === "" || val === null || val === undefined, msg);
};
const isChinese = (val, msg) => {
  var reg = /^[\u4E00-\u9FA5]+$/;
  baseValid(() => !reg.test(val), msg);
};
/**
 * 验证类
 */
let valid = {
  throwEx,
  isEmpty: function (str) {
    if (str === null || str === undefined) {
      return true;
    }
    var temp = str + "";
    return temp.trim().length == 0;
  },
  baseValid,
  emptyValid,
  isArray,
  isChinese,
};
/**
 * 计算类
 */
let calc = {
  fixSix: (value) => {
    if (!value) {
      return 0;
    }
    return value.toFixed(6);
  },
  fixThree: (value) => {
    if (!value) {
      return 0;
    }
    return value.toFixed(3);
  },
  fixTwo: (value) => {
    if (!value) {
      return 0;
    }
    return value.toFixed(2);
  },
};
/**
 * 消息处理
 */
let message = FormValidUtil.message;
/**
 * 参数处理
 */
let handler = {
  /**
   * 日期变更
   */
  datechange(value, range, callback) {
    var arr = [null, null];
    let stringdata = () => {
      !!value[0] && (arr[0] = moment(value[0]).format("YYYY-MM-DD HH:mm:ss"));
      !!value[1] && (arr[1] = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"));
      if (arr[0] === "") {
        arr[0] = null;
      }
      if (arr[1] === "") {
        arr[1] = null;
      }
    };
    if (value === "" || value.length == 0) {
      callback(arr, value);
      return arr;
    }
    if (value[0] == null) {
      value = [];
      callback(arr, value);
      return arr;
    }
    //转换一下结构
    stringdata();
    let start = value[0];
    let end = value[1];
    let addstart = new Date();
    addstart.setTime(start.getTime() + 3600 * 1000 * 24 * Number(range));
    if (addstart < end) {
      value = [];
      arr[0] = null;
      arr[1] = null;
      callback(arr, value);
      valid.throwEx(`选择日期范围不能超过${range}天`);
    }
    callback(arr, value);
    return arr;
  },
};
//------------ 原型方法 ------------------
Array.prototype.group = function (callback) {
  var groups = new Map();
  //分组,
  this.forEach((a) => {
    var key = callback(a);
    if (!groups.get(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(a);
  });
  return groups;
};
/**
 * 合计方法
 */
Array.prototype.sum = function (mapper) {
  if (this == null || this.length == 0) return 0;
  return this.map(mapper).reduce((sum, val) => {
    if (sum == null) {
      sum = 0;
    }
    const value = Number(val);
    if (!isNaN(value)) {
      return sum + value;
    } else {
      return sum;
    }
  });
};

// -------- 日期格式化 ----------------------
function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

let format = {
  formatDate,
};
//------- 通用窗体 begin ----------------------
/**
 * 通用窗口信息
 */
let win = {
  /**
   * 显示流程信息
   * @param {*} processName
   * @param {*} bizId
   */
  showProcessList: function (vue, processName, bizId) {
    layerUtil.openWin(vue, {
      title: "流程审批信息",
      area: ["700px", "400px"],
      data: {
        processName: processName,
        refId: bizId,
      },
      component: AuditLogList,
    });
  },

  /**
   * 选择商品(商品池)
   * @param {*} vue
   */
  selectProdInfo: function (vue, filter, callback) {
    layerUtil.openWin(vue, {
      title: "选择商品",
      area: ["1200px", "550px"],
      data: {
        filter: filter,
        callback: callback,
      },
      component: PordSelectList,
    });
  },
  sguProdsBatchSettings: function (vue, filter, callback) {
    layerUtil.openWin(vue, {
      title: "批量设置SGU商品信息",
      area: ["1000px", "400px"],
      data: {
        filter: filter,
        callback: callback,
      },
      component: SguProdsSettings,
    });
  },
  /**
   * 显示销售信息
   * @param {*} processName
   * @param {*} bizId
   */
  showSaleInfoList: function (vue, userId, prodId, orderItemId) {
    layerUtil.openWin(vue, {
      title: "销量信息",
      area: ["500px", "400px"],
      data: {
        userId: userId,
        prodId: prodId,
        orderItemId: orderItemId,
      },
      component: saleInfo,
    });
  },
  /**
   * 团购商品上架选择配送方式
   * @param vue
   * @param prodId
   * @param prodNumber
   * @param deliveryType
   */
  selectDeliveryType: function (vue, prodId, prodNumber, deliveryType) {
    layerUtil.openWin(vue, {
      title: "请选择上架SGU配送方式",
      area: ["500px", "180px"],
      data: {
        prodId: prodId,
        prodNumber: prodNumber,
        deliveryType: deliveryType,
      },
      component: deliveryTypeSelector,
    });
  },
  /**
   * 修改上下架时间
   * @param vue
   * @param filter
   * @param callback
   * @param
   */
  changeOnSaleTime: function (vue, filter, callback) {
    layerUtil.openWin(vue, {
      title: "请选择上下架时间",
      area: ["500px", "300px"],
      data: {
        filter: filter,
        callback: callback
      },
      component: SguOnSaleTimeChange,
    });
  },

  contractDetail: function (vue, supplyInfo, openModel, callback) {
    layerUtil.openWin(vue, {
      title: "续签合同信息",
      area: ["900px", "600px"],
      data: {
        supplyInfo: supplyInfo,
        viewModel: openModel,
        callback: callback
      },
      component: ContractDetail,
    });
  },

  contractExtension: function (vue, supplyInfo, callback) {
    layerUtil.openWin(vue, {
      title: "编辑合同信息",
      area: ["800px", "600px"],
      data: {
        supplyInfo: supplyInfo,
        callback: callback
      },
      component: ContractEditor,
    });
  },

  /**
   * 响应内容显示
   * @param {*} vue
   * @param {*} param
   * @param {*} callback
   */
  response: function (vue, param, callback) {
    var defaultArea = ["600px", "300px"];
    if (param.type === "list") {
      defaultArea = ["700px", "600px"];
    } else if (param.type === "sgu") {
      defaultArea = ["500px", "150px"];
    }
    layerUtil.openWin(vue, {
      title: param.title || "结果",
      area: param.area || defaultArea,
      desc: param.desc || null,
      data: {
        param: param,
        callback: callback,
      },
      component: responsePreview,
    });
  },

  preSubmit: function (vue, param, callback) {
    var defaultArea = ["600px", "300px"];
    if (param.type === "list") {
      defaultArea = ["700px", "600px"];
    }
    layerUtil.openWin(vue, {
      title: param.title || "结果",
      area: param.area || defaultArea,
      data: {
        param: param,
        callback: callback,
      },
      component: submitPreview,
    });
  },
  /**
   * 上传保证金凭证
   * @param vue
   * @param filter
   * @param callback
   * @param
   */
  uploadBailEvidence: function (vue, filter, callback) {
    layerUtil.openWin(vue, {
      title: "",
      area: ["500px", "500px"],
      data: {
        filter: filter,
        callback: callback
      },
      component: SuplierUploadBail,
    });
  },

};
//------- 通用窗体 end ----------------------
function retry(valid, caller, interval, count) {
  if (count == 0) return;
  setTimeout(() => {
    if (valid()) {
      caller();
    } else {
      count--;
      retry(valid, caller, interval, count);
    }
  }, interval);
}
//---------------------------------------
export default {
  appConst,
  format,
  deepClone: appConst.deepClone,
  valid,
  formValid: FormValidUtil,
  calc,
  retry,
  message,
  handler,
  win,
};