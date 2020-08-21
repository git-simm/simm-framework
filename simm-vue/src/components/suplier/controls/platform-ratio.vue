<template>
  <el-dialog title="修改分账信息" :visible.sync="visible">
    <el-form>
      <el-form-item label="是否分账" prop="isSubAccount">
        <el-radio-group v-model="isSubAccount">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--  <el-form-item label="平台比例" prop="platformRatio">
        <el-input v-model.number="platformRatio" type="number" :min="0" :max="100">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "PlatformRatio",
  data() {
    return {
      id: "",
      visible: false,
      isSubAccount: null,
      // platformRatio: null,
      rules: {}
    };
  },
  created() {},
  //方法列表
  methods: {
    /**
     * 设置显示
     */
    setVisible(visible, id, isSubAccount, platformRatio) {
      this.visible = visible;
      if (id) {
        this.id = id;
        this.isSubAccount = isSubAccount;
        this.platformRatio = platformRatio;
      }
    },

    valid: function() {
      let self = this;
      let baseValid = (func, msg) => {
        if (func && func()) {
          self.$commonUtil.valid.throwEx(msg);
        }
      };
      let emptyValid = (val, msg) => {
        baseValid(() => val == "" || val == null, msg);
      };

      baseValid(() => self.isSubAccount == null, "请选择是否分账");
      /* if(self.isSubAccount==1){
          emptyValid(self.platformRatio, "请输入分账比例");
          baseValid(
            () => !(self.platformRatio>0&&self.platformRatio<=99.4),
            "分账比例必须小于等于99.4，大于0"
          );
          var pattern = /^[0-9]+(.[0-9]{1,3})?$/;
          baseValid(
            () => !pattern.test(self.platformRatio),
            "分账比例最多只能输入两位小数"
          );
        }*/
    },

    save: function() {
      let self = this;
      self.valid();
      self
        .$confirm("确定修改分账信息？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$httpUtil.post({
            url: "/supplyInfo/updateSupplyIsSubAccount.json",
            data: {
              id: this.id,
              isSubAccount: this.isSubAccount,
              platformRatio: this.platformRatio
            },
            contentType: "json", //json,form,multipart
            succ: function(data) {
              if (data) {
                self.$message({
                  message: "操作成功",
                  type: "success"
                });
                self.cancel();
                self.$emit("getListData");
              }
            }
          });
        })
        .catch(() => {});
    },

    cancel: function() {
      this.id = "";
      this.visible = false;
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
