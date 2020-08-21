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
          <el-form-item label="登录账号">{{ admin_user_no }}</el-form-item>
          <el-form-item label="姓名" prop="admin_user_name">
            <el-input v-model="request.admin_user_name"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="admin_user_mobile">
            <el-input v-model="request.admin_user_mobile"></el-input>
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="request.email"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="user_type">
            <el-radio-group v-model.number="request.user_type">
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
            <!-- <el-col :span="8">
              <el-select v-model="groupValue" clearable placeholder="请选择区域" @change="changeGroup">
                <el-option
                  v-for="item in groupData"
                  :key="item.id"
                  :label="item.group_name"
                  :value="item.id"
                  >
                </el-option>
              </el-select>
            </el-col>-->
            <el-col :span="8">
              <el-select
                v-model="siteValue"
                filterable
                clearable
                placeholder="请选择省级"
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
            <el-col :span="8">
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
          <el-form-item label="状态" prop="status">
            <el-select v-model="request.status" placeholder="请选择">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate')">确认</el-button>
            <el-button @click="resetForm('formDate')">重置</el-button>
            <router-link to="/settings/employee/list" class="ml-10">
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
      admin_user_no: "",
      admin_user_type: "",
      request: {
        id: "",
        admin_user_name: "",
        admin_user_mobile: "",
        email: "",
        roleIds: "",
        user_type: null,
        supply_site_id: "",
        status: ""
      },
      rules: {
        admin_user_name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 25,
            message: "长度在 2 到 25 个字符",
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
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    var self = this;
    this.getTypeData();
    this.getRoleData();
    this.getQueryDataTwo();
    this.getInfoData(() => {
      self.getQueryDataThree();
    });
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
          var self = this;
          self.request.roleIds = self.selroleIds.toString();
          self.request.adminShopIds = self.levelValue.toString();
          self.request.supply_site_id = self.siteValue || "";
          self.request.group_id = self.groupValue || "";
          // if (self.levelValue.length != 0) {
          //   self.request.admin_user_type = 3
          // }
          self.request.adminShopIdList = self.levelValue;
          self.valid(self.request);
          this.$httpUtil.post({
            url: "/adminUser/doUpdate.json",
            data: self.request,
            contentType: "form", //
            succ: function(data) {
              self.$message({
                message: "提交成功",
                type: "success"
              });
              self.$router.push({
                path: "/settings/employee/list"
              });
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
          admin_user_type: self.admin_user_type
        },
        contentType: "form", //
        succ: function(data) {
          self.roleData = data.data;
        }
      });
    },
    getInfoData: function(callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/adminUser/update.json",
        data: {
          id: this.$route.params.id
        },
        contentType: "form", //
        succ: function(data) {
          var redata = data.data;
          self.request.id = redata.id;
          self.request.admin_user_name = redata.admin_user_name;
          self.request.email = redata.email;
          self.request.admin_user_mobile = redata.admin_user_mobile;
          self.request.status = redata.status.toString();
          self.request.supply_site_id = redata.supply_site_id;
          self.request.user_type = redata.user_type;
          self.admin_user_no = redata.admin_user_no;
          self.levelValue = redata.adminShopIds;
          self.groupValue = redata.group_id;
          self.siteValue = redata.supply_site_id;
          if (redata.roleIds !== null) {
            self.request.roleIds = redata.roleIds;
            var strselroleIds = data.data.roleIds.split(",");
            self.selroleIds = strselroleIds.map(function(data) {
              //字符转换成数值
              return +data;
            });
          }
          if (callback) {
            callback();
          }
        }
      });
    },
    getSiteData: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/userinfo/get_supply_site_info.json",
        data: {
          supply_id: 1
        },
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
        self.admin_user_type = 1;
        self.this_user_type = 1;
      }
      if (store.state.userInfo.admin_user_type === 2) {
        self.admin_user_type = 3;
        self.this_user_type = 2;
        self.getSiteData();
      }
      if (store.state.userInfo.admin_user_type === 3) {
        self.admin_user_type = 3;
        self.this_user_type = 3;
      }
    },
    changeGroup() {
      this.getQueryDataTwo();
    },
    changeSite() {
      this.getQueryDataThree();
    },
    getQueryDataTwo: function() {
      var self = this;
      this.$httpUtil.post({
        url: `/adminuser/ref/shop/querycitydata.json?id=${self.groupValue ||
          ""}&type=2`,
        contentType: "form", //
        succ: function(data) {
          self.siteData = data.data;
        }
      });
    },
    getQueryDataThree: function() {
      var self = this;
      this.$httpUtil.post({
        url: `/adminuser/ref/shop/querycitydata.json?id=${self.siteValue ||
          ""}&type=3`,
        contentType: "form", //
        succ: function(data) {
          self.levelData = data.data || [];
          self.levelValue = self.levelValue.filter(a =>
            self.levelData.some(city => city.admin_shop_id == a)
          );
        }
      });
    }
  }
};
</script>
