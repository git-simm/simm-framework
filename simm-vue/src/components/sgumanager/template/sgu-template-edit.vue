<template>
  <section class="content-section" id="proadd">
    <div class="row">
      <div class="col-sm-8">
        <el-form
          :model="request"
          :rules="rules"
          ref="formDate"
          label-width="500px"
          class="demo-ruleForm"
        >
          <el-form-item label="配送模板名称：" prop="templateName">
            <el-input v-model="request.templateName"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="valid">
            <el-select v-model="request.valid" clearable placeholder="请选择">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="col-sm-3"></div>
            <el-button type="primary" @click="submitForm('formDate')"
              >确认</el-button
            >
            <router-link to="/sgumanager/template/list" class="ml-10"
              ><el-button>取消</el-button></router-link
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "templateEdit",
  data: function() {
    return {
      request: {
        templateName: "",
        valid: 1
      },
      rules: {
        templateName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        valid: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  created: function() {
    this.getTemaplateInfo();
  },
  methods: {
    getTemaplateInfo: function() {
      var self = this;
      var obj = JSON.parse(window.sessionStorage.getItem("skuView"));
      self.request.templateName = obj.templateName;
      self.request.valid = obj.valid + "";
    },
    submitForm(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          let store = this.$store;
          let id = self.$route.params.id;
          let jsondata = Object.assign(self.request, {
            token: store.state.token,
            tokenid: store.state.tokenid,
            id: id
          });

          this.$httpUtil.post({
            url: "/distributionTemplate/update.json",
            contentType: "form",
            data: jsondata,
            succ: function(data) {
              if (data !== "error") {
                self.$message({
                  message: "修改成功",
                  type: "success"
                });
                setTimeout(
                  () =>
                    self.$router.push({ path: "/sgumanager/template/list" }),
                  1500
                );
              }
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
