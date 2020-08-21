export default {
  data() {
    return {
      formData: {
        businessLicensePicList: [],
        accountLicencePicList: [],
        identityCardPicList:[],
        juridicalPersonIDPicList: [],
        businessPicList: [],
        contractPicList: [],
        bailEvidencePicList:[]
      },
      rules: {
        businessPicList: [
          {
            required: true,
            validator: this.checkbusiness,
            trigger: "change"
          }
        ],
        identityCardPicList:[{
          required: true,
          validator: this.checkidentityCard,
          trigger: "change"
        }],
        contractPicList: [
          {
            required: true,
            validator: this.checkcontract,
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    checkbusiness(rule, value, callback) {
      let len = this.businessPicList.length;
      if (len != 0) {
        callback();
      } else {
        callback(new Error("请上传证件信息"));
      }
    },
    checkidentityCard(rule, value, callback) {
      let len = this.identityCardPicList.length;
      if (len != 0) {
        callback();
      } else {
        callback(new Error("请上传授权代理人（提款人）信息"));
      }
    },
    checkcontract(rule, value, callback) {
      let len = this.contractPicList.length;
      if (len != 0) {
        callback();
      } else {
        callback(new Error("请上传合同"));
      }
    },
    /**
     * 获取数据
     */
    getData() {
      var formData = this.formData;
      return formData;
    },
    /**
     * 暂存验证
     */
    saveValid() {
      var self = this;
      var picListValid = (list, msg) => {
        if ((list || []).some(img => img.url && img.url.includes("blob"))) {
          self.$commonUtil.valid.throwEx(msg + "还未上传完毕，请稍等或重试...");
        }
      };
      picListValid(self.entity.contractPicList, "合同图片");
      picListValid(self.entity.identityCardPicList,"授权代理人（提款人）图片");
      picListValid(self.entity.businessPicList, "其他证照图片");
      picListValid(self.entity.businessLicensePicList, "营业执照图片");
      picListValid(self.entity.accountLicencePicList, "开户许可证图片");
      picListValid(self.entity.juridicalPersonIDPicList, "法人身份证图片");
      picListValid(self.formData.bailEvidencePicList,"保证金凭证");
    },
    /**
     * 提交验证
     */
    commitValid() {
      var self = this;
      let baseValid = this.$commonUtil.valid.baseValid;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      baseValid(
        () => self.entity.businessLicensePicList.length == 0,
        "请上传营业执照"
      );
      // baseValid(
      //   () => self.entity.accountLicencePicList.length == 0  && self.entity.tax_identity!=2,
      //   "请上传开户许可证"
      // );
      baseValid(
          ()=>self.entity.identityCardPicList.length==0,
          "请上授权代理人（提款人）身份证信息"
      );
      baseValid(
        () => self.entity.juridicalPersonIDPicList.length == 0,
        "请上传法人身份证"
      );
    }
  }
};
