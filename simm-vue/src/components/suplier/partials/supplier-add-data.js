import addressJson from "../../plugin/address.json";
import addressJson2 from "../../plugin/address2.json";
import addressBankJson from "../../plugin/address_bank.json";
export default {
  data: function(router) {
    var checkCategoryI = (rule, value, callback) => {
      let len = this.goodsCategoryI.length;
      if (len != 0) {
        callback();
      } else {
        callback(new Error("请选择经营类目"));
      }
    };
    var checkAmount = (rule, value, callback) => {
      // 检验金额
      if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
        callback(new Error("请输入正确的金额"));
      } else {
        callback();
      }
    };
    var dateTimeCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入预计还款时间"));
      }
    };
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
      if (!/^([1-9]\d{0,3}|10000)$/.test(value)) {
        callback(new Error("必须为整数"));
      } else {
        callback();
      }
    };

    return {
      tableData: [],
      newCol: {
        contactPerson: "",
        phoneNumber: "",
        address: ""
      },
      isSubmit: false,
      isSave: false,
      merchantModelEditable: true, // 控制 销售模式是否可编辑
      DirectPurchasingEditable: true, // 控制 是否直购 是否可编辑
      serverURI: this.$store.state.serverURI,
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      addressJson: addressJson,
      addressJson2: addressJson2,
      addressBankJson: addressBankJson,
      supplySiteData: [],
      baseCategoryData: [], // 基础类目
      checkAll: false,
      checkedstatus: [],
      statusData: [],
      isIndeterminate: false,
      contract_pic: [], // 合同图
      business_pic: [], // 证件图
      businessLicensePic: [], // 营业执照
      accountLicencePic: [], // 开户许可证
      juridicalPersonIDPic: [], // 法人身份证
      bailEvidencePic:[],//保证金凭证
      goodsCategoryI: [],
      registration_time: null,
      request: {
        tax_identity: "",
        type: "",
        supply_identity: "",
        special_type: "",
        addressArr: [],
        addressBankArr: [],
        addressArr2: [],
        contact_email: "",
        receive_email: "",
        address_province: "",
        address_city: "",
        address_district: "",
        address_province_id: "",
        address_city_id: "",
        address_detail_id: "",
        address_detail: "",
        contact_person: "",
        contact_phone: "",
        supply_type: 2,
        merchantModel: null,
        is_create_user: 0,
        supply_name: "",
        supply_note: "",
        supply_number: "",
        account_type: "",
        account_name: "",
        account_bank: "",
        account_number: "",
        account_note: "",
        deposit_price: 0, // number
        is_purchase: true,
        settle_day: "",
        registered_capital: 0,
        juridical_person_name: "",
        license_type: "",
        baseCategoryIds: "",
        operationType: "",
        registration_time: null,
        is_direct_purchasing: null,
        corporateIdentityNumber: "",
        taxpayerIdentificationNumber: "",
        businessLicenseNo: "",
        registeredAddress: "",
        businessScope: "",
        certificatesValidity: [],
        contractValidity: [],
        isSubAccount: null,
        contractValidityBegin: "",
        contractValidityEnd: null,
        afterSaleInfoList: []
      },
      allRules: {},
      subRules: {
        businessLicenseNo: [
          {
            required: true,
            message: "请输入营业执照类型",
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
        certificatesValidityBegin: [
          {
            required: true,
            message: "请输入证件有效期",
            trigger: "blur"
          }
        ]
      },
      rules: {
        registered_capital: [
          {
            required: true,
            validator: checkAmount,
            trigger: "blur"
          }
        ],
        juridical_person_name: [
          {
            required: true,
            message: "请输入法人姓名",
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
        goodsCategoryI: [
          {
            required: true,
            validator: checkCategoryI,
            trigger: "blur"
          }
        ],
        // registration_time: [{
        //   type: 'date',
        //   required: true,
        //   // validator: dateTimeCheck,
        //   message:'请输入注册时间',
        //   trigger: 'blur'
        // }],
        settle_day: [
          {
            required: true,
            message: "请输入账期",
            trigger: "blur"
          },
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
        special_type: [
          {
            required: true,
            message: "请选择是否为蔬果供应商",
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
        // account_type: [
        //   {
        //     required: true,
        //     type: "number",
        //     message: "请选择打款账号类型",
        //     trigger: "change"
        //   }
        // ],
        // account_name: [
        //   {
        //     required: true,
        //     message: "请输入打款账号名称",
        //     trigger: "blur"
        //   }
        // ],
        merchantModel: [
          {
            type: "number",
            required: true,
            message: "请选择销售模式",
            trigger: "change"
          }
        ],
        // account_bank: [
        //   {
        //     required: true,
        //     message: "请输入开户银行",
        //     trigger: "blur"
        //   }
        // ],
        // account_number: [
        //   {
        //     required: true,
        //     message: "请输入打款账号号码",
        //     trigger: "blur"
        //   },
        //   {
        //     pattern: /^\d+$/,
        //     message: "请输入正确的打款账号号码",
        //     trigger: "blur"
        //   }
        // ],
        businessPic: [
          {
            required: true,
            validator: checkbusiness,
            trigger: "change"
          }
        ],
        contact_email: [
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
        receive_email: [
          {
            required: false,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        contractPic: [
          {
            required: true,
            validator: checkcontract,
            trigger: "change"
          }
        ],
        is_direct_purchasing: [
          {
            type: "number",
            required: true,
            message: "请选择是否直购",
            trigger: "change"
          }
        ],
        isSubAccount: [
          {
            type: "number",
            required: true,
            message: "请选择是否分账",
            trigger: "change"
          }
        ],
        contractValidityBegin: [
          {
            required: true,
            message: "请输入合同有效期",
            trigger: "change"
          }
        ]
      }
    };
  }
};
