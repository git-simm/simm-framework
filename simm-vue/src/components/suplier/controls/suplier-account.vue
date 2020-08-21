<template>
  <el-dialog title="创建账号" :visible.sync="show">
    <el-form>
      <el-form-item label="供应商平台账号" prop="suplierAccount">
        <el-input v-model.trim="suplierAccount" disabled></el-input>
      </el-form-item>
      <el-input v-model.trim="accountStatusUpdateAt" v-show="false"></el-input>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SuplierAccount",
  data() {
    return {
      id: "",
      show: false,
      suplierAccount: "",
      accountStatusUpdateAt: null,
      rules: {},
    };
  },
  created() {},
  //方法列表
  methods: {
    /**
     * 设置显示
     */
    setVisible(visible, id, platformAccount, accountStatusUpdateAt) {
      this.show = visible;
      if (id) {
        this.id = id;
        this.suplierAccount = platformAccount;
        this.accountStatusUpdateAt = accountStatusUpdateAt;
      }
    },
    save: function () {
      let self = this;
      self
        .$confirm("确定创建供应商账号吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.$httpUtil.post({
            url: "/supplyInfo/intiSupplyAccount.json",
            data: {
              id: this.id,
              suplierAccount: this.suplierAccount,
              accountStatusUpdateAt: this.accountStatusUpdateAt,
            },
            contentType: "form", //json,form,multipart
            succ: function (data) {
              if (data) {
                self.$message({
                  message: "操作成功",
                  type: "success",
                });
                self.cancel();
                self.$emit("getListData");
              }
            },
          });
        })
        .catch(() => {});
    },
    cancel: function () {
      this.id = "";
      this.suplierAccount = "";
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.form-input {
  float: left;
  margin-bottom: 0;
  padding-right: 10px;
}
</style>
