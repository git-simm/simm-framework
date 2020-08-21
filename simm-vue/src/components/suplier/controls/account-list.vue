<template>
  <el-table border size="mini" :data="accountList" style="width: 100%">
    <el-table-column label="供应商编码" prop="supplyNumber"></el-table-column>
    <el-table-column label="供应商名称" prop="supplyName"></el-table-column>
    <el-table-column label="供应商平台登陆账号" prop="loginName"></el-table-column>
    <el-table-column label="平安子账号"  prop="subAccount"></el-table-column>
    <el-table-column label="交行子账号"  prop="subAccountJiao">
      <template slot-scope="scope">
        <span>{{ scope.row.subAccountJiao }}</span>
        <br/>
        <span v-if="scope.row.subAccountJiao && bankCode === 'BOCOM'">(
          {{$cacheUtil.getVal("comm_active_status", scope.row.commActiveStatus)}})</span>
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">{{ $cacheUtil.getVal('account_status_type',scope.row.status ) }}</template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <span v-permission:supply_reset_password_1,supply_reset_password,supply_reset_password_3>
          <el-button plain size="minier" @click="resetPassword(scope.row.id)">重置密码</el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "AccountList",
  data() {
    return {
      id: "",
      bankCode: "",
      accountList: [],
      bankEnum: {
        bocom: "BOCOM", // 交通银行
        pab: "PAB" // 平安银行
      }
    };
  },
  //方法列表
  methods: {
    getList(id, bankCode) {
      let self = this;
      self.id = id;
      self.bankCode = bankCode;
      self.$httpUtil.post({
        url: "/supplyInfo/queryAllLoginAccount.json?id=" + self.id,
        succ: data => {
          self.accountList = data.data;
        }
      });
    },
    resetPassword(id) {
      let self = this;
      self
        .$confirm("确认要重置密码?sxh@12345", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$httpUtil.post({
            url: "/supplyInfo/resetPassword.json",
            data: {
              id: id,
              supplyId: self.id
            },
            contentType: "form", //json,form,multipart
            succ: function(data) {
              if (data) {
                self.$message({
                  message: "操作成功",
                  type: "success"
                });
              }
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.form-input {
  float: left;
  margin-bottom: 0;
  padding-right: 10px;
}
</style>
