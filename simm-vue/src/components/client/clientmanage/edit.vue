<template>
  <section class="content-section">
    <div class="row">
      <el-form
        :model="infoData"
        :rules="rules"
        ref="infoData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-col :sm="10" :md="8">
          <el-form-item label="城市" prop="supply_user_level_id">
            <el-select
              disabled
              placeholder="请选择"
              v-model="infoData.supply_user_level_id"
              filterable
            >
              <el-option
                v-for="item in levelData"
                :key="item.id"
                :label="item.level_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货人手机">
            <el-input v-model="infoData.receiver_mobile"></el-input>
          </el-form-item>
          <el-form-item label="收货人姓名">
            <el-input v-model="infoData.receiver_name"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="addressArr">
            <el-cascader
              expand-trigger="hover"
              :options="addressJson"
              v-model="infoData.addressArr"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address_detail">
            <el-input v-model="infoData.address_detail"></el-input>
          </el-form-item>
          <el-form-item label="邮编">
            <el-input v-model="infoData.zip_code"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="user_name">
            <el-input v-model="infoData.user_name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :sm="10" :md="8">
          <el-form-item label="负责人姓名" prop="contact_person">
            <el-input v-model="infoData.contact_person"></el-input>
          </el-form-item>
          <!-- <el-form-item label="联系人职位" >
            <el-input v-model="infoData.contact_position"></el-input>
          </el-form-item>-->
          <el-form-item label="联系人手机" prop="contact_phone">
            <el-input v-model="infoData.contact_phone"></el-input>
          </el-form-item>
          <el-form-item label="联系人email">
            <el-input v-model="infoData.contact_email"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="infoData.contact_note"></el-input>
          </el-form-item>
          <el-form-item label="微信昵称" prop="wx_nickname">
            <el-input v-model="infoData.wx_nickname"></el-input>
          </el-form-item>
          <el-form-item label="微信账号" prop="wx_username">
            <el-input v-model="infoData.wx_username"></el-input>
          </el-form-item>
          <el-form-item label="账号状态" prop="status">
            <el-select v-model="infoData.status" placeholder="请选择">
              <el-option label="未启用" value="0"></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="过期" value="2"></el-option>
              <el-option label="禁用" value="3"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="账号类型">
            <el-input :value="infoData.is_supply_user==0?'普通订货账号':'供应商订货账号'" disabled></el-input>
          </el-form-item>-->
        </el-col>
        <el-col :span="20">
          <el-form-item>
            <el-button type="primary" @click="saveFun('infoData')" :disabled="isSubmit">保存</el-button>
            <router-link to="/client/clientmanage/list" class="ml-10">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import addressJson from "../../plugin/address.json";
export default {
  name: "SupplyClientManageEdit",
  data: function() {
    var validateTime = (rule, value, callback) => {
      var self = this;
      if (value === undefined) {
        callback(new Error("请输入时间"));
      } else if (
        self.infoData.validity_end_date < self.infoData.validity_start_date
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
      response: "",
      isSubmit: false,
      addressJson: addressJson,
      infoData: {},
      levelData: [],
      rules: {
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
            message: "请输入收货地址",
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
            type: "number",
            message: "请输入客户类型",
            trigger: "change"
          }
        ],
        supply_user_level_id: [
          {
            required: true,
            type: "number",
            message: "请输入客户等级",
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
            message: "请输入联系人姓名",
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
    this.getInfoData();
  },
  methods: {
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
    getInfoData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/userinfo/view.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: this.$route.params.id
        },
        function(data) {
          self.infoData = data.data || {};
          self.infoData.status = String(self.infoData.status);
          self.infoData.user_type = self.infoData.user_type;
          self.infoData.addressArr = [
            data.data.address_province_id || "",
            data.data.address_city_id || "",
            data.data.address_district_id || ""
          ];
        }
      );
    },
    saveFun: function(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          var store = this.$store;
          self.infoData.address_province_id = self.infoData.addressArr[0] || "";
          self.infoData.address_city_id = self.infoData.addressArr[1] || "";
          self.infoData.address_district_id = self.infoData.addressArr[2] || "";
          var level = self.levelData.find(
            a => a.id == self.infoData.supply_user_level_id
          );
          if (level) {
            self.infoData.company_name = level.level_name;
          }
          var province = (self.addressJson || []).find(
            a => a.value == self.infoData.address_province_id
          );
          if (province) {
            self.infoData.address_province = province.label;
            var city = (province.children || []).find(
              a => a.value == self.infoData.address_city_id
            );
            if (city) {
              self.infoData.address_city = city.label;
              var district = (city.children || []).find(
                a => a.value == self.infoData.address_district_id
              );
              if (district) {
                self.infoData.address_district = district.label;
              } else {
                self.infoData.address_district = "";
              }
            } else {
              self.infoData.address_city = "";
              self.infoData.address_district = "";
            }
          }
          var jsondata = Object.assign({}, self.infoData, {
            token: store.state.token,
            tokenid: store.state.tokenid
          });
          delete jsondata.create_at;
          delete jsondata.update_at;
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
          if (!self.infoData.birthday) {
            jsondata.birthday = "";
          }
          self.$parent.callAPI2(
            "POST",
            "/userinfo/doupdate.json",
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
              }
            }
          );
        } else {
          self.$message({
            message: "请将信息填写完整！",
            type: "error"
          });
          return false;
        }
      });
    }
  }
};
</script>
