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
          <el-form-item label="邮编" prop="zip_code">
            <el-input v-model="infoData.zip_code"></el-input>
          </el-form-item>
          <el-form-item label="默认地址" prop="is_default">
            <el-select v-model="infoData.is_default" placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :sm="10" :md="8">
          <el-form-item label="收货人手机" prop="receiver_mobile">
            <el-input v-model="infoData.receiver_mobile"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address_detail">
            <el-input v-model="infoData.address_detail"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="infoData.status" placeholder="请选择">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
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
  name: "DeliveryEdit",
  data: function() {
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
      infoData: { user_id: null, is_default: 0, status: 1 },
      levelData: [],
      rules: {
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
        receiver_mobile: [
          {
            required: true,
            message: "请输入收货人手机号",
            trigger: "blur"
          }
        ],
        is_default: [
          {
            required: true,
            type: "number",
            message: "请设置是否默认地址",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            type: "number",
            message: "请设置是否有效",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    this.getLevelData();
    if (this.$route.path.includes("/add")) {
      this.infoData.user_id = this.$route.params.userId;
    } else if (this.$route.path.includes("/edit")) {
      this.getInfoData();
    }
  },
  methods: {
    getLevelData: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyUserLevel/list.json",
        data: {
          status: 1,
          pagesize: 9999
        },
        contentType: "form", //json,form,multipart
        succ: function(data) {
          self.levelData = data.data;
        }
      });
    },
    getInfoData: function() {
      var self = this;
      var store = this.$store;
      self.$httpUtil.post({
        url: "/userreceiveinfo/detail.json",
        data: { id: this.$route.params.id },
        contentType: "form",
        succ: function(data) {
          self.infoData = data.data;
          self.infoData.addressArr = [
            data.data.address_province_id || "",
            data.data.address_city_id || "",
            data.data.address_district_id || ""
          ];
        }
      });
    },
    saveFun: function(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.infoData.address_province_id = self.infoData.addressArr[0] || "";
          self.infoData.address_city_id = self.infoData.addressArr[1] || "";
          self.infoData.address_district_id = self.infoData.addressArr[2] || "";
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
          var jsondata = Object.assign({}, self.infoData);
          delete jsondata.create_at;
          delete jsondata.update_at;
          delete jsondata.addressArr;
          //存在id,则为更新模式
          var url = "/userreceiveinfo/add.json";
          if (jsondata.id) {
            url = "/userreceiveinfo/update.json";
          }
          self.$httpUtil.post({
            url: url,
            data: jsondata,
            succ: function(data) {
              //返回列表页面
              self.$message({
                message: "保存成功！",
                type: "success"
              });
              setTimeout(() => self.$back(), 1500);
            }
          });
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
