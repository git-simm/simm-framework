<template>
  <section class="content-section" id="proadd">
    <div class="row">
      <div class="col-sm-5">
        <el-form
          :model="request"
          :rules="rules"
          ref="formDate"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="按钮名称：" prop="admin_menu_button_name">
            <el-input v-model="request.admin_menu_button_name"></el-input>
          </el-form-item>
          <el-form-item label="按钮URL：" prop="admin_menu_button_url">
            <el-input v-model="request.admin_menu_button_url"></el-input>
          </el-form-item>
          <el-form-item label="所属菜单：" prop="admin_menu_id">
            <el-select
              v-model="request.admin_menu_id"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in parentMenu"
                :label="item.admin_menu_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="request.status" clearable placeholder="请选择">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate')"
              >确认</el-button
            >
            <el-button @click="resetForm('formDate')">重置</el-button>
            <router-link to="/settings/button/list" class="ml-10"
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
  name: "SettingsButtonAdd",
  data: function() {
    return {
      request: {
        admin_menu_button_name: "",
        admin_menu_button_url: "",
        admin_menu_id: null,
        sort: "0",
        status: "1"
      },
      parentMenu: null,
      rules: {
        admin_menu_button_name: [
          { required: true, message: "请输入按钮名称", trigger: "blur" }
        ],
        admin_menu_button_url: [
          { required: true, message: "请输入URL", trigger: "blur" }
        ],
        admin_menu_id: [
          {
            required: true,
            type: "number",
            message: "请选择所属菜单",
            trigger: "change"
          }
        ],
        status: [{ required: true, message: "请选择按钮状态", trigger: "blur" }]
      }
    };
  },
  created: function() {
    this.getParentMenu();
  },
  methods: {
    submitForm(formName) {
      var self = this;
      Object.keys(self.request).forEach(key => {
        var value = self.request[key];
        self.request[key] = value && value.trim ? value.trim() : value;
      });
      self.$refs[formName].validate(valid => {
        if (valid) {
          let store = this.$store;
          let jsondata = Object.assign(self.request, {
            token: store.state.token,
            tokenid: store.state.tokenid
          });
          this.$parent.callAPI(
            "POST",
            "/adminMenuButton/save.json",
            jsondata,
            function(data) {
              if (data !== "error") {
                self.$message({
                  message: "添加成功",
                  type: "success"
                });
                setTimeout(
                  () => self.$router.push({ path: "/settings/button/list" }),
                  1500
                );
              }
            }
          );
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getParentMenu: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/adminMenuButton/add.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.parentMenu = data.data.menuList;
        }
      );
    }
  }
};
</script>
