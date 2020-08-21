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
          <el-form-item label="菜单名称：" prop="admin_menu_name">
            <el-input v-model="request.admin_menu_name"></el-input>
          </el-form-item>
          <el-form-item label="菜单URL：" prop="admin_menu_url">
            <el-input v-model="request.admin_menu_url"></el-input>
          </el-form-item>
          <el-form-item label="跳转方式：" prop="menu_type">
            <el-select
              v-model="request.menu_type"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in menu_type"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input v-model.number="request.sort"></el-input>
          </el-form-item>
          <el-form-item label="父节点：" prop="parent_menu_id">
            <el-select
              v-model="request.parent_menu_id"
              clearable
              placeholder="请选择"
            >
              <el-option label="父节点" value=""></el-option>
              <el-option
                v-for="item in parentMenu"
                :label="item.admin_menu_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="request.status" clearable placeholder="请选择">
              <el-option
                v-for="item in status"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate')"
              >确认</el-button
            >
            <el-button @click="resetForm('formDate')">重置</el-button>
            <router-link to="/settings/menu/list" class="ml-10"
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
  name: "SettingsMenuEdit",
  data: function() {
    return {
      menu_type: [
        {
          id: 1,
          label: "系统内跳转"
        },
        {
          id: 2,
          label: "系统外跳转"
        }
      ],
      status: [
        {
          id: 1,
          label: "启用"
        },
        {
          id: 0,
          label: "禁用"
        }
      ],
      request: {
        admin_menu_name: "",
        admin_menu_url: "",
        menu_type: null,
        parent_menu_id: null,
        sort: null,
        status: null
      },
      parentMenu: null,
      rules: {
        admin_menu_name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        admin_menu_url: [
          { required: true, message: "请输入URL", trigger: "blur" }
        ],
        menu_type: [
          {
            required: true,
            type: "number",
            message: "请选择跳转方式",
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            type: "number",
            message: "请输入排序",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            type: "number",
            message: "请选择菜单状态",
            trigger: "blur"
          }
        ]
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
          let id = self.$route.params.id;
          let jsondata = Object.assign(self.request, {
            token: store.state.token,
            tokenid: store.state.tokenid,
            id: id
          });
          this.$parent.callAPI(
            "POST",
            "/adminMenu/save.json",
            jsondata,
            function(data) {
              if (data !== "error") {
                self.$message({
                  message: "添加成功",
                  type: "success"
                });
                setTimeout(
                  () => self.$router.push({ path: "/settings/menu/list" }),
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
      var id = self.$route.params.id;
      this.$parent.callAPI(
        "GET",
        "/adminMenu/update.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: id
        },
        function(data) {
          self.parentMenu = data.data.parentList;
          self.request = data.data.detail;
        }
      );
    }
  }
};
</script>
