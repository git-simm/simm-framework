<template>
  <section class="content-section supplier-cj-content">
    <el-row>
      <el-form :model="data" :rules="rules" ref="data" label-width="140px" class="demo-ruleForm">
        <h4 class="text-theme">基本信息</h4>
        <el-col :span="10">
          <el-form-item label="供应商编码">
            <el-input v-model.trim="data.supply_number" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商名称" prop="supply_name">
            <el-input v-model.trim="data.supply_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contact_person">
            <el-input v-model.trim="data.contact_person"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="contact_phone">
            <el-input v-model.trim="data.contact_phone"></el-input>
          </el-form-item>
          <el-form-item label="结算邮箱" prop="contact_email">
            <el-input v-model.trim="data.contact_email"></el-input>
          </el-form-item>
          <el-form-item label="收货邮箱" prop="receive_email">
            <el-input v-model.trim="data.receive_email"></el-input>
          </el-form-item>
          <el-form-item label="是否为蔬果供应商" prop="special_type">
            <el-select v-model="data.special_type" placeholder="请选择">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商类型" prop="supply_identity">
            <el-select v-model="data.supply_identity" clearable placeholder="请选择">
              <el-option label="厂家" value="1"></el-option>
              <el-option label="品牌代理商" value="2"></el-option>
              <el-option label="一级经销商" value="6"></el-option>
              <el-option label="二级经销商" value="7"></el-option>
              <el-option label="农产品原产地" value="8"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="公司地址" prop="addressArr">
            <el-cascader
              expand-trigger="hover"
              :options="addressJson"
              v-model="data.addressArr"
              ref="cascaderAddr"
              @change="onProvincesChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address_detail">
            <el-input v-model.trim="data.address_detail"></el-input>
          </el-form-item>
          <el-form-item label="公司说明">
            <el-input v-model.trim="data.supply_note"></el-input>
          </el-form-item>
          <el-form-item label="保障金" prop="deposit_price">
            <el-input v-model.number="data.deposit_price"></el-input>
          </el-form-item>
          <el-form-item label="供应商账期" prop="settle_day">
            <el-input v-model.trim="data.settle_day">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="供应商类型" prop="type">
          <el-select v-model="data.type" clearable placeholder="请选择">
            <el-option label="厂家" value="1"></el-option>
            <el-option label="品牌代理商" value="2"></el-option>
            <el-option label="经销商" value="3"></el-option>
            <el-option label="合作社" value="4"></el-option>
            <el-option label="个体工商户" value="5"></el-option>
          </el-select>
          </el-form-item>-->
          <el-form-item label="税务身份" prop="tax_identity">
            <el-select v-model="data.tax_identity" clearable placeholder="请选择">
              <el-option label="合作社" value="1"></el-option>
              <el-option label="个体工商户" value="2"></el-option>
              <el-option label="小规模纳税人" value="3"></el-option>
              <el-option label="一般纳税人" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售模式" prop="merchant_model" :disabled="data.audit_status == 1">
            <el-select v-model="data.merchant_model" clearable placeholder="请选择" disabled>
              <el-option
                v-for="(item, index) in $cacheUtil.getDic('settltType')"
                :key="'settltType' + index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="采购供应商">
          <el-switch
            v-model="data.is_purchase"
            :active-text="data.is_purchase ? `是` : `否`"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          </el-form-item>-->
          <!-- <el-form-item label="" v-if="data.supply_type==1">
            <el-checkbox v-model="data.is_create_user" :true-label="1" false-label="0" :disabled="data.is_create_user2==1">允许该供应商购买食享会大品商品</el-checkbox>
          </el-form-item>-->
        </el-col>
        <el-col :span="24">
          <!-- <el-form-item label="服务区域">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            全部
          </el-checkbox>
          <div style="margin: 0;"></div>
          <el-checkbox-group v-model="checkedstatus" @change="handleCheckedCitiesChange">
            <template v-for="item in roleData">
            <el-checkbox :label="item.id">
              {{item.group_name}}</el-checkbox>
            </template>
          </el-checkbox-group>
          </el-form-item>-->
        </el-col>
        <el-col :span="20">
          <h4 class="text-theme">证照信息</h4>
        </el-col>
        <el-col :span="20">
          <p class="upload-cj-txt">上传证照（营业执照副本、食品流通许可证、产品荣誉证书、产品检测报告、其他相关资质）</p>
        </el-col>
        <div class="col-sm-12 uploader-cj-size">
          <!-- prop="businessPic" -->
          <el-form-item>
            <el-upload
              :action="serverURI + '/file/upload.json'"
              :file-list="business_pic"
              list-type="picture-card"
              multiple
              :with-credentials="true"
              :data="tokendata"
              :before-upload="beforeupload"
              :on-success="businessPicSuccess"
              :on-remove="handleRemoveBusinessPic"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <el-col :span="20">
          <p class="upload-cj-txt">上传合同</p>
        </el-col>
        <div class="col-sm-12 uploader-cj-size">
          <!-- prop="contractPic" -->
          <el-form-item>
            <el-upload
              :action="serverURI + '/file/upload.json'"
              :file-list="contract_pic"
              list-type="picture-card"
              multiple
              :with-credentials="true"
              :data="tokendata"
              :before-upload="beforeupload"
              :on-success="contractPicSuccess"
              :on-remove="handleRemoveContractPic"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>

        <el-col :span="20">
          <h4 class="text-theme">账户信息</h4>
        </el-col>
        <el-col :span="10">
          <el-form-item label="打款账号类型" prop="account_type">
            <el-select v-model.number="data.account_type" clearable placeholder="请选择">
              <el-option label="银行" :value="1"></el-option>
              <!--  <el-option label="微信" :value="2"></el-option>-->
              <!-- <el-option label="支付宝" :value="3"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="打款账号名称" prop="account_name">
            <el-input v-model="data.account_name"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" prop="account_bank" v-if="data.account_type == 1">
            <el-input v-model.trim="data.account_bank"></el-input>
          </el-form-item>
          <!-- <el-form-item label="银行详细地址" prop="addressArr2" v-if="data.account_type==1">
            <el-cascader
              expand-trigger="hover" :placeholder="data.account_bank_address"
              :options="addressJson2" :props="{value: 'label'}"
              v-model="data.addressArr2">
            </el-cascader>
          </el-form-item>-->
        </el-col>
        <el-col :span="10">
          <el-form-item label="打款账号号码" prop="account_number">
            <el-input v-model.trim="data.account_number"></el-input>
          </el-form-item>
          <el-form-item label="打款备注" prop="account_note">
            <el-input v-model.trim="data.account_note"></el-input>
          </el-form-item>
          <!-- <el-form-item label="城市代码" prop="addressBankArr" v-if="data.account_type==1">
            <el-cascader
              expand-trigger="hover" :placeholder="data.account_bank_address_code"
              :options="addressBankJson"
              v-model="data.addressBankArr">
            </el-cascader>
          </el-form-item>-->
        </el-col>
        <el-col :span="20">
          <el-form-item>
            <el-button
              type="primary"
              @click="submitFun('data')"
              :disabled="isSave"
              v-if="data.audit_status == 2"
            >保存</el-button>
            <el-button type="primary" @click="saveFun('data')" :disabled="isSubmit">提交</el-button>
            <router-link to="/suplier/auditlist" class="ml-10">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </section>
