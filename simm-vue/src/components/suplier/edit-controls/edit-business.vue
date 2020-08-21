<template>
  <section>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="160px"
      class="demo-ruleForm edit-business"
    >
      <h4 class="text-theme">工商，法人信息</h4>
      <el-row>
        <el-col :span="10">
          <el-form-item label="工商注册公司名称" prop="companyName">
            <el-input v-model.trim="formData.companyName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <h4 class="import-message">请填写与营业执照一致的公司名称</h4>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="法人姓名" prop="juridical_person_name">
            <el-input v-model.trim="formData.juridical_person_name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <h4 class="import-message">请填写与营业执照一致的法人信息</h4>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="法人手机号" prop="corporatePhoneNumber">
            <el-input v-model.trim="formData.corporatePhoneNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <h4 class="import-message">请填写与法人身份证户名一致的手机号</h4>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="法人身份证号" prop="corporateIdentityNumber">
            <el-input v-model.trim="formData.corporateIdentityNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <h4 class="import-message">如身份证包含“x"请大写</h4>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="身份证有效期至" prop="corporateIdentityValidityEnd">
            <sxh-date-picker
              v-model="formData.corporateIdentityValidityEnd"
              controlType="date"
              @change="val=>{
                      formData.corporateIdentityValidityEnd = val;
                    }"
            ></sxh-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="营业执照类型" prop="license_type">
            <el-input v-model.trim="formData.license_type" placeholder="例如：***有限责任公司（自然人独资）"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="税务身份" prop="tax_identity">
            <el-select v-model.number="formData.tax_identity" clearable placeholder="请选择">
              <el-option label="个体工商户" :value="2"></el-option>
              <el-option label="小规模纳税人" :value="3"></el-option>
              <el-option label="一般纳税人" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="社会统一信用号码" prop="businessLicenseNo">
            <el-input v-model.trim="formData.businessLicenseNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <h4 class="import-message">如包含“O”请大写</h4>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="执照有效期" prop="certificatesValidityBegin">
            <sxh-date
              v-model="certificatesTimeArr"
              controlType="daterange"
              @change="
              arr => {
              formData.certificatesValidityBegin = arr[0];
              formData.certificatesValidityEnd = arr[1];
              }
              "
            ></sxh-date>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="经营范围" prop="businessScope">
            <el-input v-model.trim="formData.businessScope"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="注册资本" prop="registered_capital">
            <sxh-input-number :min="0" :controls="false" v-model="formData.registered_capital">
              <template slot="append">元</template>
            </sxh-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="注册时间" prop="registration_time">
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="formData.registration_time"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="注册地址" prop="registeredAddress">
            <el-input v-model.trim="formData.registeredAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import EditBusinessHandler from "./edit-business-handler.js";
import EditCommonHandler from "./edit-common-handler.js";
import SxhDate from "../../shixh/date/sxh-date";
export default {
  name: "EditBusiness",
  components: { SxhDate },
  mixins: [EditBusinessHandler, EditCommonHandler],
  props: {
    baseData: {},
    entity: {},
  },
  watch: {
    "formData.corporatePhoneNumber": {
      handler(val) {
        //代销分账供应商
        if (this.baseData.mode == "edit") {
          if (
            this.entity.merchantModel == 1 &&
            this.entity.isSubAccount == 1 &&
            this.entity.process_status == 3
          ) {
            if (
              val != this.entity.oldCorporatePhoneNumber &&
              (val || []).length == 11
            ) {
              this.changePhoneNumber(this.formData.juridical_person_name, val);
            }
          }
        }
      },
    },
  },
  //方法列表
  methods: {
    /**
     * 初始化
     * @param {*} data
     * @param {*} compProp
     */
    initData(data, compProp) {
      this.baseInitData(data, compProp);
      this.certificatesTimeArr.push(this.formData.certificatesValidityBegin);
      this.certificatesTimeArr.push(this.formData.certificatesValidityEnd);
      if (this.formData.corporateIdentityValidityBegin) {
        this.corporateTimeArr.push(
          this.formData.corporateIdentityValidityBegin
        );
        this.corporateTimeArr.push(this.formData.corporateIdentityValidityEnd);
      }
    },
    exec(cmd) {
      //只提交图片信息
      //this.$emit(cmd, this.getImgData());
    },
  },
};
</script>
<style lang="less">
.edit-business {
  .import-message {
    padding-left: 3%;
    color: #f7497e;
  }
}
</style>