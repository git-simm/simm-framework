/**
 * 添加商品
 */
export default {
  methods: {
    /**
     * 添加商品
     */
    addProd() {
      //search_type 1-根据操作人城市权限查询商品数据
      var self = this;
      this.$commonUtil.win.selectProdInfo(
        self, {
          prod_list: self.formData.sguProdInfoList.map(a => a.prodId) || [],
          purchase_supply_id: self.formData.supplyId,
          spu_id: self.formData.spuId,
          search_type: 1,
          beforeCallback: self.beforeCallback
        },
        prods => {
          //获取代销供应商下的商品对应的上架信息
          self.baseData.getOnSaleCity(
            prods.map(a => a.id),
            citys => {
              var repeaterSet = new Set();
              prods.forEach(prod => {
                prod.purchaseCityList = citys.filter(c => c.prod_id == prod.id);
              });
              prods.forEach(v => {
                if (
                  self.formData.sguProdInfoList.some(
                    a => a.skuNumber == v.prod_number
                  )
                ) {
                  //商品已经存在，则不允许再添加
                  repeaterSet.add(v.prod_number);
                } else {
                  //查询商品明细信息
                  self.baseData.getProInfo(v, prod => {
                    var obj = self.wrapProdInfo(prod);
                    self.formData.sguProdInfoList.push(obj);
                    // 新增商品 重新获取 实物可售
                    if (self.baseData.cityEdit) {
                      self.baseData.getRealStock(self.formData, self.baseData);
                    }
                  });
                }
              });
              if (repeaterSet.size > 0) {
                self.$commonUtil.message.alert(
                  `[${Array.from(repeaterSet).join(
                    "、"
                  )}]在SGU包中重复，同一种商品只能选择一条`
                );
              }
            }
          );
        }
      );
    },
    /**
     * 对选中的商品进行验证
     */
    beforeCallback(prods) {
      var self = this;
      prods.forEach(p => {
        if (p.is_sub_account == 1 && p.sub_status != 1) {
          self.$commonUtil.valid.throwEx(
            `${p.prod_name}[${p.prod_number}]销售价未审核通过，不能上架`
          );
        }
      });
      //按商品编码进行分组
      var groups = prods.group(a => a.prod_number);
      var repeaterSet = new Set();
      //查询出重复的分组
      for (var key of groups.keys()) {
        if (groups.get(key).length > 1) {
          repeaterSet.add(key);
        }
      }
      if (repeaterSet.size > 0) {
        this.$commonUtil.valid.throwEx(
          `[${Array.from(repeaterSet).join(
            "、"
          )}]在SGU包中重复，同一种商品只能选择一条`
        );
      }
    },
    /**
     * 组装商品信息
     */
    wrapProdInfo(prod) {
      var prodObj = {
        isPayByBalance: prod.isPayByBalance,
        prodId: prod.id,
        prodName: prod.prod_name,
        skuNumber: prod.prod_number,
        specification: prod.specification,
        inventory: prod.inventory,
        salePrice: this.getSalePrice(prod),
        commission: "",
        prodPrice: this.getCostPrice(prod),
        platformServiceFee: prod.platform_service_fee,
        grossProfit: "",
        arrivalDate: this.getArrivalDate(),
        sort: "",
        categoryId: prod.category_id,
        categoryName: prod.category_name,
        twoCategoryId: prod.two_category_id,
        twoCategoryName: prod.two_category_name,
        unitName: prod.unit_name,
        subAccountProportion: prod.sub_account_proportion,
        // 初始化
        sellableStock: this.formData.defaultSellableStock,
        initSales: this.formData.defaultInitSales,
        // totalSales: this.formData.defaultInitSales,
        boughtPeople: this.formData.defaultBoughtPeople,
        marketPrice: this.formData.defaultMarketPrice,
        commissionAmount: this.formData.defaultCommissionAmount,
        sharedCommissionAmount: this.formData.defaultSharedCommissionAmount,
        afterSaleCycle: this.formData.defaultAfterSaleCycle,
        productionDate: this.formData.defaultProductionDate,
        guaranteePeriod: this.formData.defaultGuaranteePeriod,
        totalSales: "",
        //初始化商品设置为不限购
        isLimit: 0,
        limitAmount: "",
        prodDesc: "",
        stockSellableStock: 0
      };
      this.baseData.calcGrossRate(prodObj);
      //运算一次团长佣金
      this.setCommissionAmount(prodObj, false);
      //把城市成本信息，写入到商品中
      prodObj.produserlevelprice = prod.produserlevelprice;
      prodObj.purchaseCityList = prod.purchaseCityList;
      if (!prod.grossProfit) {
        //计算佣金
        this.cellChange(prodObj, "commissionRateShow");
      }
      return prodObj;
    },
    /**
     * 获取销售价
     */
    getSalePrice(prod) {
      if (this.sgu.isSubAccount == 1) {
        return prod.sub_account_prod_price;
      } else {
        return this.formData.defaultSalePrice;
      }
    },
    /**
     * 获取成本价
     */
    getCostPrice(prod) {
      if (this.sgu.isSubAccount == 1) {
        return prod.sub_account_cost_price;
      } else {
        return prod.prod_price;
      }
    },
    /**
     * 获取团长佣金
     * @param {*} prodObj 
     * @param {*} useCityConfig 
     */
    setCommissionAmount(prodObj, useCityConfig) {
      var val = prodObj.commissionAmount || 0;
      if (val === 0 || useCityConfig) {
        this.baseData.calcDefaultCommissionAmount(prodObj.salePrice, val => {
          prodObj.commissionAmount = val;
        });
      }
    },
    /**
     * 获取预计到货时间
     */
    getArrivalDate() {
      // 提交审核后 不触发 预计到货时间计算
      let takeOfftime = this.sgu.takenOffTime;
      if (this.sgu.isCycleOnSale == 1) {
        // 分时段上架时 切换是否次日达 触发一次时间计算
        takeOfftime = this.sgu.cycleTakenOffTime;
      }
      if (this.sgu.isNextDay === 0 && takeOfftime !== "") {
        let time = new Date(takeOfftime);
        return time.getTime() + 24 * 60 * 60 * 1000;
      } else {
        return "";
      }
    },
  }
};