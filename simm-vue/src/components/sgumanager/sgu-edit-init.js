let math = require("mathjs");
export default {
  methods: {
    /**
     * 初始化数据结构
     */
    initData() {
      var self = this;
      if (this.$route.path.includes("/view")) {
        this.baseData.mode = "view";
      } else if (this.$route.path.includes("/audit")) {
        this.baseData.mode = "audit";
      } else if (this.$route.path.includes("/edit")) {
        this.baseData.mode = "edit";
      } else if (this.$route.path.includes("/copy")) {
        this.baseData.mode = "copy";
      } else {
        this.baseData.mode = "add";
      }
      this.entity.id = this.$route.params.id;
      if (this.viewParam) {
        //查看抽屉页面
        this.baseData.mode = "view";
        this.entity.id = this.viewParam.id;
      }
      //新增/编辑/复制模式需要读取最新的城市团长佣金比例
      if (this.baseData.mode == "add") {
        this.entity.id = null;
        self.getCurrentCityInfo(() => {
          self.initAddData();
        });
      } else if (this.baseData.mode == "copy") {
        self.getCurrentCityInfo(() => {
          self.initCopyData();
        });
      } else if (this.baseData.mode == "edit") {
        self.getCurrentCityInfo(() => {
          self.initEditData();
        });
      } else {
        //查看/审核模式
        this.initEditData();
      }
    },
    /**
     * 初始化新增数据
     */
    initAddData() {
      let self = this;
      //新增模式下 读取商品信息
      let prodId = this.$route.params.prodId;
      if (!prodId) return;
      // 团购配送方式 1-包邮 2-自提
      let deliveryType = Number(this.$route.params.deliveryType || 1); // 直购 deliveryType默认为1
      self.$set(self.entity, "sort", this.getInitSortVal());
      // 配送方式
      self.$set(self.entity, "deliveryType", deliveryType);
      //快递费都默认为0
      self.$set(self.entity, "postage", 0);
      self.$httpUtil.post({
        url: "/prodInfo/prodSpuInfo.json?id=" + prodId,
        succ: function (data) {
          self.entity.prodInfo = data.data;
          var prod = self.entity.prodInfo;
          if (self.entity.prodInfo != null) {
            //为表单赋默认值
            self.getGrossProfitRate(self.entity.prodInfo.spu_id, grossProfitRate => {
              self.$set(self.entity, "grossProfitRate", grossProfitRate);
              self.$set(self.entity, "sguName", prod.joint_name);
              self.$set(self.entity, "spuId", prod.spu_id);
              self.$set(self.entity, "spuNumber", prod.spu_number);
              self.$set(self.entity, "spuName", prod.joint_name);
              self.$set(self.entity, "supplyId", prod.purchase_supply_id);
              self.$set(self.entity, "supplyName", prod.supply_name);
              self.$set(self.entity, "supplyNumber", prod.supply_number);
              self.$set(self.entity, "merchantModel", prod.merchant_model);
              self.$set(self.entity, "isAgent", prod.is_agent);
              self.$set(self.entity, "isSubAccount", prod.is_sub_account);
              self.$set(
                self.entity,
                "isDirectPurchasing",
                prod.is_direct_purchasing
              );
              self.$set(
                self.entity,
                "distributionType",
                prod.is_direct_purchasing == 1 ? 1 : 0
              );
              if (deliveryType === 1) {
                // 包邮品都是非次日达
                self.$set(self.entity, "isNextDay", 0);
              } else {
                // 自提品
                self.$set(self.entity, "isNextDay", self.entity.isAgent === 1 ? 1 : 0);
              }
              if (self.entity.isAgent === 1) {
                self.$set(self.entity, "saleType", 0);
              }
              // TODO 城市上架 标记
              self.baseData.cityEdit =
                self.entity.distributionType == 0 &&
                self.baseData.userInfo.roleType == 2;
              if (self.baseData.cityEdit) {
                self.getCitySaleLogisticsPart(self.baseData.userInfo.cityId);
              }
              //获取移动平均价
              self.getStockAvgPrice(prod);
              //默认添加一条商品
              //获取代销供应商下的商品对应的上架信息
              self.getOnSaleCity([prod.id], citys => {
                //新增时需要处理 直购商品信息
                prod.purchaseCityList = citys;
                //如果是直购或城市上架 须处理商品数据
                if (
                  self.baseData.userInfo.roleType > 1 &&
                  prod.produserlevelprice.length > 0
                ) {
                  var city;
                  if (self.entity.distributionType == 1) {
                    // 直购
                    city = prod.produserlevelprice.find(
                      a => a.admin_shop_id == 1
                    );
                  } else if (self.baseData.cityEdit) {
                    city = prod.produserlevelprice.find(
                      a => a.admin_shop_id == self.baseData.userInfo.cityId
                    );
                  }
                  if (!city) {
                    city = prod.produserlevelprice[0];
                  }
                  prod.sub_account_prod_price = city.sub_account_prod_price;
                  prod.sub_account_proportion = city.sub_account_proportion;
                  prod.sub_account_cost_price = city.sub_account_cost_price;
                  prod.platform_service_fee = city.platform_service_fee;
                } else {
                  prod.sub_account_prod_price = prod.sub_account_prod_price;
                  prod.sub_account_proportion = prod.sub_account_proportion;
                  prod.sub_account_cost_price =
                    prod.sub_account_cost_price || prod.prod_price;
                  prod.platform_service_fee = prod.platform_service_fee;
                }
                //上架商品取城市最新余额支付属性
                if (prod.creator_role == 2) {
                  prod.isPayByBalance = prod.is_pay_by_balance;
                  if (prod.produserlevelprice[0].is_pay_by_balance === 0) {
                    prod.isPayByBalance = 0;
                  }
                } else {
                  prod.isPayByBalance = 0;
                }
                self.$nextTick(() => {
                  self.$refs.baseInfo.initData(self.entity, prod);
                });
              });
            });
          }
        }
      });
    },
    /**
     * 初始化复制数据
     */
    initCopyData() {
      let self = this;
      let id = this.entity.id;
      if (!id) return;
      //编辑模式，获取明细数据
      self.$httpUtil.post({
        url: "/sguBaseInfo/view.json",
        data: {
          id: id
        },
        succ: function (data) {
          self.wrapCopyData(data.data);
        }
      });
    },
    /**
     * 组装复制数据
     * 1.清理各级对象ID
     * 2.清理审核信息
     * 3.canEdit directEdit modify属性赋值
     */
    wrapCopyData(data) {
      var self = this;
      self.entity = data;
      self.getGrossProfitRate(self.entity.spuId, grossProfitRate => {
        self.$set(self.entity, "grossProfitRate", grossProfitRate);
        // self.$set(self.entity, "isNextDay", self.entity.isAgent === 1 ? 1 : 0);
        self.$set(self.entity, "isDiff", 0);
        self.$set(self.entity, "leaderGroups", []);
        if (self.entity.deliveryType === 1) {
          // 包邮品都是非次日达
          self.$set(self.entity, "isNextDay", 0);
        }
        //直购 & 审批通过后 显示全国上架的信息在主界面
        self.baseData.directEdit = false;
        // 城市显示上架信息在第一页
        self.baseData.cityEdit =
          self.entity.distributionType == 0 &&
          self.baseData.userInfo.roleType == 2;
        // 复制为草稿 可编辑
        self.baseData.canEdit = true;
        //审核通过后可以修改某些属性值
        self.baseData.modify = true;
        (self.entity.sguProdInfoList || []).forEach(prod => {
          //复制取最新的是否余额支付
          var prodByBalance = {};
          prodByBalance.id = prod.prodId;
          self.baseData.getProInfo(prodByBalance, prodInfo => {
            self.$set(prod, "isPayByBalance", prodInfo.isPayByBalance);
          });
          //1.先拷贝一次值
          self.$set(prod, "commissionAmount", prod.commissionAmount);
          //2.看下要不要覆盖
          self.baseData.calcDefaultCommissionAmount(prod.salePrice, val => {
            prod.commissionAmount = val;
          });
          self.$set(prod, "sharedCommissionAmount", prod.sharedCommissionAmount);
          self.$set(prod, "initSales", 0);
          self.$set(prod, "totalSales", 0);
          self.$set(prod, "safeStock", 0);
          self.$set(prod, "boughtPeople", 0);
          self.$set(prod, "arrivalDate", "");
          self.$set(prod, "platformServiceFee", parseFloat(prod.salePrice - prod.prodPrice).toFixed(2));
          //初始化数据的毛利率信息
          self.calcGrossRate(prod);
          // 清理 SGU商品表ID
          if (prod.id) {
            delete prod.id;
          }
          //如果是城市或者直购复制SGU，需要连同 sguProdSaleScopes 一起删除
          if (self.baseData.cityEdit || self.entity.distributionType === 1) {
            //清空明细
            prod.sguProdSaleScopes = [];
          }
          (prod.sguProdSaleScopes || []).forEach(scope => {
            // debugger;
            //数据准备,拷贝产品列表上的信息
            //1.先拷贝一次值
            self.$set(scope, "commissionAmount", scope.commissionAmount);
            //2.看下要不要覆盖
            self.baseData.calcDefaultCommissionAmount(scope.salePrice, val => {
              scope.commissionAmount = val;
            });
            self.$set(scope, "sharedCommissionAmount", scope.sharedCommissionAmount);
            self.$set(scope, "totalSales", scope.initSales);
            self.$set(scope, "prodName", prod.prodName);
            self.$set(scope, "prodId", prod.prodId);
            self.$set(scope, "skuNumber", prod.skuNumber);
            self.$set(scope, "categoryId", prod.categoryId);
            self.$set(scope, "twoCategoryId", prod.twoCategoryId);
            self.$set(scope, "arrivalDate", "");
            self.$set(scope, "platformServiceFee", parseFloat(scope.salePrice - scope.prodPrice).toFixed(2));
            if (self.baseData.userInfo.roleType < 2) { // 省级&全国 复制 默认关闭城市上架开关
              self.$set(scope, "valid", 0);
            }
            //初始化数据的毛利率信息
            self.calcGrossRate(scope);
            // 清理SGU上架城市ID
            if (scope.id) {
              delete scope.id;
            }
          });
        });
        // 清理基础表ID
        if (self.entity.id) {
          delete self.entity.id;
          self.entity.processStatus = 0;
          delete self.entity.onSaleTime;
          delete self.entity.takenOffTime;
          delete self.entity.cycleStartDate;
          delete self.entity.cycleStartTime;
          delete self.entity.cycleEndDate;
          delete self.entity.cycleEndTime;
          delete self.entity.isCycleOnSale;
          self.clearDefaultVal(self.entity);
        }
        if (self.baseData.cityEdit) {
          self.getCitySaleLogisticsPart(self.baseData.userInfo.cityId);
        }
        if (self.entity.isSubAccount == 1) {
          // 分账
          self.getOnSaleCity(
            self.entity.sguProdInfoList.map(a => a.prodId),
            citys => {
              self.entity.sguProdInfoList.forEach(prod => {
                prod.purchaseCityList = citys.filter(
                  c => c.prod_id == prod.prodId
                );
              });
              self.syncSalePrice();
            }
          );
        }
        self.$nextTick(() => {
          //初始化主界面基础信息
          self.$refs.baseInfo.initData(self.entity);
          if (self.$refs.saleArea) {
            self.$refs.saleArea.updateProdList(self.entity);
          }
        });
      });
    },
    /**
     * 初始化编辑数据
     */
    initEditData() {
      let self = this;
      let id = this.entity.id;
      if (!id) return;
      //编辑模式，获取明细数据
      self.$httpUtil.post({
        url: "/sguBaseInfo/view.json",
        data: {
          id: id
        },
        succ: function (data) {
          //编辑，驳回待编辑取最新毛利率
          if ((data.data.processStatus == 0 ||
              data.data.processStatus == -2) && self.baseData.mode != "view") {
            self.getGrossProfitRate(data.data.spuId, grossProfitRate => {
              self.$set(data.data, "grossProfitRate", grossProfitRate);
              self.wrapEditData(data.data);
            });
          } else {
            self.wrapEditData(data.data);
          }
        }
      });
    },
    /**
     * 组装初始化时的编辑数据
     */
    wrapEditData(data) {
      var self = this;
      self.baseData.processStatus = data.processStatus;
      self.entity = data;
      self.clearDefaultVal(self.entity);
      // 上架时段数据初始化
      if (self.entity.isCycleOnSale == 1) {
        var cycleDateRange = [];
        cycleDateRange.push(self.entity.cycleStartDate || "");
        cycleDateRange.push(self.entity.cycleEndDate || "");
        self.$set(self.entity, "cycleDateRange", cycleDateRange);
        var cycleTimeRange = [];
        cycleTimeRange.push(self.entity.cycleStartTime || "00:00:00");
        cycleTimeRange.push(self.entity.cycleEndTime || "23:59:59");
        self.$set(self.entity, "cycleTimeRange", cycleTimeRange);
      }
      (self.entity.sguProdInfoList || []).forEach(prod => {
        self.$set(prod, "isPayByBalance", prod.isPayByBalance);
        self.$set(prod, "commissionAmount", prod.commissionAmount);
        self.$set(prod, "sharedCommissionAmount", prod.sharedCommissionAmount);
        self.$set(prod, "initSales", prod.initSales);
        self.$set(prod, "totalSales", prod.totalSales);
        self.$set(prod, "safeStock", prod.sellableStock);
        self.$set(
          prod,
          "platformServiceFee",
          parseFloat(prod.salePrice - prod.prodPrice).toFixed(2)
        );
        //初始化数据的毛利率信息
        self.calcGrossRate(prod);
        (prod.sguProdSaleScopes || []).forEach(scope => {
          //数据准备,拷贝产品列表上的信息
          self.$set(scope, "isPayByBalance", prod.isPayByBalance);
          self.$set(scope, "commissionAmount", scope.commissionAmount);
          self.$set(
            scope,
            "sharedCommissionAmount",
            scope.sharedCommissionAmount
          );
          self.$set(scope, "prodName", prod.prodName);
          self.$set(scope, "prodId", prod.prodId);
          self.$set(scope, "skuNumber", prod.skuNumber);
          self.$set(scope, "categoryId", prod.categoryId);
          self.$set(scope, "twoCategoryId", prod.twoCategoryId);
          self.$set(scope, "platformServiceFee", parseFloat(scope.salePrice - scope.prodPrice).toFixed(2));
          //初始化数据的毛利率信息
          self.calcGrossRate(scope);
        });
      });
      //直购 & 审批通过后 显示全国上架的信息在主界面
      self.baseData.directEdit =
        self.entity.distributionType == 1 && data.processStatus == 3;
      self.baseData.cityEdit =
        self.entity.distributionType === 0 && self.entity.creatorRole == 2;
      if (self.baseData.cityEdit) {
        self.getCitySaleLogisticsPart(self.entity.addressCityId);
      }
      // 修改&查看 控制参数 新增时entity 无cityEdit属性
      self.$set(self.entity, "cityEdit", self.baseData.cityEdit);
      //草稿可编辑
      self.baseData.canEdit =
        data.processStatus === 0 || data.processStatus == -2;
      //审核通过后可以修改某些属性值
      self.baseData.modify = self.baseData.canEdit || data.processStatus == 3;
      //直购上架或 城市上架且审核通过的数据处理
      if (
        self.baseData.directEdit ||
        (self.entity.cityEdit && self.entity.processStatus == 3)
      ) {
        var direct = {
          sguProdInfoList: []
        };
        self.$set(self.entity, "direct", direct);
        // 直购 或 城市上架 审批通过后 显示全国上架的信息在主界面
        (self.entity.sguProdInfoList || []).forEach(prod => {
          (prod.sguProdSaleScopes || []).forEach(scope => {
            self.$set(scope, "isLimit", prod.isLimit);
            self.$set(scope, "limitAmount", prod.limitAmount);
            self.$set(scope, "hasLimitAmount", prod.hasLimitAmount);
            self.$set(scope, "prodDesc", prod.prodDesc);
            self.$set(scope, "stockSellableStock", prod.stockSellableStock || 0);
            self.$set(scope, "isPayByBalance", prod.isPayByBalance);
            self.entity.direct.sguProdInfoList.push(scope);
          });
        });
      }
      //TODO:(important)获取代销供应商下的商品对应的上架信息
      self.getOnSaleCity(
        self.entity.sguProdInfoList.map(a => a.prodId),
        citys => {
          self.entity.sguProdInfoList.forEach(prod => {
            prod.purchaseCityList = citys.filter(c => c.prod_id == prod.prodId);
          });
        }
      );
      //初始化主界面基础信息
      self.$nextTick(() => {
        self.$refs.baseInfo.initData(self.entity);
        if (self.baseData.mode == "view" || self.baseData.mode == "audit") {
          if (self.$refs.saleArea) {
            self.$refs.saleArea.updateProdList(self.entity);
          }
        }
      });
    },
    /**
     * 清理默认值
     * @param {*} entity 
     */
    clearDefaultVal(entity) {
      if (entity) {
        delete entity.defaultSellableStock;
        delete entity.defaultSafeStock;
        delete entity.defaultTotalSales;
        delete entity.defaultSalePrice;
        delete entity.defaultMarketPrice;
        delete entity.defaultCommissionRate;
      }
    },
    /**
     * 获取城市级别SGU提销分离的标记
     */
    getCitySaleLogisticsPart(adminShopId) {
      var self = this;
      self.$httpUtil.post({
        url: "/supplyUserLevel/getCitySaleLogisticsPart.json",
        contentType: "form",
        data: {
          adminShopId: adminShopId
        },
        succ: function (data) {
          self.baseData.citySaleLogisticsPart = (
            data.data || {}
          ).saleLogisticsPart;
        }
      });
    },
  }
};