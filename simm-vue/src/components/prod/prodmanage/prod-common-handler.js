export default {
    data() {
        return {
            prodCity: null,
            isAudit: false,
            cityIsPayByBalance: false,
        }
    },
    methods: {
        /**
         * 获取商品所属城市信息
         * @param {*} cityId 
         */
        getProdCityInfo(cityId, callback) {
            if (!cityId) {
                return;
            }
            var self = this;
            this.getCityInfo(cityId, city => {
                self.prodCity = city || {};
                self.isAudit = Boolean(self.prodCity.isAudit);
                self.cityIsPayByBalance = Boolean(self.prodCity.isPayByBalance);
                if (callback) {
                    callback(city);
                }
            })
        }
    },
}