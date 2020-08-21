<template>
  <el-drawer
    :title="`帮助中心【${code}】`"
    ref="drawer"
    :visible.sync="drawer"
    direction="rtl"
    :append-to-body="true"
    :modal-append-to-body="true"
    size="70%"
  >
    <div class="sxh_help_detail">
      <sxh-help-detail :code="code" :show-title="true"></sxh-help-detail>
    </div>
  </el-drawer>
</template>
<script>
import helpDocEditHandler from "@/components/settings/helpcenter/help-doc-edit-handler";
export default {
  name: "sxhHelpDrawerDetail",
  mixins: [helpDocEditHandler],
  props: {
    code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      drawer: false
    };
  },
  methods: {
    showDrawer() {
      this.drawer = true;
    },
    hideDrawer() {
      this.drawer = false;
    }
  }
};
</script>
<style lang="less">
.sxh_help_detail {
  padding: 0 20px 20px 20px;
}
</style>