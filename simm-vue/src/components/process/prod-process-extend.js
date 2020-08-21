import { ProdApi } from '@/common/api/ProdApi.js';
/**
 * 商品扩展
 */
export default class ProdProcessExtend extends ProdApi {
    constructor(vue, processName, refId) {
        super(vue);
        this.processName = processName;
        this.refId = refId;
    }
    /**
     * 方法
     * @param {*} param0 
     * @param {*} callback 
     */
    async extendNode({ sysAudits, sysAuditLogs }, callback) {
        var rtn = await super.getProdInfo(this.refId);
        var info = this.wrapSalePriceAuditInfo(rtn.prodInfo, sysAudits, sysAuditLogs);
        if (callback) {
            callback(info);
        }
    }
    /**
     * 组装销售价审核信息
     */
    wrapSalePriceAuditInfo(prodInfo, sysAudits, sysAuditLogs) {
        var info = { sysAudits, sysAuditLogs };
        if (prodInfo.is_sub_account === 1) {
            //分账且审批已经完成
            if (sysAudits != null) {
                sysAudits.push({
                    config_condition: "supplymanager",
                    config_desc: "供应商审核",
                    config_name: this.processName,
                    driver: 2,
                    sort: 99,
                    status: Number(prodInfo.init_audit_status === 2),
                });
            }
            if (prodInfo.processStatus === 3) {
                if (prodInfo.init_audit_status === 2) {
                    sysAuditLogs.push({ auditRemark: `${prodInfo.firstAuditPriceTime} ${prodInfo.supplyName} 审核完成`, status: 1 });
                } else {
                    //价格初始审核未完成,追加供应商审核节点
                    info.nextAuditor = { admin_role_name: prodInfo.supplyName };
                }
            }
        }
        return info;
    }
}