<template>
  <section class="content-section">
    <el-row>
      <el-form
        :model="request"
        :rules="rules"
        ref="request"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-col :sm="10" :md="8">
          <el-form-item label="城市" prop="supply_user_level_id">
            <el-select
              clearable
              placeholder="请选择"
              v-model="request.supply_user_level_id"
              filterable
              @change="selectName"
            >
              <el-option
                v-for="item in levelData"
                :key="item.id"
                :label="item.level_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货人手机" prop="receiver_mobile">
            <el-input v-model="request.receiver_mobile"></el-input>
          </el-form-item>
          <el-form-item label="收货人姓名" prop="receiver_name">
            <el-input v-model="request.receiver_name"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="addressArr">
            <el-cascader expand-trigger="hover" :options="addressJson" v-model="request.addressArr"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address_detail">
            <el-input v-model="request.address_detail"></el-input>
          </el-form-item>
          <el-form-item label="邮编" prop="zip_code">
            <el-input v-model="request.zip_code"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="user_name">
            <el-input v-model="request.user_name"></el-input>
          </el-form-item>
          <el-form-item label="账号状态" prop="status">
            <el-select v-model="request.status" placeholder="请选择">
              <el-option label="未启用" value="0"></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="过期" value="2"></el-option>
              <el-option label="禁用" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :sm="10" :md="8">
          <el-form-item label="负责人姓名" prop="contact_person">
            <el-input v-model="request.contact_person"></el-input>
          </el-form-item>
          <!-- <el-form-item label="联系人职位" >
            <el-input v-model="request.contact_position"></el-input>
          </el-form-item>-->
          <el-form-item label="联系人手机" prop="contact_phone">
            <el-input v-model="request.contact_phone"></el-input>
          </el-form-item>
          <el-form-item label="联系人email" prop="contact_email">
            <el-input v-model="request.contact_email"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="request.contact_note"></el-input>
          </el-form-item>
          <el-form-item label="微信昵称" prop="wx_nickname">
            <el-input v-model="request.wx_nickname"></el-input>
          </el-form-item>
          <el-form-item label="微信账号" prop="wx_username">
            <el-input v-model="request.wx_username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="text" :disabled="true" v-model="request.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item>
            <el-button type="primary" @click="saveFun('request')">保存</el-button>
            <router-link to="/client/clientmanage/list" class="ml-10">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
import addressJson from "../../plugin/address.json";
export default {
  name: "SupplyClientManageAdd",
  data: function() {
    var validateTime = (rule, value, callback) => {
      var self = this;
      if (value === undefined) {
        callback(new Error("请输入时间"));
      } else if (
        self.request.validity_end_date < self.request.validity_start_date
      ) {
        callback(new Error("结束时间不能小于开始时间"));
      } else {
        callback();
      }
    };
    var checkmobile = (rule, value, callback) => {
      if (!/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      isSubmit: false,
      addressJson: addressJson,
      levelData: [],
      siteData: [],
      request: {
        supply_site_id: "",
        addressArr: [],
        user_number: "",
        company_name: "",
        address_province_id: "",
        address_city_id: "",
        address_district_id: "",
        address_detail: "",
        zip_code: "",
        birthday: "",
        user_type: "1",
        supply_user_level_id: "",
        validity_end_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 10)
        ),
        validity_start_date: new Date(),
        contact_person: "",
        contact_position: "",
        contact_phone: "",
        contact_email: "",
        contact_note: "",
        password: "dhxt888",
        user_name: "",
        receiver_mobile: "",
        receiver_name: "",
        status: "1",
        wx_nickname: "",
        wx_username: "",
        admin_shop_id: ""
      },
      rules: {
        supply_site_id: [
          {
            required: true,
            type: "number",
            message: "请输入所属分站",
            trigger: "change"
          }
        ],
        contact_email: [
          {
            required: true,
            message: "请输入联系人email",
            trigger: "blur"
          }
        ],
        zip_code: [
          {
            required: true,
            message: "请输入邮编",
            trigger: "blur"
          }
        ],
        company_name: [
          {
            required: true,
            message: "请输入客户名称",
            trigger: "blur"
          }
        ],
        addressArr: [
          {
            required: true,
            type: "array",
            message: "请选择收货地址",
            trigger: "change"
          }
        ],
        address_detail: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          }
        ],
        user_type: [
          {
            required: true,
            message: "请输入客户类型",
            trigger: "change"
          }
        ],
        supply_user_level_id: [
          {
            required: true,
            type: "number",
            message: "请输入城市等级",
            trigger: "change"
          }
        ],
        validity_start_date: [
          {
            type: "date",
            validator: validateTime,
            trigger: "change"
          }
        ],
        validity_end_date: [
          {
            type: "date",
            validator: validateTime,
            trigger: "change"
          }
        ],
        contact_person: [
          {
            required: true,
            message: "请输入负责人姓名",
            trigger: "blur"
          }
        ],
        contact_phone: [
          {
            required: true,
            message: "请输入联系人手机",
            trigger: "blur"
          },
          {
            validator: checkmobile,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        user_name: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        receiver_mobile: [
          {
            required: true,
            message: "请输入收货人手机号",
            trigger: "blur"
          },
          {
            validator: checkmobile,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        receiver_name: [
          {
            required: true,
            message: "请输入收货人姓名",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请输入账号状态",
            trigger: "change"
          }
        ]
      }
    };
  },
  created: function() {
    this.getLevelData();
    this.getSiteData();
  },
  methods: {
    selectName(rule, value, callback) {
      this.levelData.forEach(ele => {
        if (ele.id == rule) {
          this.request.company_name = ele.level_name;
          this.request.admin_shop_id = ele.admin_shop_id;
        }
      });
    },
    getLevelData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/supplyUserLevel/list.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          status: 1,
          pagesize: 9999
        },
        function(data) {
          self.levelData = data.data;
        }
      );
    },
    getSiteData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/userinfo/get_supply_site_info.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.siteData = data.data;
        }
      );
    },
    saveFun(formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.isSubmit = true;
          var store = this.$store;
          self.request.address_province_id = self.request.addressArr[0] || "";
          self.request.address_city_id = self.request.addressArr[1] || "";
          self.request.address_district_id = self.request.addressArr[2] || "";
          var jsondata = Object.assign({}, self.request, {
            token: store.state.token,
            tokenid: store.state.tokenid
          });
          delete jsondata.addressArr;
          typeof jsondata.validity_start_date === "object" &&
            (jsondata.validity_start_date = moment(
              jsondata.validity_start_date
            ).format("YYYY-MM-DD 00:00:00"));
          typeof jsondata.validity_end_date === "object" &&
            (jsondata.validity_end_date = moment(
              jsondata.validity_end_date
            ).format("YYYY-MM-DD 00:00:00"));
          typeof jsondata.birthday === "object" &&
            (jsondata.birthday = moment(jsondata.birthday).format(
              "YYYY-MM-DD 00:00:00"
            ));
          if (!jsondata.birthday) {
            jsondata.birthday = "";
          }
          self.$parent.callAPI2(
            "POST",
            "/userinfo/doadd.json",
            jsondata,
            function(data) {
              if (data.resultCode == 1000) {
                self.$message({
                  message: "保存成功！",
                  type: "success"
                });
                setTimeout(
                  () =>
                    self.$router.push({
                      path: "/client/clientmanage/list"
                    }),
                  1500
                );
                self.isSubmit = false;
              } else {
                self.isSubmit = false;
              }
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>
