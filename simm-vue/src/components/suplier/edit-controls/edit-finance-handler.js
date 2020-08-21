export default {
  data() {
    return {
      certMessage: "请输入身份证号",
      accountArr: [],
      showSubBank: true,
      formData: {
        authorizedAgentPhoneNumber: "",
        authorizedAgentName: "",
        identityCardKind: "二代身份证",
        financeType: "",
        account_name: "",
        accountBankCode: "",
        accountBankCodeShow: "",
        identityCard: "",
        account_number: "",
        platformAccount: "",
        account_bank: "",
        account_note: "",
        subBankProvinceCode: "",
        subBankProvince: "",
        subBankCityCode: "",
        subBankCity: "",
        subBankCode: "",
        subBankName: "",
        supBankCode: "",
        bankDrecCode: "",
        identityCardEnd: ''
      },
      rules: {
        authorizedAgentPhoneNumber: [{
          required: true,
          message: "请输入手机号",
          trigger: "blur"
        },
        {
          validator: this.$commonUtil.formValid.checkElevenNumber,
          message: "手机号格式不正确",
          trigger: "blur"
        }
        ],
        identityCardEnd: [
          {
            required: true,
            message: "请输入证件有效期截止日期",
            trigger: "blue"
          }
        ],
        identityCardKind: [{
          required: true,
          message: "请输入证件种类",
          trigger: "blur"
        }],
        authorizedAgentName: [{
          required: true,
          message: "请输入授权代理人姓名",
          trigger: "blur"
        }],
        subBankName: [{
          required: true,
          message: "请输入支行名称",
          trigger: "blur"
        }],
        identityCard: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: "blur"
          }
        ],
        financeType: [
          {
            type: "number",
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ],
        platformAccount: [
          {
            required: true,
            message: "请输入供应商平台账号",
            trigger: "blur"
          },
          {
            min: 6,
            message: "至少输入6位字符"
          }
        ],
        account_name: [
          {
            required: true,
            message: "请输入户名",
            trigger: "blur"
          }
        ],
        account_bank: [
          {
            required: true,
            message: "请输入开户银行",
            trigger: "change"
          }
        ],
        account_number: [
          {
            required: true,
            message: "请输入打款账号号码",
            trigger: "change"
          }
        ],
        // subBankName: [
        //   {
        //     required: true,
        //     message: "请输入支行名称",
        //     trigger: "change"
        //   }
        // ],
      }
    };
  },
  methods: {
    /**
     * 获取数据
     */
    getData() {
      return this.formData;
    },
    /**
     * 银行改变
     * @param {*} val
     */
    accountChange(val) {
      if (val > "") {
        var arr = val.split("@");
        if (this.formData.account_bank != arr[0]) {
          //清空支行信息
          this.bankChange(null);
        }
        this.formData.account_bank = arr[0];
        this.formData.accountBankCode = arr[1];
        this.formData.supBankCode = arr[2];
      } else {
        if (this.formData.account_bank != "") {
          //清空支行信息
          this.bankChange(null);
        }
        this.formData.account_bank = "";
        this.formData.accountBankCode = "";
        this.formData.supBankCode = "";
      }
    },
    /**
     * 支行信息改变
     * @param {*} bankInfo
     */
    bankChange(bankInfo) {
      var empty = bankInfo == null;
      if (empty) {
        this.formData.subBankProvinceCode = "";
        this.formData.subBankProvince = "";
        this.formData.subBankCityCode = "";
        this.formData.subBankCity = "";
        this.formData.subBankCode = "";
        this.formData.subBankName = "";
        this.formData.bankDrecCode = "";
        this.accountArr = [];
      } else {
        var province = bankInfo.province || {};
        var city = bankInfo.city || {};
        var subBank = bankInfo.subBank || {};
        this.formData.subBankProvinceCode = province.code;
        this.formData.subBankProvince = province.label;
        this.formData.subBankCityCode = city.code;
        this.formData.subBankCity = city.label;
        this.formData.subBankCode = subBank.code;
        this.formData.subBankName = subBank.label;
        this.formData.bankDrecCode = subBank.bankDrecCode;
      }
    },
    /**
     * 暂存验证
     */
    saveValid() {
      let isElevenNumber = this.$commonUtil.formValid.isElevenNumber;
      if (this.entity.authorizedAgentPhoneNumber > "") {
        isElevenNumber(this.entity.authorizedAgentPhoneNumber, "手机号格式不正确");
      }
    },
    /**
     * 提交验证
     */
    commitValid() {
      var self = this;
      let baseValid = this.$commonUtil.valid.baseValid;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      let isElevenNumber = this.$commonUtil.formValid.isElevenNumber;
      emptyValid(self.entity.account_name, "请输入户名");
      /*if (self.entity.financeType == 2) {
        //对公校验支行名称
        emptyValid(self.entity.subBankName, "请输入支行名称");
      }*/
      emptyValid(self.entity.subBankName, "请输入支行名称");
      if (self.entity.financeType == 2) {
        emptyValid(self.entity.authorizedAgentName, "请输入授权代理人姓名");
      }
      if (self.entity.financeType == 2) {
        //对公校验授权代理人姓名
        emptyValid(self.entity.authorizedAgentName, "请输入授权代理人姓名");
      }
      emptyValid(self.entity.authorizedAgentPhoneNumber, "请输入手机号");
      isElevenNumber(this.entity.authorizedAgentPhoneNumber, "手机号格式不正确");
      emptyValid(self.entity.account_bank, "请输入开户银行");
      emptyValid(self.entity.identityCard, "请输入身份证号");
      emptyValid(self.entity.identityCardEnd, "请输入身份证有效期截止日期");
      emptyValid(self.entity.financeType, "请选择类型");
      emptyValid(self.entity.account_number, "请输入收款账号号码");
      emptyValid(self.entity.platformAccount, "请输入供应商平台账号");
      baseValid(
        () => self.entity.platformAccount.trim().length < 6,
        "供应商平台账号至少输入6位字符"
      );
    }
  }
};
