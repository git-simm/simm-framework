<template>
  <section class="content-section layer-container">
    <div class="text-theme">推荐审批人列表( 角色编码:{{this.node.roles}} )</div>
    <el-table style="width: 100%" size="mini" height="400" border :data="approverData">
      <template>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="userType" label="用户类型">
          <template slot-scope="scope">{{ getAccountInfo(scope.row) }}</template>
        </el-table-column>
        <el-table-column prop="mobile" label="电话号码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
      </template>
    </el-table>
  </section>
</template>
<script>
export default {
  name: "processNode",
  data() {
    return {
      node: {},
      process: {},
      approverData: []
    };
  },
  created() {
    this.node = this.$options.propsData.node;
    this.process = this.$options.propsData.process;
    this.getApprover();
  },
  methods: {
    /**
     * 显示用户所属省市信息
     */
    getAccountInfo(user) {
      if (user.userType === 0) {
        return "总部";
      } else if (user.userType === 1) {
        return `省级(${user.province})`;
      } else if (user.userType === 2) {
        return `城市(${user.province}-${user.city})`;
      } else if (user.userType === 3) {
        return "直购";
      }
    },
    /**
     * 获取审批人信息
     */
    getApprover() {
      var self = this;
      self.$httpUtil.post({
        url: "/process/getApprover.json",
        contentType: "form", //json,form,multipart
        data: {
          roleCodes: this.node.roles.split(",")
        },
        succ: function(data) {
          self.approverData = data.data || [];
          //排除掉测试用户
          self.approverData = self.approverData.filter(
            a => !(a.name || "").includes("测试")
          );
        }
      });
    }
  }
};
</script>