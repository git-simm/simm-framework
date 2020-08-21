export default {
    methods: {
        /**
         * 获取城市信息
         * @param {*} cityId 
         * @param {*} callback 
         */
        getCityInfo(cityId, callback) {
            var self = this;
            this.$httpUtil.post({
                url: "/supplyUserLevel/getlist.json",
                contentType: "form",
                loading: false,
                data: {
                    admin_shop_id: cityId
                },
                succ: function (data) {
                    var city = {};
                    if ((data.data || []).length > 0) {
                        city = data.data[0];
                    }
                    if (callback) {
                        callback(city);
                    }
                }
            });
        },
    },
}