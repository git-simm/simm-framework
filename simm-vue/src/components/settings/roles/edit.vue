<template>
  <section class="content-section" id="proadd">
    <div class="row">
      <div class="col-sm-8">
        <el-form
          :model="request"
          :rules="rules"
          ref="formDate"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色编码：" prop="admin_role_no">
                <el-input v-model="request.admin_role_no"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色名称：" prop="admin_role_name">
                <el-input v-model="request.admin_role_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色说明：" prop="admin_role_desc">
                <el-input v-model="request.admin_role_desc"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色类型：" prop="admin_role_type">
                <el-select
                  v-model="request.admin_role_type"
                  placeholder="请选择"
                >
                  <el-option label="平台级可授角色" value="1"></el-option>
                  <el-option label="供应商可授角色" value="2"></el-option>
                  <el-option label="分站可授角色" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="角色状态：" prop="status">
            <el-switch
              v-model="request.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="request.status ? `启用` : `禁用`"
            ></el-switch>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单权限：">
                <div style="height:500px;overflow:auto;">
                  <el-tree
                    :data="roleData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    highlight-current
                    auto-expand-parent
                    :default-expanded-keys="menuButtonMap"
                    :props="defaultProps"
                  ></el-tree>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资源权限：">
                <div style="height:500px;overflow:auto;">
                  <el-tree
                    :data="resourceData"
                    show-checkbox
                    node-key="id"
                    ref="sourceTree"
                    highlight-current
                    auto-expand-parent
                    :default-expanded-keys="resourceCheckMap"
                    :props="defaultProps"
                  ></el-tree>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate')"
              >确认</el-button
            >
            <el-button @click="resetForm('formDate')">重置</el-button>
            <router-link to="/settings/roles/list" class="ml-10">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "SupplySettingsRolesEdit",
  data: function() {
    return {
      roleData: [],
      resourceData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      siteData: [],
      selroleIds: [],
      this_user_type: "",
      request: {
        admin_role_name: "",
        admin_role_no: "",
        admin_role_desc: "",
        admin_role_type: ""
      },
      menuButtonMap: [],
      resourceCheckMap: [],
      oldResourceMap: [],
      rules: {
        admin_role_name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ],
        admin_role_type: [
          {
            required: true,
            message: "请选择角色类型",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    this.getRoleData();
  },
  methods: {
    submitForm(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          let store = this.$store;
          let menu_button_ids = this.$refs.tree.getCheckedKeys().join(",");
          let resource_checked_ids = this.$refs.sourceTree
            .getCheckedKeys()
            .join(",");
          let jsondata = Object.assign({}, self.request, {
            token: store.state.token,
            tokenid: store.state.tokenid,
            menu_button_ids: menu_button_ids,
            resourceCheckedIds: resource_checked_ids,
            oldResourceIds: self.oldResourceMap.join(",")
          });
          jsondata.status = Number(self.request.status);
          this.$parent.callAPI(
            "POST",
            "/adminRole/doupdate.json",
            jsondata,
            function(data) {
              self.$message({
                message: "编辑成功",
                type: "success"
              });
              setTimeout(
                () =>
                  self.$router.push({
                    path: "/settings/roles/list"
                  }),
                1500
              );
            }
          );
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.tree.setCheckedKeys([]);
    },
    getRoleData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/adminMenu/get_total_menu.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.roleData = data.data;
          self.getAllCategory();
          self.getDetail();
        }
      );
    },
    getAllCategory() {
      var self = this;
      var store = this.$store;
      var jsondata = {};
      jsondata = {
        token: store.state.token,
        tokenid: store.state.tokenid
      };
      this.$httpUtil.post({
        url: "/adminRole/getRoleResource.json",
        data: jsondata,
        contentType: "form", //json,form,multipart
        succ: function(data) {
          self.resourceData = data.data;
        }
      });
    },
    getDetail: function() {
      var self = this;
      var store = this.$store;
      var id = self.$route.params.id;
      this.$parent.callAPI(
        "GET",
        "/adminRole/getDetail.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: id
        },
        function(data) {
          self.request = data.data.roleMap;
          self.request.status = Boolean(
            (data.data.roleMap && data.data.roleMap.status) || null
          );
          self.request.admin_role_type = String(self.request.admin_role_type);
          self.menuButtonMap = data.data.menuButtonMap;
          self.menuButtonMap = self.menuButtonMap || [];
          self.$refs.tree.setCheckedKeys(self.menuButtonMap);
          var categoryList = data.data.categoryList;
          categoryList = categoryList || [];
          self.resourceCheckMap = categoryList;
          self.oldResourceMap = categoryList;
          self.$refs.sourceTree.setCheckedKeys(self.oldResourceMap);
        }
      );
    }
  }
};
</script>
