import { SupplyApi } from "@/common/api/SupplyApi.js";
/**
 * 商品扩展
 */
export default class SupplyProcessExtend extends SupplyApi {
  constructor(vue, processName, refId) {
    super(vue);
    this.processName = "SUPPLY_RENEW_AUDIT";
    this.refId = refId;
    this.append = "（合同续签）";
  }
  /**
   * 日志扩展
   * @param {*} param0
   * @param {*} callback
   */
  async extendNode({ sysAudits, sysAuditLogs }, callback) {
    var rtn = await super.getSupplyRenewAuditInfo(this.refId);
    var info = this.wrapAuditInfo(rtn, sysAudits, sysAuditLogs);
    if (callback) {
      callback(info);
    }
  }
  /**
   * 组装审核信息
   * @param {*} reNewLogs
   * @param {*} sysAudits
   * @param {*} sysAuditLogs
   */
  wrapAuditInfo(reNewLogs, sysAudits, sysAuditLogs) {
    reNewLogs = reNewLogs || [];
    reNewLogs.forEach((log) => {
      log.auditRemark += this.append;
    });
    sysAuditLogs = [...sysAuditLogs, ...reNewLogs];
    var info = {
      sysAudits,
      sysAuditLogs,
    };
    if (reNewLogs.length > 0) {
      var last = reNewLogs[reNewLogs.length - 1];
      if (last.auditRemark.includes("发起审批")) {
        info.nextAuditor = {
          admin_role_name: "供应商管理员",
          append: this.append,
        };
      }
    }
    return info;
  }
}
