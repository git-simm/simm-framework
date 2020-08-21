let math = require("mathjs");
import moment from "moment";
/**
 * 商品验证
 */
let formatter = "YYYY-MM-DD 00:00:00";
export default {
  methods: {
    arrivalDateChange(val, row) {
      if (val == null || val === "") {
        row.arrivalDate = "";
      } else {
        row.arrivalDate = moment(val).format(formatter);
      }
    },
    /**
     * 不可用的预计到货时间控制
     * @param {*} time 
     */
    disableArrivalDate(time) {
      var getTime = date => {
        return new Date(moment(date).format(formatter)).getTime();
      };
      try {
        if (this.sgu.onSaleTime > '') {
          return time.getTime() < getTime(new Date(this.sgu.onSaleTime));
        }
        return time.getTime() < getTime(new Date());
      } catch (e) {
        return time.getTime() < getTime(new Date());
      }
    },
    /**TODO sgu新增，编辑，复制，打回编辑重新取最新毛利率
     * 计算阈值
     */
    tableRowClassName({ row, rowIndex }) {
      //阈值转样式
      let warning = threshold => {
        if (row.grossProfitRate < 1) {
          return "warn-3";
        } else if (row.grossProfitRate < threshold) {
          return "warn-2";
        }
      };
      return warning(this.sgu.grossProfitRate);

    },
    /**
     * 验证商品信息是否发生改变
     */
    validChange() {
      var self = this;
      //取出table列信息
      // var table = self.$refs.multipleTable;
      // 由于列表部分字段合并cell  故不再取prop属性值
      var props = [
        "grossProfitRate",
        "totalSales",
        "sellableStock",
        "marketPrice",
        "initSales",
        "boughtPeople",
        "arrivalDate",
        "sendHours",
        "productionDate",
        "guaranteePeriod",
        "afterSaleCycle"
      ];
      // table.$children.filter(a => a.prop).map(a => a.prop);
      let notifyChange = () => {
        //商品选品界面(变更只通知一次)
        self.oldProdList = JSON.parse(
          JSON.stringify(self.formData.sguProdInfoList || [])
        );
        return true;
      };
      let rowValid = (old, newObj) => {
        for (var i = 0; i < props.length; i++) {
          var p = props[i];
          if (old[p] != newObj[p]) return true;
        }
        return false;
      };
      if (this.oldProdList.length != this.formData.sguProdInfoList.length)
        return notifyChange();
      //main 行数相等，校验每行的内容是否一致
      for (var i = 0; i < this.oldProdList.length; i++) {
        var old = this.oldProdList[i];
        var obj = this.formData.sguProdInfoList[i];
        if (rowValid(old, obj)) return notifyChange();
      }
      return false;
    },
    /**
     * 计算毛利率
     */
    cellChange(row, prop) {
      //解决精度计算问题
      if (
        prop == "commissionRateShow" ||
        prop == "salePrice" ||
        prop == "commissionChange"
      ) {
        //如果是销售价发生改变，需要同步计算一下团长佣金
        if (prop == "salePrice") {
          this.setCommissionAmount(row, true);
        }
        this.baseData.calcGrossRate(row);
      } else if (prop == "safeStock-sellableStock") {
        if (row.sellableStock > row.safeStock) {
          this.$commonUtil.message.alert("可售库存不能大于安全数量");
          setTimeout(function () {
            row.sellableStock = row.safeStock;
          }, 30);
          return;
        }
      }
    }
  }
};
