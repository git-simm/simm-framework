export default {
    methods: {
        /**
         * 城市下商品信息循环处理
         */
        loopAllProds(callback) {
            if (!callback) return;
            var self = this;
            (self.formData.sguProdInfoList || []).forEach(prod => {
                callback(prod);
            });
        },
        /**
         * 商品是否相等
         */
        prodEqual(cityProd, sguProd) {
            if (cityProd.prodId) {
                return cityProd.prodId == sguProd.prodId;
            } else if (cityProd.sguProdId) {
                return cityProd.sguProdId == sguProd.id;
            }
            return false;
        },
        /**
         * 重置可用库存
         */
        resetStock() {
            var self = this;
            this.loopAllProds(prod => {
                prod.sellableStock = 0;
                prod.totalSales = 0;
                prod.initSales = 0;
                prod.boughtPeople = 0;
            });
        },
    }
}