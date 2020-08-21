let math = require("mathjs");
import {
  CategoryApi
} from '@/common/api/CategoryApi';
export default {
  methods: {
    /**
     * 获取城市商品实物库存信息
     */
    getRealStock(formData, baseData, callback) {
      var self = this;
      var cityId = baseData.userInfo.cityId;
      if (formData.id != null) {
        cityId = formData.addressCityId;
      }
      if (cityId == null) return;
      //获取各城市下商品信息的实物库存
      if (formData.saleType == 1) return;
      var params = {
        searchStoreSguInfoDtoList: []
      };
      (formData.sguProdInfoList || []).forEach(prod => {
        params.searchStoreSguInfoDtoList.push({
          sguId: -1,
          cityId: cityId,
          prodNumber: prod.skuNumber,
          supplyNumber: formData.supplyNumber
        });
      });
      if (params.searchStoreSguInfoDtoList.length === 0) {
        return;
      }
      this.$httpUtil.post({
        url: "/sguBaseInfo/querySguRealStock.json",
        data: params,
        succ: function (data) {
          var stocks = data.data.storeSguProdInfoList || [];
          let setVal = prod => {
            var stock = (stocks || []).find(
              a =>
              a.prodNumber == prod.skuNumber &&
              a.supplyNumber == formData.supplyNumber
            );
            if (stock && formData.saleType != 0) {
              self.$set(prod, "stockSellableStock", stock.sellableStock);
              prod.sellableStock = stock.sellableStock;
              prod.totalSales = stock.totalSales;
              prod.initSales = stock.initSales;
              prod.boughtPeople = stock.boughtPeople;
            } else if (stock && formData.saleType == 0) {
              self.$set(prod, "stockSellableStock", stock.sellableStock);
            }
          };
          (formData.sguProdInfoList || []).forEach(prod => setVal(prod));
          //直购或城市审核通过后的数据赋值
          ((formData.direct || {}).sguProdInfoList || []).forEach(prod => setVal(prod));
          if (callback) {
            callback(stocks);
          }
        }
      });
    },
    /**
     * 获取毛利配置信息
     */
    getDicConfig() {
      var self = this;
      this.$httpUtil.post({
        url: "/dictionary/queryByClassCodes.json",
        contentType: "form",
        loading: false,
        data: {
          codes: ["gross_threshold", "slb_fee_rate", "only_partner_sign", "sgu_exchange_switch"]
        },
        succ: function (data) {
          //毛利率
          var grossConfig = (data.data || []).find(item => item.classCode == "gross_threshold");
          if (grossConfig) {
            self.baseData.grossThresholdConfig = eval(grossConfig.remark);
          }
          //顺利办手续费
          var slbProfitConfig = (data.data || []).find(item => item.classCode == "slb_fee_rate");
          if (slbProfitConfig) {
            self.baseData.slbProfit = parseFloat(slbProfitConfig.itemName);
          }
          //仅团长可见
          var onlyPartnerSign = (data.data || []).find(item => item.classCode == "only_partner_sign");
          if (onlyPartnerSign) {
            self.baseData.onlyPartnerSign = onlyPartnerSign.itemName;
          }
          var sguExchangeSwitch = (data.data || []).find(item => item.classCode == "sgu_exchange_switch");
          if (sguExchangeSwitch) {
            self.baseData.sguExchangeSwitch = sguExchangeSwitch.itemName;
          }
        }
      });
    },
    /**
     * 获取当前用户对应的城市信息
     */
    getCurrentCityInfo(callback) {
      var self = this;
      var userInfo = this.baseData.userInfo;
      //非城市账号推品不管
      if (userInfo.roleType !== 2) {
        if (callback) {
          callback();
        }
        return;
      }
      var cityId = userInfo.cityId;
      this.$httpUtil.post({
        url: "/supplyUserLevel/getlist.json",
        contentType: "form",
        loading: false,
        data: {
          admin_shop_id: cityId
        },
        succ: function (data) {
          if ((data.data || []).length > 0) {
            var city = data.data[0];
            self.baseData.cityCommissionRatio = city.commissionRatio;
            self.$set(self.baseData, "cityIsDiff", city.isDiff);
          }
          if (callback) {
            callback();
          }
        }
      });
    },
    /**
     * 获取商品对应的移动平均价
     * @param {*} prod
     */
    getStockAvgPrice(prod) {
      //分账商品不取移动平均价
      if (this.entity.isSubAccount === 1) return;
      if (
        this.entity.distributionType == this.baseData.distributionMode.store
      ) {
        //商城则从仓配获取所有的实物库存移动平均价
        this.$httpUtil.post({
          url: "/sguBaseInfo/getErpProdStock.json",
          data: {
            supplyNumber: this.entity.supplyNumber,
            prodNumber: prod.prod_number
          },
          loading: false,
          succ: function (data) {
            if ((data.data || []).length > 0) {
              //移动平均价数据合并(方案：有则取，无则保留商品成本价)
              (data.data || []).forEach(stock => {
                if (!stock.adminShopId) return;
                var cityPrice = {
                  admin_shop_id: stock.adminShopId,
                  prod_price: stock.cost_price,
                  prod_id: prod.id
                };
                //查询商品中是否包含该城市价
                var prodPrice = prod.produserlevelprice.find(
                  a =>
                  a.prod_id == cityPrice.prod_id &&
                  a.admin_shop_id == cityPrice.admin_shop_id
                );
                if (prodPrice != null) {
                  prodPrice.prod_price = cityPrice.prod_price;
                } else {
                  prod.produserlevelprice.push(cityPrice);
                }
              });
            }
          }
        });
      }
    },
    /**
     * 获取商品信息
     */
    getProInfo: function (prodInfo, callback) {
      var self = this;
      self.$httpUtil.post({
        url: "/prodInfo/view.json",
        contentType: "form",
        loading: false,
        data: {
          id: prodInfo.id
        },
        succ: function (data) {
          var mainData = data.data || {};
          var prod = mainData.prodInfo || {};
          prodInfo.produserlevelprice = mainData.produserlevelprice || [];
          //获取移动平均价
          self.getStockAvgPrice(prodInfo);
          //判断商品的归属，如果是直购或城市，则直接取最新审核通过的价格
          prodInfo.isPayByBalance = 0;
          if (
            (prod.creator_role == 2 || prod.creator_role == 3) &&
            prodInfo.produserlevelprice.length > 0
          ) {
            var city = prodInfo.produserlevelprice[0];
            prodInfo.sub_account_prod_price = city.sub_account_prod_price;
            prodInfo.sub_account_proportion = city.sub_account_proportion;
            prodInfo.platform_service_fee = city.platform_service_fee;
            prodInfo.sub_account_cost_price = city.sub_account_cost_price;
            //添加商品，余额支付属性取城市最新属性
            if (prod.creator_role == 2) {
              prodInfo.isPayByBalance = prod.isPayByBalance;
              if (city.is_pay_by_balance === 0) {
                prodInfo.isPayByBalance = 0;
              }
            }
          } else {
            prodInfo.sub_account_prod_price = prod.sub_account_prod_price;
            prodInfo.sub_account_proportion = prod.sub_account_proportion;
            prodInfo.platform_service_fee = prod.platform_service_fee;
            prodInfo.sub_account_cost_price = prod.sub_account_cost_price || prod.prod_price;
          }
          if (callback) {
            callback(prodInfo);
          }
        }
      });
    },
    /**
     * 获取最新毛利率
     */
    getGrossProfitRate(spuId, callback) {
      var self = this;
      let categoryApi = new CategoryApi(this);
      categoryApi.getThreeCategory(spuId, category => {
        if (self.baseData.userInfo.roleType == 2 && self.baseData.userInfo.isAgent == 0) {
          //城市取城市三级类目最新的毛利率
          categoryApi.getCategoryCity(category.id, self.baseData.userInfo.cityId, cityCategory => {
            if (cityCategory.grossProfitRate) {
              if (callback) {
                callback(cityCategory.grossProfitRate);
              }
            } else {
              if (callback) {
                callback(category.grossProfitRate);
              }
            }
          })
        } else {
          //总部，省级(取三级类目最新毛利率)
          if (callback) {
            callback(category.grossProfitRate);
          }
        }
      });
    },
    /**
     * 同步最新的销售价
     */
    syncSalePrice() {
      var self = this;
      //先修改商品列表数据
      (this.entity.sguProdInfoList || []).forEach(prod => {
        //没有售价信息则直接退出
        if ((prod.purchaseCityList || []).length == 0) return;
        //直购或城市的数据
        if (self.baseData.userInfo.roleType > 1) {
          //商品数据归属为直购或城市，那么需要同步更新商品列表上的销售价
          //备注：直购供应商->直购平台上架->直购商品全国统一价
          //如果是直购上架，取全国这个城市
          var cityPrice;
          if (self.entity.distributionType == 1) {
            // 直购
            cityPrice = prod.purchaseCityList.find(a => a.admin_shop_id == 1);
          } else if (self.baseData.cityEdit) {
            // 城市上架
            cityPrice = prod.purchaseCityList.find(
              a => a.admin_shop_id == self.baseData.userInfo.cityId
            );
          }
          if (!cityPrice) {
            cityPrice = prod.purchaseCityList[0];
          }
          prod.salePrice = cityPrice.sub_account_prod_price;
          prod.prodPrice = cityPrice.sub_account_cost_price;
          prod.subAccountProportion = cityPrice.sub_account_proportion;
          prod.platformServiceFee = cityPrice.platform_service_fee;

          self.calcGrossRate(prod);
          //同步城市列表数据
          (prod.sguProdSaleScopes || []).forEach(scope => {
            scope.salePrice = cityPrice.sub_account_prod_price;
            scope.subAccountProportion = cityPrice.sub_account_proportion;
            scope.prodPrice = cityPrice.sub_account_cost_price;
            scope.platformServiceFee = cityPrice.platform_service_fee;
            self.calcGrossRate(scope);
          });
        } else {
          //团购状态下的同步方法(遍历SGU所包含的城市列表,取商品在城市中的最新销售价)
          (prod.sguProdSaleScopes || []).forEach(scope => {
            var cityPrice = prod.purchaseCityList.find(
              c => c.admin_shop_id == scope.addressCityId
            );
            if (cityPrice) {
              scope.salePrice = cityPrice.sub_account_prod_price;
              scope.subAccountProportion = cityPrice.sub_account_proportion;
              scope.prodPrice = cityPrice.sub_account_cost_price;
              scope.platformServiceFee = cityPrice.platform_service_fee;
              self.calcGrossRate(scope);
            }
          });
        }
      });
      this.success("同步完成");
    },
    //---------- 城市上架信息 begin -----------
    /**
     * 获取上架城市信息
     * @param {*} prodIds
     * @param {*} callback
     */
    getOnSaleCity(prodIds, callback) {
      //跳过经销商
      // if (this.entity.merchantModel == 2) {
      //     return callback([]);
      // }
      //TODO：调整为所有供应商都要看(有分账需求，还需要拿到最新的销售价)
      var self = this;
      self.$httpUtil.post({
        url: "/sguBaseInfo/queryProdUserLevelPriceByProdId.json",
        loading: true,
        contentType: "form",
        data: {
          prodIdList: prodIds
        },
        succ: function (data) {
          callback(data.data);
        }
      });
    },
    /**
     * 验证城市是否可以上架
     */
    validCityCanSale(city, failHandler) {
      if (city == null) return true;
      var self = this;
      const h = this.$createElement;
      var notifyError = msg => {
        setTimeout(() => {
          self.$notify.error({
            title: "错误提醒",
            message: msg
          });
        }, 10);
      };
      var notify = msg => {
        setTimeout(() => {
          self.$notify({
            title: "提醒",
            message: h(
              "i", {
                style: "color: teal"
              },
              msg
            )
          });
        }, 10);
      };
      // if (this.entity.merchantModel == 2) {
      //     //跳过经销商
      //     return true;
      // }
      for (var i = 0; i < self.entity.sguProdInfoList.length; i++) {
        var prod = self.entity.sguProdInfoList[i];
        //看允许采购的城市(启动采购，并且销售价审批通过)
        var userLevelPrice = prod.purchaseCityList.find(
          c =>
          c.status == 1 &&
          c.sub_account_status == 1 &&
          c.admin_shop_id == city.admin_shop_id
        );
        // 团购商品 须校验城市配送模式 是否与SGU上架模式一致
        var deliveryType = self.entity.deliveryType;
        if (self.entity.distributionType === 0) {
          if (
            prod.purchaseCityList.some(
              c =>
              c.status == 1 &&
              c.admin_shop_id == city.admin_shop_id &&
              c.delivery_type !== deliveryType &&
              c.delivery_type !== 3
            )
          ) {
            if (failHandler) {
              failHandler();
            }
            notifyError(
              `[${prod.prodName}]在 ${city.level_name} 配送方式与供应商配送方式不匹配,不能上架售卖`
            );
            return false;
          }
        }
        if (!userLevelPrice) {
          if (failHandler) {
            failHandler();
          }
          if (
            prod.purchaseCityList.some(
              c =>
              c.status == 1 &&
              c.sub_account_status == 0 &&
              c.admin_shop_id == city.admin_shop_id
            )
          ) {
            notifyError(
              `[${prod.prodName}]在 ${city.level_name} 的销售价未审核通过,不能上架售卖`
            );
            return false;
          }
          //当前代销商品在该城市下不能采购，也不能上架售卖
          notifyError(
            `[${prod.prodName}]在 ${city.level_name} 未启用采购或已关联过其他代销供应商,不能上架售卖`
          );
          return false;
        } else {
          //分账供应商城市开启上架时，需要先判断最新的审批通过的销售价是否发生了改变。如果改变需要同步一次
          if (self.entity.isSubAccount != 1) continue;
          if (
            self.$commonUtil.valid.isEmpty(
              userLevelPrice.sub_account_prod_price
            )
          ) {
            if (failHandler) {
              failHandler();
            }
            notifyError(
              `[${prod.prodName}]在${city.level_name}没有审核通过的销售价,不能上架售卖`
            );
            return false;
          }
        }
      }
    },
    //---------- 城市上架信息 end ---------------
    /**
     * 扩大数据
     * @param {*} val
     * @param {*} rate
     */
    multiplyVal(val, rate) {
      return math.format(
        math
        .chain(math.bignumber(val))
        .multiply(math.bignumber(rate))
        .done()
      );
    },
    /**
     * 计算城市默认的团长佣金
     * @param {*} val
     */
    calcDefaultCommissionAmount(val, callback) {
      if ((val || 0) === 0) return;
      if ((this.baseData.cityCommissionRatio || 0) > 0) {
        //未批量设置且有城市佣金比例
        var val = Number(math.format(
          math.chain(math.bignumber(val)).multiply(math.bignumber(this.baseData.cityCommissionRatio))
          .divide(math.bignumber(100)).done())).toFixed(2);
        if (callback) {
          callback(val);
        }
      }
    },
    /**
     * 计算毛利率
     * @param {*} row
     */
    calcGrossRate(row) {
      this.calcGrossRate2(row, this.entity.isSubAccount, this.entity.distributionType);
    },
    /**
     * 计算毛利率(外部传入是否分账标记)
     * @param {*} row
     */
    calcGrossRate2(row, isSubAccount, distributionType) {
      var salePrice = row.salePrice > "" ? row.salePrice : 0;
      if (isSubAccount == 1) {
        this.subAccountGrossProfitRate2(row, distributionType);
      } else {
        this.normalGrossProfitRate2(row, distributionType);
      }
      // 毛利率 = 毛利 / 销售价
      if (salePrice > 0) {
        row.grossProfitRate = Number(
          math.format(
            math
            .chain(math.bignumber(row.grossProfit))
            .divide(math.bignumber(salePrice))
            .multiply(math.bignumber(100))
            .done()
          )
        ).toFixed(2);
      } else {
        row.grossProfitRate = 0;
      }
    },
    /**
     * 非分账商品计算毛利
     * @param {*} row
     */
    normalGrossProfitRate(row) {
      this.normalGrossProfitRate2(row, this.entity.distributionType);
    },
    /**
     * 分账 商品计算毛利
     * @param {*} row
     */
    subAccountGrossProfitRate(row) {
      this.subAccountGrossProfitRate2(row, this.entity.distributionType);
    },

    /**
     * 非分账商品计算毛利
     * @param {*} row
     */
    normalGrossProfitRate2(row, distributionType) {
      var commissionAmount =
        row.commissionAmount > "" ? row.commissionAmount : 0;
      var sharedCommissionAmount = 0;
      if (distributionType === 1) {
        //直购
        sharedCommissionAmount =
          row.sharedCommissionAmount > "" ? row.sharedCommissionAmount : 0;
      }
      var salePrice = row.salePrice > "" ? row.salePrice : 0;
      var prodPrice = row.prodPrice > "" ? row.prodPrice : 0;
      //毛利 = 销售价 - 佣金 - 成本价
      row.grossProfit = math.format(
        math
        .chain(math.bignumber(salePrice))
        .subtract(math.bignumber(commissionAmount))
        .subtract(math.bignumber(sharedCommissionAmount))
        .subtract(math.bignumber(prodPrice))
        .done()
      );
    },
    /**
     * 分账 商品计算毛利
     * @param {*} row
     */
    subAccountGrossProfitRate2(row, distributionType) {
      var commissionAmount =
        row.commissionAmount > "" ? row.commissionAmount : 0;
      var sharedCommissionAmount = 0;
      if (distributionType === 1) {
        //直购
        sharedCommissionAmount =
          row.sharedCommissionAmount > "" ? row.sharedCommissionAmount : 0;
      }
      var salePrice = row.salePrice > "" ? row.salePrice : 0;
      var prodPrice = row.prodPrice > "" ? row.prodPrice : 0;
      //毛利 = 销售价- 成本价 - 团长佣金 - 分享佣金
      row.grossProfit = math.format(
        math
        .chain(math.bignumber(salePrice))
        .subtract(math.bignumber(prodPrice))
        .subtract(math.bignumber(commissionAmount))
        .subtract(math.bignumber(sharedCommissionAmount))
        .done()
      );
    }
  }
};