/**
 * 同步操作
 */
let fieldWatchs = {};
let fields = [
  "defaultSellableStock",
  "defaultInitSales",
  "defaultBoughtPeople",
  "defaultSalePrice",
  "defaultTotalSales",
  "defaultMarketPrice",
  "defaultCommissionAmount",
  "defaultSharedCommissionAmount",
  "defaultCommissionAmountRate",
  "defaultSharedCommissionRate",
  "defaultAfterSaleCycle",
  "defaultProductionDate",
  "defaultGuaranteePeriod",
  "defaultIsLimit",
  "defaultLimitAmount",
  "defaultProdDesc"
];
export default {
  beforeCreate() {
    //默认字段监听
    fields.forEach(f => {
      fieldWatchs[`formData.${f}`] = (val, oldVal) => {
        this.updateField(val, f);
      };
    });
    fieldWatchs["entity.saleType"] = (val, oldVal) => {
      this.formData.saleType = val;
    };
    fieldWatchs["entity.distributionType"] = (val, oldVal) => {
      this.formData.distributionType = val;
    };
    fieldWatchs["formData.sguProdInfoList"] = (val, oldVal) => {
      this.$emit("change", this.formData.sguProdInfoList);
    };
  },
  watch: fieldWatchs,
  methods: {
    updateField(val, field) {
      if (val === "" || val === null || val === undefined) return;
      if (field == "defaultIsLimit") {
        //defaultIsLimit = 0 是默认值
        this.refreshProdList(field);
        return;
      }
      if (val <= 0) return;
      this.refreshProdList(field);
    },
    /**
     * 刷新商品列表
     */
    refreshProdList(field) {
      //查看模式下，不重新更新商品单价
      if (this.isView) {
        return;
      }
      var self = this;
      let setVal = (sourceVal, targetVal, setter) => {
        if (sourceVal == targetVal) return;
        setter(targetVal);
        // if (sourceVal == null || sourceVal == '' || sourceVal == 0) {
        // }
      };
      (self.formData.sguProdInfoList || []).forEach(prod => {
        switch (field) {
          case "defaultSalePrice":
            setVal(prod.salePrice, self.formData.defaultSalePrice, val => {
              prod.salePrice = val;
            });
            break;
          case "defaultMarketPrice":
            setVal(prod.marketPrice, self.formData.defaultMarketPrice, val => {
              prod.marketPrice = val;
            });
            break;
          case "defaultInitSales":
            setVal(prod.initSales, self.formData.defaultInitSales, val => {
              prod.initSales = val;
              prod.totalSales = val;
            });
            break;
          case "defaultSellableStock":
            setVal(
              prod.sellableStock,
              self.formData.defaultSellableStock,
              val => {
                prod.safeStock = val;
                prod.sellableStock = val;
              }
            );
            break;
          case "defaultCommissionRateShow":
            setVal(
              prod.commissionRateShow,
              self.formData.defaultCommissionRateShow,
              val => {
                prod.commissionRateShow = val;
                //计算佣金
                //self.cellChange(prod, 'commissionRateShow');
              }
            );
            break;

          case "defaultBoughtPeople":
            setVal(
              prod.boughtPeople,
              self.formData.defaultBoughtPeople,
              val => {
                prod.boughtPeople = val;
              }
            );
            break;
          case "defaultCommissionAmountRate":
            setVal(
              prod.commissionRate,
              self.formData.defaultCommissionAmountRate,
              val => {
                self.$set(prod, "commissionRateNew", val);
                prod.commissionAmount = parseFloat(
                  (val * prod.salePrice) / 100
                ).toFixed(2);
                // 计算毛利
                self.cellChange(prod, "commissionRateShow");
              }
            );
            break;
          case "defaultSharedCommissionRate":
            setVal(
              prod.sharedCommissionRate,
              self.formData.defaultSharedCommissionRate,
              val => {
                self.$set(prod, "sharedCommissionAmountRate", val);
                prod.sharedCommissionAmount = parseFloat(
                  (val * prod.salePrice) / 100
                ).toFixed(2);
                // 计算毛利
                self.cellChange(prod, "commissionRateShow");
              }
            );
            break;
          case "defaultCommissionAmount":
            setVal(
              prod.commissionAmount,
              self.formData.defaultCommissionAmount,
              val => {
                prod.commissionAmount = val;
                // 计算毛利
                self.cellChange(prod, "commissionRateShow");
              }
            );
            break;
          case "defaultSharedCommissionAmount":
            setVal(
              prod.sharedCommissionAmount,
              self.formData.defaultSharedCommissionAmount,
              val => {
                prod.sharedCommissionAmount = val;
                // 计算毛利
                self.cellChange(prod, "commissionRateShow");
              }
            );
            break;
          case "defaultAfterSaleCycle":
            setVal(
              prod.afterSaleCycle,
              self.formData.defaultAfterSaleCycle,
              val => {
                prod.afterSaleCycle = val;
              }
            );
            break;
          case "defaultProductionDate":
            setVal(
              prod.productionDate,
              self.formData.defaultProductionDate,
              val => {
                prod.productionDate = val;
              }
            );
            break;
          case "defaultGuaranteePeriod":
            setVal(
              prod.guaranteePeriod,
              self.formData.defaultGuaranteePeriod,
              val => {
                prod.guaranteePeriod = val;
              }
            );
            break;
          case "defaultIsLimit":
            setVal(prod.isLimit, self.formData.defaultIsLimit, val => {
              prod.isLimit = val;
            });
            break;
          case "defaultLimitAmount":
            setVal(prod.limitAmount, self.formData.defaultLimitAmount, val => {
              prod.limitAmount = val;
            });
            break;
          case "defaultProdDesc":
            setVal(prod.prodDesc, self.formData.defaultProdDesc, val => {
              prod.prodDesc = val;
            });
            break;
        }
        //计算佣金
        self.cellChange(prod, "commissionRateShow");
      });
    }
  }
};