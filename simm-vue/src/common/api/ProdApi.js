/**
 * 商品请求api
 */
export class ProdApi {
    constructor(vue) {
        this.vue = vue;
    }
    /**
     * 获取商品信息
     * @param {*} id 
     */
    async getProdInfo(id) {
        var result = {};
        var rtn = await this.vue.$httpUtil.post({
            url: "/prodInfo/view.json",
            data: {
                id: id
            },
            contentType: "form"
        });
        result = rtn.data.data;
        result.prodInfo.audits = result.audits;
        return result;
    }
}