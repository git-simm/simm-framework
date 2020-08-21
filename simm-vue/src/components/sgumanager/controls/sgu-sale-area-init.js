/**
 * 商品验证
 */
export default {
  methods: {
    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    },
    /**
     * 初始化数据
     */
    initData() {
      //这种用法实际上是创建了新对象(浅拷贝)
      this.formData = {
        ...this.formData,
        ...this.entity
      };
      //1.获取省级数据列表
      this.getCityList(this.entity.id);
    },
    /**
     * 获取城市数据
     */
    getCityList(sguId) {
      var self = this;
      //编辑或查看时，直接读取sgu对应的城市信息进行加载
      if (
        sguId &&
        this.formData.sguProdInfoList &&
        this.formData.sguProdInfoList.some(
          a => a.sguProdSaleScopes && a.sguProdSaleScopes.length > 0
        )
      ) {
        return;
      }
      this.hasInitCity = true;
      this.$httpUtil.post({
        url: "/supplyUserLevel/list2.json",
        contentType: "form",
        data: {
          page: 0,
          pagesize: 9999,
          status: 1,
          splitFlag: 1 //获取销提分离的标记
        },
        succ: function (data) {
          //过滤掉代理城市
          self.cityList = (data.data || []).filter(c => c.is_agent != 1);
          //关联省级
          self.getProviceList(self.cityList);
        }
      });
    },
    /**
     * 获取城市级别SGU提销分离的标记
     */
    getCitiesSaleLogisticsPart(cityList, callback) {
      var self = this;
      self.$httpUtil.post({
        url: "/supplyUserLevel/getCitiesSaleLogisticsPart.json",
        succ: function (data) {
          var cities = data.data || [];
          cityList.forEach(c => {
            c.saleLogisticsPart = (
              cities.find(a => a.id === c.admin_shop_id) || {}
            ).saleLogisticsPart;
          });
          if (callback) {
            callback(cityList);
          }
        }
      });
    },
    /**
     * 获取省级数据
     */
    getProviceList(citys) {
      var self = this;
      this.$httpUtil.post({
        url: "/groupprod/list.json",
        succ: function (data) {
          //对省级数据进行过滤
          var list = Array.from(new Set(citys.map(a => a.supply_site_id)));
          self.siteList = data.data.filter(a => list.includes(a.id));
          self.siteList.forEach(site => {
            self.$set(site, "allSale", false);
            site.cityList = citys.filter(
              city => city.supply_site_id == site.id
            );
            site.cityList.forEach(city => {
              self.$set(city, "isOnSale", false);
              self.$set(city, "addressProvince", site.site_name);
            });
          });
          self.calcOnSaleState();
        }
      });
    },
    /**
     * 上架状态计算
     */
    calcOnSaleState() {
      var self = this;
      //先得到所有的sgu下的商品数据
      self.scopeList = [];
      self.formData.sguProdInfoList.forEach(prod => {
        //数组合并
        prod.sguProdSaleScopes = prod.sguProdSaleScopes || [];
        self.scopeList = [...self.scopeList, ...prod.sguProdSaleScopes];
      });
      this.siteList.forEach(site => {
        site.cityList.forEach(city => {
          var prodList = self.scopeList.filter(
            scope => scope.addressCityId == city.admin_shop_id
          );
          city.isOnSale =
            (prodList || []).filter(scope => scope.valid == 1).length > 0;
          self.$set(city, "sguProdInfoList", prodList);
          //1.把商品信息组装到各个城市中
          self.initCityProdInfo(city, false);
        });
        this.change(site, null);
      });
      this.calcOnSale();
      this.getRealStock();
    },
    /**
     * 初始化城市商品信息
     */
    initCityProdInfo(city, refreshPrice) {
      var self = this;
      if (city.sguProdInfoList == null) {
        city.sguProdInfoList = [];
      }
      let subAccountProps = [
        "salePrice",
        "prodPrice",
        "subAccountProportion",
        "platformServiceFee"
      ];
      //同步方法
      let syncFunc = (sguProd, valid) => {
        var copy = self.deepClone(sguProd);
        copy.sguProdId = sguProd.id;
        delete copy.id;
        delete copy.sguProdInfoList;
        delete copy.sguProdSaleScopes;
        delete copy.produserlevelprice;
        //1.编辑状态
        var cityProd = city.sguProdInfoList.find(a => valid(a));
        //不刷新价格
        if (cityProd && refreshPrice) {
          //取最新的数据
          for (var p in copy) {
            if (
              subAccountProps.includes(p) &&
              self.formData.isSubAccount == 1
            ) {
              //分账供应商的销售价、成本价、平台服务费不能修改
              continue;
            }
            //看下商品成本价是否已经赋值(信息刷新),已经赋过值则不用再处理
            if (p == "prodPrice") {
              if (
                cityProd.prodPrice == null ||
                cityProd.prodPrice == undefined
              ) {
                cityProd.prodPrice = copy[p];
              }
            } else {
              cityProd[p] = copy[p];
            }
          }
          //安全库存初始化
          cityProd.safeStock = cityProd.sellableStock;
          self.baseData.calcGrossRate(cityProd);
          return;
        }

        if (!cityProd) {
          self.addCityInfo(copy, city);
          city.sguProdInfoList.push(copy);
        }
      };
      /**
       * 新增状态
       */
      if (city.sguProdInfoList.length == 0) {
        city.sguProdInfoList = this.deepClone(this.formData.sguProdInfoList);
        if (city.sguProdInfoList) {
          city.sguProdInfoList.forEach(cityProd => {
            delete cityProd.id;
            delete cityProd.produserlevelprice;
            cityProd.sguProdId = cityProd.id;
            self.addCityInfo(cityProd, city);
          });
        }
        return;
      }
      //移除被删掉的商品信息
      city.sguProdInfoList = city.sguProdInfoList.filter(cityProd =>
        self.formData.sguProdInfoList.some(sguProd =>
          self.prodEqual(cityProd, sguProd)
        )
      );
      //同步(formData.sguProdInfoList是引用类型，信息切换后直接完成同步)
      this.formData.sguProdInfoList.forEach(sguProd => {
        syncFunc(sguProd, cityProd => self.prodEqual(cityProd, sguProd));
      });
    },
    /**
     * 获取城市商品实物库存信息
     */
    getRealStock() {
      var self = this;
      //获取各城市下商品信息的实物库存
      if (self.formData.saleType == 1) return;
      var params = {
        searchStoreSguInfoDtoList: []
      };
      this.loopAllCityProd((prod, city, site) => {
        if (!params.searchStoreSguInfoDtoList.some(p => p.cityId === city.admin_shop_id
          && p.prodNumber === prod.skuNumber
          && p.supplyNumber === self.formData.supplyNumber)) {
          params.searchStoreSguInfoDtoList.push({
            sguId: -1,
            cityId: city.admin_shop_id,
            prodNumber: prod.skuNumber,
            supplyNumber: self.formData.supplyNumber
          });
        }
      });
      if (params.searchStoreSguInfoDtoList.length == 0) {
        return;
      }
      this.$httpUtil.post({
        url: "/sguBaseInfo/querySguRealStock.json",
        data: params,
        succ: function (data) {
          var stocks = data.data.storeSguProdInfoList || [];
          self.loopAllCityProd((prod, city, site) => {
            var stock = (stocks || []).find(
              a =>
                a.cityId == prod.addressCityId &&
                a.prodNumber == prod.skuNumber &&
                a.supplyNumber == self.formData.supplyNumber
            );
            if (stock && self.formData.saleType != 0) {
              self.$set(prod, "stockSellableStock", stock.sellableStock);
              prod.sellableStock = stock.sellableStock;
              prod.totalSales = stock.totalSales;
              prod.initSales = stock.initSales;
              prod.boughtPeople = stock.boughtPeople;
            } else if (stock && self.formData.saleType == 0) {
              self.$set(prod, "stockSellableStock", stock.sellableStock);
            }
          });
        }
      });
    },
    /**
     * 追加城市信息
     * @param {*} cityProd
     * @param {*} city
     */
    addCityInfo(cityProd, city) {
      cityProd.addressCityId = city.admin_shop_id;
      cityProd.addressCity = city.level_name;
      cityProd.addressProvinceId = city.supply_site_id;
      cityProd.addressProvince = city.addressProvince;
      //可售库存复制到安全库存中,做初始化
      cityProd.safeStock = cityProd.sellableStock;
      //获取商品在城市下的成本价
      var prodInfo = this.formData.sguProdInfoList.find(a =>
        this.prodEqual(cityProd, a)
      );
      if (prodInfo) {
        var cityPrice = (prodInfo.produserlevelprice || []).find(
          a => a.admin_shop_id == city.admin_shop_id
        );
        //有移动平均价则读取该值(不看是否为0)
        if (cityPrice) {
          //成本价赋值
          cityProd.prodPrice = cityPrice.prod_price;
          //销售价赋值
          if (this.formData.isSubAccount == 1) {
            //注意：城市下面没有销售价的话，需要直接读商品的总销售价
            //分账供应商，加载城市成本价
            cityProd.prodPrice =
              cityPrice.sub_account_cost_price || cityPrice.prod_price;
            cityProd.salePrice =
              cityPrice.sub_account_prod_price || prodInfo.salePrice;
            if (
              cityPrice.platform_service_fee === null ||
              cityPrice.platform_service_fee === undefined
            ) {
              cityProd.platformServiceFee = prodInfo.platformServiceFee;
            } else {
              cityProd.platformServiceFee = cityPrice.platform_service_fee;
            }
            cityProd.subAccountProportion =
              cityPrice.sub_account_proportion ||
              prodInfo.sub_account_proportion;
          }
          this.baseData.calcGrossRate(cityProd);
        }
      }
    }
  }
};
