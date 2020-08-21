/**
 * 供应商请求api
 */
export class SupplyApi {
    constructor(vue) {
        this.vue = vue;
    }
    /**
     * 获取续签审批日志
     * @param {*} supplyId
     */
    async getSupplyRenewAuditInfo(supplyId) {
        var result = {};
        var rtn = await this.vue.$httpUtil.post({
            url: "/supplyContract/getAuditList.json",
            data: {
                supplyId: supplyId
            },
            contentType: "form"
        });
        return rtn.data.data;
    }
}