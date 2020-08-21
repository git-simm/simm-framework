import {
  Loading,
  MessageBox,
  Message
} from "element-ui";
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
  handler
};