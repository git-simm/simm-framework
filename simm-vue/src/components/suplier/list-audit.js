export default {
  methods: {
    ajaxFun(json, item, callback) {
      var self = this;
      var jsondata = Object.assign(
        {
          id: item.id,
          sysAudit: JSON.stringify(item.sysAudit)
        },
        json
      );
      this.$httpUtil.post({
        url: "/supplyInfo/updateAuditStatus.json",
        data: jsondata,
        contentType: "form",
        succ: function (data) {
          self.$message({
            message: "操作成功！",
            type: "success"
          });
          self.getListData();
          if (callback) {
            callback();
          }
        }
      });
    },
    // 审核通过
    ableFun(item) {
      var self = this;
      self
        .$confirm("确认审核通过？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.ajaxFun(
            {
              // audit_status: 1,
              audit_remark: "",
              process_status: 1
            },
            item,
            () => {
              // self.handStatus(item);
            }
          );
        })
        .catch(() => { });
    },
    /**
     * 取消审核
     */
    cancelAudit(id) {
      let self = this;
      if (id == null) {
        return;
      }
      self
        .$confirm("确认取消审核?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$httpUtil.post({
            contentType: "form",
            url: "/supplyInfo/cancelAudit.json",
            data: {
              id: id
            },
            succ: function (data) {
              self.success("取消成功", self.getListData);
            }
          });
        });
    },
    //跳转供应商平台
    toSupplyPlatForm(item) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/getSupplyPlatform.json",
        data: {
          supplyNumber: item.supply_number
        },
        contentType: "form", //json,form,multipart
        succ: function (data) {
          window.open(data.data);
        }
      });
    },
    callBackFun(item) {
      var self = this;
      self
        .$prompt("确认审核驳回？请填写备注：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputErrorMessage: "请填写备注"
        })
        .then(({ value }) => {
          (item.sysAudit || {}).remark = value;
          self.ajaxFun(
            {
              audit_remark: value,
              process_status: -2
            },
            item
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },

    success(msg, callback) {
      var self = this;
      self.$message({
        message: msg,
        type: "success"
      });
      if (callback) {
        setTimeout(callback, 1500);
      }
    },
    uploadBail(item) {
      var self = this;
      this.$commonUtil.win.uploadBailEvidence(
        self,
        { item },
        formData => {
          //清空审核备注
          formData.audit_remark = "";
          self.$httpUtil.post({
            url: "/supplyInfo/commitBailEvidence.json",
            data: formData,
            succ: function (data) {
              self.$message({
                message: "提交成功",
                type: "success"
              });
              self.getListData();
              self.$layerUtil.closeWin(self);
            }
          });
        }
      )
    },
    changeSettleDay(item) {
      var self = this;
      var store = this.$store;
      self
        .$prompt("确认要修改账期？请填写账期（天）：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\d+$/,
          inputErrorMessage: "请填写正确的账期"
        })
        .then(({ value }) => {
          self.settleDayFun(
            {
              settleDay: value
            },
            item
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    settleDayFun(json, item) {
      var self = this;
      var jsondata = Object.assign(
        {
          id: item.id
        },
        json
      );
      this.$httpUtil.post({
        url: "/supplyInfo/updateSettleDay.json",
        data: jsondata,
        contentType: "form",
        succ: function (data) {
          self.$message({
            message: "操作成功！",
            type: "success"
          });
          self.getListData();
        }
      });
    },
    creatAccout(id, platformAccount, accountStatusUpdateAt) {
      this.$refs.SuplierAccount.setVisible(
        true,
        id,
        platformAccount,
        accountStatusUpdateAt
      );
    },
    changeSupplyBalance(item) {
      var self = this;
      var store = this.$store;
      self
        .$prompt("确认要修改剩余余额？请填写消减余额：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(({ value }) => {
          self.supplyBalanceFun(
            {
              supplyBalance: value
            },
            item
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    supplyBalanceFun(json, item) {
      var self = this;
      var jsondata = Object.assign(
        {
          id: item.id
        },
        json
      );
      this.$httpUtil.post({
        url: "/supplyInfo/updateSupplyBalance.json",
        data: jsondata,
        contentType: "form",
        succ: function (data) {
          self.$message({
            message: "操作成功！",
            type: "success"
          });
          self.getListData();
        }
      });
    },
    /**
     * 批量生成交行子账号
     */
    batchGenerateSubAccount() {
      var self = this;
      self
        .$confirm(
          "该操作将批量生成当前状态为审核通过且交行子账号未开通的分账供应商交通银行子账号,可能耗时较长，请耐心等待!",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
        .then(() => {
          this.$httpUtil.post({
            url: "/supplyInfo/batchGenerateSubAccount.json",
            data: {},
            contentType: "form",
            succ: function (data) {
              if ((data.data.errLogs || []).length > 0) {
                var description =
                  "批量开通交行子账户操作完成,共" +
                  (data.data.errLogs || []).length +
                  "个供应商开通失败," +
                  (data.data.successLogs || []).length +
                  "个供应商开通成功!";
                self.$commonUtil.win.response(self, {
                  title: "操作结果",
                  type: "list",
                  desc: description, // 描述CertificatesValidityEnd
                  data: data.data.errLogs,
                  area: ["1000px", "600px"],
                  excelConfig: self.$metadata.supplySubAccOperaLogs,
                  failSum: data.data.length
                });
              } else {
                self.$message({
                  message: "批量开通交行子账户操作成功,无失败记录！",
                  type: "success"
                });
              }
            }
          });
        })
        .catch(() => { });
    },
    creatCOMMAccount(supplyId) {
      var self = this;
      self
        .$confirm("确认生成交行子账户?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // 请求
          var self = this;
          this.$httpUtil.post({
            url: "/supplyInfo/intiSupplyCOMMAccount.json",
            data: {
              id: supplyId
            },
            contentType: "form", //json,form,multipart
            succ: function (data) {
              self.$message({
                type: "success",
                message: "操作成功!"
              });
            }
          });
        })
        .catch();
    },
  }
};
