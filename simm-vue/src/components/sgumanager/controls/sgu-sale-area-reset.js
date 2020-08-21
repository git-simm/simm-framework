export default {
  methods: {
    // ---------------- 重置 begin------------------------------
    /**
     * 重置商品信息
     */
    resetCityInfo() {
      var self = this;
      //审核通过
      self
        .$confirm("确认重置商品配置信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.baseResetCityInfo();
        });
    },
    /**
     * 同步城市信息
     */
    baseResetCityInfo() {
      var self = this;
      self.siteList.forEach(site => {
        site.cityList.forEach(city => {
          //同步基础配置
          self.initCityProdInfo(city, true);
        });
      });
      //刷新控件
      if (this.cityData) {
        this.currentChange(this.cityData);
      }
      self.$message({
        message: "重置成功",
        type: "success"
      });
    },
    /**
     * 重置预计到货时间
     */
    resetArrivalDateInfo() {
      var self = this;
      self
        .$confirm("确认重置商品预计到货时间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.loopAllCityProd((prod, city, site) => {
            var stock = self.formData.sguProdInfoList.find(sguProd =>
              self.prodEqual(prod, sguProd)
            );
            if (stock && !self.$commonUtil.valid.isEmpty(stock.arrivalDate)) {
              prod.arrivalDate = stock.arrivalDate;
            }
          });
          self.$message({
            message: "重置成功",
            type: "success"
          });
        });
    },
    /**
     * 重置可用库存
     */
    resetStock() {
      var self = this;
      this.loopAllCityProd((prod, city, site) => {
        if (self.$commonUtil.valid.isEmpty(prod.sellableStock)) {
          var stock = self.formData.sguProdInfoList.find(sguProd =>
            self.prodEqual(prod, sguProd)
          );
          if (stock) {
            prod.sellableStock = stock.sellableStock;
            prod.totalSales = stock.sellableStock;
          }
        }
      });
    }
    // ---------------- 重置 end------------------------------
  }
};
