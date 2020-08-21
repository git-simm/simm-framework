<template>
  <section>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="140px"
      class="demo-ruleForm edit-finance"
    >
      <h4 class="text-theme">打款信息</h4>
      <el-row>
        <el-col :span="10">
          <el-form-item label="类型" prop="financeType">
            <el-radio-group v-model.number="formData.financeType">
              <el-radio :label="2">对公</el-radio>
              <el-radio :label="1">对私</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="开户行" prop="account_bank">
            <el-select
              v-if="entity.isSubAccount == 1"
              v-model.trim="formData.accountBankCodeShow"
              filterable
              @change="accountChange"
              placeholder="请选择开户行"
            >
              <el-option
                v-for="item in baseData.bankList.filter(subBankFilter)"
                :key="`${item.bankName}@${item.bankCode}@${item.sbankCode}`"
                :label="item.bankName"
                :value="`${item.bankName}@${item.bankCode}@${item.sbankCode}`"
              ></el-option>
            </el-select>
            <el-input v-else v-model.trim="formData.account_bank"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="支行名称" prop="subBankName">
            <!-- :bankCode="formData.accountCode" -->
            <sxh-bank
              ref="subBank"
              v-if="entity.isSubAccount == 1"
              v-model="accountArr"
              :bankCode="formData.accountBankCode"
              @bankChange="bankChange"
            ></sxh-bank>
            <el-input v-else v-model.trim="formData.subBankName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <h4 class="import-message">
            如未找到对应支行，请供应商联系收款银行询问上级支行
            <br />例如：收款银行为中国银行，支行为：中国银行11支行，询问中国银行客服，中国银行11支行的上级支行
          </h4>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="收款户名" prop="account_name">
            <el-input v-model.trim="formData.account_name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="收款卡号" prop="account_number">
            <el-input v-model.trim="formData.account_number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="formData.financeType==2">
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="证件类型"
              prop="identityCardKind"
              :key="`identityCardKind${formData.financeType}`"
            >
              <el-input v-model.trim="formData.identityCardKind" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="授权代理人证件号"
              prop="identityCard"
              :key="`identityCard${formData.financeType}`"
            >
              <el-input v-model.trim="formData.identityCard" placeholder="请输入身份证编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="证件有效期至"
              prop="identityCardEnd"
              :key="`identityCardEnd${formData.financeType}`"
            >
              <sxh-date-picker
                v-model="formData.identityCardEnd"
                controlType="date"
                @change="val=>{
                              formData.identityCardEnd = val
                             }"
              ></sxh-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="授权代理人姓名"
              prop="authorizedAgentName"
              :key="`authorizedAgentName${formData.financeType}`"
            >
              <el-input v-model.trim="formData.authorizedAgentName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="授权代理人手机号"
              prop="authorizedAgentPhoneNumber"
              :key="`authorizedAgentPhoneNumber${formData.financeType}`"
            >
              <el-input
                v-model.trim="formData.authorizedAgentPhoneNumber"
                placeholder="此手机号为鉴权与提现确认手机号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="formData.financeType==1">
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="收款人证件类型"
              prop="identityCardKind"
              :key="`identityCardKind${formData.financeType}`"
            >
              <el-input v-model.trim="formData.identityCardKind" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="收款人证件号码"
              prop="identityCard"
              :key="`identityCard${formData.financeType}`"
            >
              <el-input v-model.trim="formData.identityCard" placeholder="请输入身份证编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <h4 class="import-message">如包含“x"，请大写</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="收款人手机号"
              prop="authorizedAgentPhoneNumber"
              :key="`authorizedAgentPhoneNumber${formData.financeType}`"
            >
              <el-input
                v-model.trim="formData.authorizedAgentPhoneNumber"
                placeholder="此手机号为鉴权与提现确认手机号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <h4 class="import-message">请输入与收款户名一致的手机号</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="证件有效期至"
              prop="identityCardEnd"
              :key="`identityCardEnd${formData.financeType}`"
            >
              <sxh-date-picker
                v-model="formData.identityCardEnd"
                controlType="date"
                @change="val=>{
                              formData.identityCardEnd = val
                             }"
              ></sxh-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="10">
          <el-form-item label="供应商平台账号" prop="platformAccount">
            <el-input v-model.trim="formData.platformAccount" :disabled="baseData.disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="打款备注" prop="account_note">
            <el-input v-model.trim="formData.account_note"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <p style="color:indianred;padding-left:60px;">
            <span>
              特别注意：1、审核通过后，系统将创建供应商平台账号与银行子账户，并邮件通知供应商结算邮箱；
              2、如需更改供应商信息，请联系供应商管理员操作
            </span>
          </p>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import EditFinanceHandler from "./edit-finance-handler.js";