</template>

<script>
import addressJson from "../plugin/address.json";
import addressJson2 from "../plugin/address2.json";
import addressBankJson from "../plugin/address_bank.json";
export default {
  name: "suplierEdit",
  data: function() {
    var checkmobile = (rule, value, callback) => {
      if (!/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };

    var checkbusiness = (rule, value, callback) => {
      let len = this.business_pic.length;
      if (len != 0) {
        callback();
      } else {
        callback(new Error("请上传证件信息"));
      }
    };
    var checkcontract = (rule, value, callback) => {
      let len = this.contract_pic.length;
      if (len != 0) {
        callback();
      } else {
        callback(new Error("请上传合同"));
      }
    };

    var checkSettleDay = (rule, value, callback) => {
      if (this.data.special_type == "") {
        callback(new Error("请先选择是否为蔬果供应商"));
      } else if (!/^([1-9]\d{0,3}|10000)$/.test(value)) {
        callback(new Error("必须为整数"));
      } else if (this.data.special_type == 0) {
        if (value < 7) {
          callback(new Error("非水果供应商账期最少为7天"));
        } else {
          callback();
        }
      } else if (this.data.special_type == 1) {
        if (value < 3) {
          callback(new Error("水果供应商账期最少为3天"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      isSubmit: false,
      isSave: false,
      serverURI: this.$store.state.serverURI,
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      roleData: [], // 全部服务区域
      checkAll: true,
      checkedstatus: [],
      statusData: [],
      isIndeterminate: true,
      contract_pic: [], // 合同图
      business_pic: [], // 证件图
      data: {},
      addressJson: addressJson,
      addressJson2: addressJson2,
      addressBankJson: addressBankJson,
      rules: {
        businessPic: [
          {
            required: true,
            validator: checkbusiness,
            trigger: "change"
          }
        ],
        contractPic: [
          {
            required: true,
            validator: checkcontract,
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择供应商类型",
            trigger: "change"
          }
        ],
        tax_identity: [
          {
            required: true,
            message: "请选择税务身份",
            trigger: "change"
          }
        ],
        supply_identity: [
          {
            required: true,
            message: "请选择供应商类型",
            trigger: "change"
          }
        ],
        special_type: [
          {
            required: true,
            message: "请选择是否为蔬果供应商",
            trigger: "change"
          }
        ],
        settle_day: [
          {
            validator: checkSettleDay,
            trigger: "change"
          }
        ],
        deposit_price: [
          {
            type: "number",
            required: true,
            message: "必须为整数",
            trigger: "blur"
          }
        ],
        addressArr: [
          {
            required: true,
            type: "array",
            message: "请输入公司地址",
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
        contact_person: [
          {
            required: true,
            message: "请输入联系人姓名",
            trigger: "change"
          }
        ],
        contact_phone: [
          {
            required: true,
            message: "请输入联系人电话",
            trigger: "change"
          },
          {
            validator: checkmobile,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        supply_name: [
          {
            required: true,
            message: "请输入供应商名称",
            trigger: "change"
          }
        ],
        supply_note: [
          {
            required: true,
            message: "请输入公司说明",
            trigger: "change"
          }
        ],
        supply_number: [
          {
            required: true,
            message: "请输入供应商编码",
            trigger: "change"
          }
        ],
        account_type: [
          {
            required: true,
            type: "number",
            message: "请输入打款账号类型",
            trigger: "change"
          }
        ],
        account_name: [
          {
            required: true,
            message: "请输入打款账号名称",
            trigger: "blur"
          }
        ],
        account_bank: [
          {
            required: true,
            message: "请输入开户银行",
            trigger: "blur"
          }
        ],
        contact_email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        receive_email: [
          { required: false, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        account_number: [
          {
            required: true,
            message: "请输入打款账号号码",
            trigger: "blur"
          },
          {
            pattern: /^\d+$/,
            message: "请输入正确的打款账号号码",
            trigger: "blur"
          }
        ],
        merchant_model: [
          {
            type: "number",
            required: true,
            message: "请选择销售模式",
            trigger: "change"
          }
        ]
        // addressBankArr: [{
        //   required: true,
        //   type: 'array',
        //   message: '请输入城市代码',
        //   trigger: 'change'
        // }],
        // addressArr2: [{
        //   required: true,
        //   type: 'array',
        //   message: '请输入银行详细地址',
        //   trigger: 'change'
        // }]
      }
    };
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal.tax_identity == 0) {
        this.data.tax_identity = "";
      }
      if (newVal.supply_identity == 0) {
        this.data.supply_identity = "";
      }
      if (newVal.type == 0) {
        this.data.type = "";
      }
    }
  },
  created: function() {
    this.getInfoData();
  },
  methods: {
    handleCheckAllChange(event) {
      this.checkedstatus = event ? this.statusData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.statusData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.statusData.length;
    },

    // 图片上传限制
    beforeupload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message({
          message: "图片大小不能超过5MB!",
          type: "error"
        });
      }
      return isLt5M;
    },
    // 证件图片上传成功
    businessPicSuccess(file) {
      let item = {
        name: "",
        url: file.data
      };
      this.business_pic.push(item);
    },
    // 证件删除图片
    handleRemoveBusinessPic(file, fileList) {
      let arr = this.business_pic;
      arr.forEach(function(v, i, a) {
        if (
          (file.response && file.response.data === v.url) ||
          file.url === v.url
        ) {
          arr.splice(i, 1);
        }
      });
      this.business_pic = arr;
    },
    // 合同图片上传成功
    contractPicSuccess(file) {
      let item = {
        name: "",
        url: file.data
      };
      this.contract_pic.push(item);
    },
    // 合同删除图片
    handleRemoveContractPic(file, fileList) {
      let arr = this.contract_pic;
      arr.forEach(function(v, i, a) {
        if (
          (file.response && file.response.data === v.url) ||
          file.url === v.url
        ) {
          arr.splice(i, 1);
        }
      });
      this.contract_pic = arr;
    },
    onProvincesChange(item) {
      this.data.address_province =
        this.$refs["cascaderAddr"].currentLabels[0] || "";
      this.data.address_city =
        this.$refs["cascaderAddr"].currentLabels[1] || "";
      this.data.address_district =
        this.$refs["cascaderAddr"].currentLabels[2] || "";
    },
    getInfoData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "POST",
        "/supplyInfo/preEditorSupply.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          supply_id: this.$route.params.id
        },
        function(data) {
          self.data = data.data.supplyInfo;
          self.data.special_type = String(data.data.supplyInfo.special_type);
          self.data.supply_identity = String(
            data.data.supplyInfo.supply_identity
          );
          self.data.tax_identity = String(data.data.supplyInfo.tax_identity);
          self.data.type = String(data.data.supplyInfo.type);
          self.roleData = data.data.usGroupInfo;
          data.data.usGroupInfo.forEach(ele => {
            self.statusData.push(ele.id);
          });
          data.data.groupInfos.forEach(ele => {
            self.checkedstatus.push(ele.group_id);
          });
          data.data.certifications.forEach(ele => {
            if (ele.certification_type == 1) {
              self.contract_pic.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else {
              self.business_pic.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            }
          });
          self.data.is_purchase = Boolean(data.data.is_purchase);
          self.data.addressArr = [
            data.data.supplyInfo.address_province_id || "",
            data.data.supplyInfo.address_city_id || "",
            data.data.supplyInfo.address_district_id || ""
          ];
          // self.data.supply_type2 = self.data.supply_type
          // self.data.is_create_user2 = self.data.is_create_user
          // self.data.addressBankArr = [Number(data.data.account_bank_address_provence_code) || '', data.data.account_bank_address_code || '']
          // self.data.addressArr2 = ['']
        }
      );
    },
    submitFun: function(formName) {
      var self = this;
      var store = this.$store;
      self.data.address_province_id = self.data.addressArr[0] || "";
      self.data.address_city_id = self.data.addressArr[1] || "";
      self.data.address_district_id = self.data.addressArr[2] || "";
      // self.data.groupId = self.checkedstatus.join(',')
      let contractPic = [],
        businessPic = [];
      for (var m of self.contract_pic) {
        contractPic.push(m.url);
      }
      self.data.contract = contractPic.toString();
      for (var m of self.business_pic) {
        businessPic.push(m.url);
      }
      self.data.papers = businessPic.toString();
      var jsondata = Object.assign({}, self.data, {
        token: store.state.token,
        tokenid: store.state.tokenid
      });
      jsondata.audit_status = 2;
      jsondata.is_purchase = Number(self.data.is_purchase);
      if (self.data.supply_type != 1) {
        jsondata.is_create_user = 0;
      }
      jsondata.merchantModel = jsondata.merchant_model;
      delete jsondata.addressArr;
      delete jsondata.addressBankArr;
      delete jsondata.addressArr2;
      delete jsondata.create_at;
      delete jsondata.update_at;
      self.isSave = true;
      self.$parent.callAPI2(
        "POST",
        "/supplyInfo/editorSupply.json",
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
                  path: "/suplier/list"
                }),
              1500
            );
            self.isSave = false;
          } else {
            self.isSave = false;
          }
        }
      );
    },
    saveFun: function(formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.isSubmit = true;
          var store = this.$store;
          self.data.address_province_id = self.data.addressArr[0] || "";
          self.data.address_city_id = self.data.addressArr[1] || "";
          self.data.address_district_id = self.data.addressArr[2] || "";
          let contractPic = [],
            businessPic = [];
          for (var m of self.contract_pic) {
            contractPic.push(m.url);
          }
          self.data.contract = contractPic.toString();
          for (var m of self.business_pic) {
            businessPic.push(m.url);
          }
          self.data.papers = businessPic.toString();
          var jsondata = Object.assign({}, self.data, {
            token: store.state.token,
            tokenid: store.state.tokenid
            // account_bank_address_code: self.data.addressBankArr[1] || '',
            // account_bank_address: self.data.addressArr2.join('') || self.data.account_bank_address
          });
          jsondata.is_purchase = Number(self.data.is_purchase);
          jsondata.merchantModel = jsondata.merchant_model;
          if (self.data.supply_type != 1) {
            jsondata.is_create_user = 0;
          }
          delete jsondata.addressArr;
          delete jsondata.addressBankArr;
          delete jsondata.addressArr2;
          delete jsondata.create_at;
          delete jsondata.update_at;
          self.$parent.callAPI2(
            "POST",
            "/supplyInfo/editorSupply.json",
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
                      path: "/suplier/auditlist"
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
