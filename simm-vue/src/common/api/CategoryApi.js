/**
 * 商品请求api
 */
export class CategoryApi {
    constructor(vue) {
        this.vue = vue;
    }
    /**
     * 获取商品对应的三级类目信息
     */
    getThreeCategory(spuId, callback) {
        this.vue.$httpUtil.post({
            url: "/spuBaseInfo/threeCategory.json",
            data: {
                spuId: spuId
            },
            contentType: "form",
            loading: false,
            succ: function (data) {
                if (callback) {
                    callback(data.data)
                }
            }
        });
    }
    /**
     * 获取商品三级类目对应城市信息
     */
    getCategoryCity(threeCategoryId, cityId, callback) {
        var self = this;
        this.vue.$httpUtil.post({
            url: "/base/prod/categoryCity/getOne.json",
            data: {
                categoryId: threeCategoryId,
                cityId: cityId
            },
            loading: false,
            contentType: "form",
            succ: function (data) {
                if (callback) {
                    callback(data.data)
                }
            }
        });
    }
}