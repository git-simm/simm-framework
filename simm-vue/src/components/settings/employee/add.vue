<template>
  <section class="content-section" id="proadd">
    <div class="row">
      <div class="col-sm-6">
        <el-form
          :model="request"
          :rules="rules"
          ref="formDate"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="登录账号" prop="admin_user_no">
            <el-input v-model="request.admin_user_no"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="admin_user_name">
            <el-input v-model="request.admin_user_name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="admin_user_password">
            <el-input type="password" v-model="request.admin_user_password"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="admin_user_mobile">
            <el-input v-model="request.admin_user_mobile"></el-input>
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="request.email"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="user_type">
            <el-radio-group v-model="request.user_type">
              <el-radio
                v-for="(item, index) in $cacheUtil.getDic('user_role_type')"
                :key="'userType' + index"
                :label="item.key"
              >{{ item.value }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="所属分站" prop="supply_site_id" v-if="this_user_type  === 2">
            <el-select v-model.number="request.supply_site_id" placeholder="请选择">
              <el-option v-for="item in siteData" :label="item.site_name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="关联">
            <el-col :span="10">
              <el-select
                v-model="siteValue"
                filterable
                clearable
                placeholder="请选择省份"
                @change="changeSite"
              >
                <el-option
                  v-for="item in siteData"
                  :key="item.id"
                  :label="item.site_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-select v-model="levelValue" multiple clearable placeholder="请选择城市">
                <el-option
                  v-for="item in levelData"
                  :key="item.admin_shop_id"
                  :label="item.level_name"
                  :value="item.admin_shop_id"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="账号权限">
            <el-checkbox-group v-model="selroleIds">
              <template v-for="item in roleData">
                <el-checkbox
                  :label="item.id"
                  :key="'admin_role_name' + item.id"
                >{{ item.admin_role_name }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate')">确认</el-button>
            <el-button @click="resetForm('formDate')">重置</el-button>
            <a href="javascript:;" class="ml-10" @click="$back">
              <el-button>取消</el-button>
            </a>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: function() {
    var checkmobile = (rule, value, callback) => {
      if (!/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      isSubmit: false,
      groupData: [],
      siteData: [],
      levelData: [],
      groupValue: "",
      siteValue: "",
      levelValue: [],
      roleData: [],
      siteData: [],
      selroleIds: [],
      this_user_type: "",
      request: {
        admin_user_no: "",
        admin_user_name: "",
        admin_user_mobile: "",
        admin_user_password: "",
        admin_user_type: "",
        user_type: null,
        supply_site_id: null,
        email: "",
        status: "1",
        roleIds: ""
      },
      rules: {
        admin_user_no: [
          {
            required: true,
            message: "请输入帐号",
            trigger: "blur"
          },
          {
            min: 5,
            max: 25,
            message: "长度在 5 到 25 个字符",
            trigger: "blur"
          }
        ],
        user_type: [
          {
            type: "number",
            required: true,
            message: "请输入用户类型",
            trigger: "change"
          }
        ],
        admin_user_name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 25,
            message: "长度在 5 到 25 个字符",
            trigger: "blur"
          }
        ],
        admin_user_password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 25,
            message: "长度在 5 到 25 个字符",
            trigger: "blur"
          }
        ],
        admin_user_mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkmobile,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        supply_site_id: [
          {
            required: true,
            type: "number",
            message: "请选择分站",
            trigger: "blur"
          }
        ],
        adminShopIds: [
          {
            required: true,
            type: "number",
            message: "请选择关联",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    this.getTypeData();
    this.getRoleData();
    this.getQueryDataTwo();
  },
  methods: {
    valid(formData) {
      if (formData.user_type == 1) {
        if (!formData.supply_site_id) {
          this.$commonUtil.valid.throwEx("省级账号必须关联省份");
        }
      } else if (formData.user_type == 2) {
        if ((formData.adminShopIdList || []).length != 1) {
          this.$commonUtil.valid.throwEx("城市账号必须且只能关联一个城市");
        }
      }
    },
    submitForm(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          var store = this.$store;
          self.request.roleIds = self.selroleIds.toString();
          var jsondata = Object.assign(self.request, {
            token: store.state.token,
            tokenid: store.state.tokenid
          });
          if (self.siteValue == "") {
            jsondata.supply_site_id = self.$route.params.supply_site_id || "";
          } else {
            jsondata.supply_site_id = self.siteValue || "";
          }
          jsondata.adminShopIdList = self.levelValue;
          jsondata.adminShopIds = self.levelValue.toString();
          self.valid(jsondata);
          self.$httpUtil.post({
            url: "/adminUser/doAdd.json",
            data: jsondata,
            contentType: "form", //
            succ: function(data) {
              self.$message({
                message: "提交成功",
                type: "success"
              });
              setTimeout(
                () =>
                  self.$router.push({
                    path: "/settings/employee/list"
                  }),
                1500
              );
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getRoleData: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/adminRole/getAvailableRole.json",
        data: {
          admin_user_type: self.request.admin_user_type
        },
        contentType: "form", //
        succ: function(data) {
          self.roleData = data.data;
        }
      });
    },
    getSiteData: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/userinfo/get_supply_site_info.json",
        data: {},
        contentType: "form", //
        succ: function(data) {
          self.siteData = data.data;
        }
      });
    },
    getTypeData: function() {
      var self = this;
      var store = this.$store;
      if (store.state.userInfo.admin_user_type === 1) {
        self.request.admin_user_type = 1;
        self.this_user_type = 1;
      }
      if (store.state.userInfo.admin_user_type === 2) {
        self.request.admin_user_type = 3;
        self.this_user_type = 2;
        self.getSiteData();
      }
      if (store.state.userInfo.admin_user_type === 3) {
        self.request.admin_user_type = 3;
        self.this_user_type = 3;
        self.request.supply_id = store.state.userInfo.supply_id;
        self.request.supply_site_id = store.state.userInfo.supply_site_id;
      }
    },

    changeSite() {
      this.getQueryDataThree();
    },

    getQueryDataTwo: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/adminuser/ref/shop/querycitydata.json?id=&type=2",
        succ: function(data) {
          self.siteData = data.data;
        }
      });
    },
    getQueryDataThree: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/adminuser/ref/shop/querycitydata.json",
        data: { id: self.siteValue, type: 3 },
        contentType: "form", //
        succ: function(data) {
          self.levelData = data.data;
        }
      });
    }
  }
};
</script>
