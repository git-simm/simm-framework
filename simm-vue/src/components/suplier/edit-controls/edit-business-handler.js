import moment from "moment";
import changeCorporatePhoneNumber from "./change-phoneNumber.vue";
export default {
  data() {
    return {
      certificatesTimeArr: [],
      corporateTimeArr: [],
      formData: {
        juridical_person_name: "",
        registered_capital: 0,
        registration_time: null,
        registeredAddress: "",
        businessScope: "",
        corporateIdentityNumber: "",
        businessLicenseNo: "",
        license_type: "",
        tax_identity: "",
        certificatesValidityBegin: "",
        certificatesValidityEnd: "",
        corporateIdentityValidityBegin: "",
        corporateIdentityValidityEnd: "",
        corporatePhoneNumber: "",
        companyName: ""
      },
      rules: {
        juridical_person_name: [
          {
            required: true,
            message: "请输入法人姓名",
            trigger: "blur"
          }
        ],
        corporateIdentityValidityEnd: [
          {
            required: true,
            message: "请选择证件有效截止日期",
            trigger: "blue"
          }
        ],
        corporatePhoneNumber: [
          {
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
        registered_capital: [
          {
            required: true,
            message: "注册资本仅支持输入数字",
            trigger: "blur"
          }
        ],
        registeredAddress: [
          {
            required: true,
            message: "请输入注册地址",
            trigger: "blur"
          }
        ],
        businessScope: [
          {
            required: true,
            message: "请输入经营范围",
            trigger: "blur"
          }
        ],
        companyName: [
          {
            required: true,
            message: "请输入工商注册公司名称",
            trigger: "blur"
          }
        ],
        businessLicenseNo: [
          {
            required: true,
            message: "请输入社会统一信用编码",
            trigger: "blur"
          }
        ],
        corporateIdentityNumber: [
          {
            required: true,
            message: "请输入法人身份证号",
            trigger: "blur"
          }
        ],
        license_type: [
          {
            required: true,
            message: "请输入营业执照类型",
            trigger: "blur"
          }
        ],
        certificatesValidityBegin: [
          {
            required: true,
            message: "请输入营业执照有效期",
            trigger: "blue"
          }
        ],
        tax_identity: [
          {
            required: true,
            type: "number",
            message: "请选择税务身份",
            trigger: "change"
          }
        ]
      },

    };
  },
  methods: {
    /**
     * 获取数据
     */
    getData() {
      // this.formData.registration_time = moment(
      //   this.formData.registration_time
      // ).format("YYYY-MM-DD 00:00:00");
      return this.formData;
    },
    /**
     * 暂存验证
     */
    saveValid() {
      let isElevenNumber = this.$commonUtil.formValid.isElevenNumber;
      if (this.entity.corporatePhoneNumber > "") {
        isElevenNumber(this.entity.corporatePhoneNumber, "手机号格式不正确");
      }
    },
    /**
     * 修改法人手机号
     * @param {*} data
     */
    changePhoneNumber(name, phone) {
      this.$layerUtil.openWin(this, {
        title: "法人手机号修改",
        area: ["600px", "350px"],
        data: {
          formData: {
            juridical_person_name: name,
            corporatePhoneNumber: phone
          }
        },
        component: changeCorporatePhoneNumber
      })
    },
    /**
     * 提交验证
     */
    commitValid() {
      var self = this;
      let baseValid = this.$commonUtil.valid.baseValid;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      let isElevenNumber = this.$commonUtil.formValid.isElevenNumber;
      emptyValid(self.entity.juridical_person_name, "请输入法人姓名");
      emptyValid(self.entity.corporateIdentityNumber, "请输入法人身份证号");
      emptyValid(self.entity.corporateIdentityValidityEnd, "请输入法人身份证有效期结束日期");

      emptyValid(self.entity.corporatePhoneNumber, "请输入法人手机号");
      isElevenNumber(self.entity.corporatePhoneNumber, "手机号格式不正确");
      var reg = /^[0-9]+(.[0-9]{1,3})?$/;
      baseValid(
        () => !reg.test(self.entity.registered_capital),
        "请输入注册资本"
      );
      emptyValid(self.entity.registration_time, "请选择注册日期");
      emptyValid(self.entity.tax_identity, "请选择税务身份");
      emptyValid(self.entity.license_type, "请输入营业执照类型");
      emptyValid(self.entity.companyName, "请输入工商注册公司名称");
      emptyValid(self.entity.businessLicenseNo, "请输入社会统一信用号码");
      emptyValid(self.entity.registeredAddress, "请输入注册地址");
      emptyValid(self.entity.businessScope, "请输入经营范围");
      emptyValid(self.entity.certificatesValidityEnd, "请输入营业执照有效期结束日期");
      emptyValid(self.entity.certificatesValidityBegin, "请输入营业执照有效期开始日期");
    }
  }
};
