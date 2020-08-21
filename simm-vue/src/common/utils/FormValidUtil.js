import {
  Loading,
  MessageBox,
  Message
} from "element-ui";
import moment from "moment";
/**
 * 消息处理
 */
let message = {
  success: (msg, callback) => {
    Message({
      message: msg,
      type: "success"
    });
    if (callback) {
      setTimeout(callback, 1500);
    }
  },
  //提示框
  alert: (msg, type) => {
    if (type == null) {
      type = "info";
    }
    msg = msg.replace("\r\n", "<br/>");
    Message.error({
      customClass: "errorStyle",
      message: msg,
      dangerouslyUseHTMLString: true,
      center: false,
      showClose: true,
      offset: 200,
      duration: 10000,
      effect: "dark"
    });
  },
  confirm: (msg, ok, cancel) => {
    MessageBox.confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
      .then(() => {
        if (ok) {
          ok();
        }
      })
      .catch(() => {
        if (cancel) {
          cancel();
        }
        // }else{
        //   Message({
        //     type: 'info',
        //     message: '取消操作',
        //     duration: 1000,
        //   });
        // }
      });
  },
  loading: function (vue, msg) {
    if (!msg) {
      msg = "正在加载中...";
    }
    const loading = vue.$loading({
      lock: true,
      text: msg,
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.2)"
    });
    return loading;
  }
};
//es5方式，返回布尔值
const isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
};

const throwEx = msg => {
  //兼容两种用法，可以不传递 this指针了
  message.alert(msg, "warning");
  throw new Error(msg);
};
const baseValid = (func, msg) => {
  if (func && func()) {
    throwEx(msg);
  }
};
// 判断字符串
let isArray = isType("Array");
let isEmpty = (val, msg) => {
  baseValid(() => val === "" || val === null || val === undefined, msg);
};
/**
 * 正则枚举
 */
let regexEnum = {
  chinese: /^[\u4E00-\u9FA5]+$/,
  mobile: /^1[3456789]\d{9}$/,
  elevenNumber: /^1\d{10}$/,
  tel: /^(([04]\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/,
  integer: /^[+]{0,1}(\d+)$/,
  twoDecimals: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
  amount: /^[0-9]+(.[0-9]{1,2})?$/,
};
/**
 * 校验手机号
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
let baseRule = (rule, regex, value, callback) => {
  //为空报错
  if (value == null) {
    return callback(new Error(rule.message));
  }
  if (!regex.test(value)) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
/**
 * 校验正整数
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
let checkInt = (rule, value, callback) =>
  baseRule(rule, regexEnum.integer, value, callback);
let isInt = (val, msg) => {
  baseValid(() => val != null && !regexEnum.integer.test(val), msg);
};
/**
 * 校验手机号
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
let checkMobile = (rule, value, callback) =>
  baseRule(rule, regexEnum.mobile, value, callback);
let isMobile = (val, msg) => {
  baseValid(() => val != null && !regexEnum.mobile.test(val), msg);
};

/**
 * 校验11位数
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let checkElevenNumber = (rule, value, callback) =>
  baseRule(rule, regexEnum.elevenNumber, value, callback);
let isElevenNumber = (val, msg) => {
  baseValid(() => val != null && !regexEnum.elevenNumber.test(val), msg);
};

/**
 * 校验中文
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
let checkChinese = (rule, value, callback) => {
  baseRule(rule, regexEnum.chinese, value, callback);
};

let isChinese = (val, msg) => {
  baseValid(() => val != null && !regexEnum.chinese.test(val), msg);
};
/**
 * 表单 校验金额 为数字
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
let checkAmount = (rule, value, callback) =>
  baseRule(rule, regexEnum.amount, value, callback);

/**
 * 验证类
 */
export default {
  message,
  regexEnum,
  throwEx,
  baseValid,
  isEmpty,
  isArray,
  isChinese,
  isMobile,
  isElevenNumber,
  isInt,
  //rule验证
  checkChinese,
  checkMobile,
  checkElevenNumber,
  checkInt,
  checkAmount

};