import EditCommonHandler from "./edit-common-handler.js";
export default {
  name: "EditFinance",
  mixins: [EditFinanceHandler, EditCommonHandler],
  props: {
    baseData: {},
    entity: {},
  },
  watch: {
    //对公、对私属性发生改变
    "formData.financeType": {
      handler(val, oldVal) {
        //初始化，则退出(编辑模式)
        if (oldVal === "" && this.baseData.mode !== "add") {
          return;
        }
        this.formData.account_bank = "";
        this.formData.accountBankCode = "";
        this.formData.accountBankCode = "";
        this.formData.supBankCode = "";
        this.formData.subBankProvinceCode = "";
        this.formData.subBankProvince = "";
        this.formData.subBankCityCode = "";
        this.formData.subBankCity = "";
        this.formData.subBankCode = "";
        this.formData.subBankName = "";
        this.formData.bankDrecCode = "";
        this.formData.authorizedAgentPhoneNumber = "";
        this.formData.identityCard = "";
        this.formData.identityCardEnd = "";
        this.formData.accountBankCodeShow = "";
        //支行信息初始化
        this.accountArr = [];
      },
    },
    //统一社会信用编码
    "entity.businessLicenseNo": {
      handler(val, oldVal) {
        if (this.formData.financeType == 2) {
          //对公
          this.formData.identityCard = val;
        }
      },
    },
    //联系人电话
    "entity.contact_phone": {
      handler(val, oldVal) {
        if (
          !this.baseData.disabled &&
          (!this.formData.platformAccount ||
            oldVal == this.formData.platformAccount)
        ) {
          this.formData.platformAccount = val;
        }
      },
    },
  },
  //方法列表
  methods: {
    /**
     * 支行过滤
     */
    subBankFilter(bank) {
      // return bank.bankType == 2;
      // 平安银行
      return (
        // 对私 对公数据源
        this.formData.financeType == null ||
        this.formData.financeType == `` ||
        bank.bankType == this.formData.financeType
      );
    },

    /**
     * 初始化
     * @param {*} data
     * @param {*} compProp
     */
    initData(data, compProp) {
      this.baseInitData(data, compProp);
      if (
        this.formData.account_bank > "" &&
        this.formData.accountBankCode > ""
      ) {
        if (this.formData.supBankCode && this.formData.supBankCode !== "") {
          this.$set(
            this.formData,
            "accountBankCodeShow",
            `${this.formData.account_bank}@${this.formData.accountBankCode}@${this.formData.supBankCode}`
          );
        } else {
          this.$set(
            this.formData,
            "accountBankCodeShow",
            `${this.formData.account_bank}@${this.formData.accountBankCode}@null`
          );
        }
      } else {
        this.$set(this.formData, "accountBankCodeShow", ``);
      }

      if (this.formData.subBankCode) {
        //支行信息初始化
        this.accountArr = [
          String(this.formData.subBankProvinceCode),
          String(this.formData.subBankCityCode),
          String(this.formData.subBankCode),
        ];
      }
    },
  },
};
</script>
<style lang="less">
.edit-finance {
  .import-message {
    padding-left: 3%;
    color: #f7497e;
  }
}
</style>
