<template>
  <a href="javascript:void(0)" @click="openProcess(refId)" title="点击查询审批流程详情">
    <slot>
      {{
      $cacheUtil.getVal("prod_audit_status", processStatus)
      }}
    </slot>
  </a>
</template>
<script>
import baseMixin from "@/common/mixins/baseMixin";
export default {
  name: "sxhProcess",
  mixins: [baseMixin],
  props: {
    //流程枚举值
    processEnum: {
      type: String,
      require: true
    },
    //当前流程状态
    processStatus: {
      type: Number,
      require: true
    },
    //业务主键
    refId: {
      type: Number,
      require: true
    }
  },
  methods: {
    /**
     * 查询当前审核节点
     */
    openProcess: function(bizId) {
      this.$commonUtil.win.showProcessList(this, this.processEnum, bizId);
    }
  }
};
</script>
