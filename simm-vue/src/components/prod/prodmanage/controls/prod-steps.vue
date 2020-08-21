<template>
  <div style="margin:0 40px">
    <el-steps :active="active" finish-status="success">
      <el-step
        v-for="(item,index) in steps"
        :title="item.title"
        :key="`step_${index}`"
        :description="item.description"
      ></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  name: "prodSteps",
  props: {
    /**
     * 商品信息
     */
    prodInfo: {
      type: Object,
      required: true,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    prodInfo(val, oldVal) {
      this.getSteps();
    }
  },
  data() {
    return {
      steps: [],
      active: 0
    };
  },
  created() {
    this.getSteps();
  },
  methods: {
    getSteps() {
      var self = this;
      var steps = [];
      if (!this.prodInfo.id) {
        return steps;
      }
      steps.push({
        title: "创建",
        description: `${this.prodInfo.admin_user_name} ${this.prodInfo.create_at}`
      });
      var lastAuditTime = "";
      if ((this.prodInfo.audits || []).length > 0) {
        this.prodInfo.audits.forEach(audit => {
          var desc = "";
          lastAuditTime = audit.update_at || "";
          if (audit.audit_admin_user_name > "") {
            desc = `${audit.audit_admin_user_name || ""} ${lastAuditTime}`;
          }
          steps.push({
            title: audit.config_desc,
            description: desc
          });
        });
      }

      if (this.prodInfo.is_sub_account === 1) {
        steps.push({
          title: "供应商审批",
          description: `${this.prodInfo.supplyName} ${this.prodInfo
            .firstAuditPriceTime || ""}`
        });
        steps.push({
          title: "完成",
          description: `${this.prodInfo.firstAuditPriceTime || ""}`
        });
      } else {
        steps.push({
          title: "完成",
          description: `${lastAuditTime || ""}`
        });
      }

      if (this.prodInfo.processStatus < 1) {
        this.active = 0;
      } else if (this.prodInfo.processStatus < 3) {
        var passNodes = [];
        if ((this.prodInfo.audits || []).length > 0) {
          //查询当前审批到了第几步
          passNodes = this.prodInfo.audits.filter(a => a.status === 1);
        }
        this.active = 1 + passNodes.length;
      } else if (this.prodInfo.is_sub_account === 1) {
        //分账看销售价是否审核完成
        if (this.prodInfo.init_audit_status == 2) {
          //整个过程完成
          this.active = steps.length;
        } else {
          this.active = steps.length - 2;
        }
      } else {
        //非分账直接到完成状态
        this.active = steps.length;
      }
      this.steps = steps;
    }
  }
};
</script>