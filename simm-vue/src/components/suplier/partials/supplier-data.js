import addressJson from "../../plugin/address.json";
import addressJson2 from "../../plugin/address2.json";
import addressBankJson from "../../plugin/address_bank.json";
export default {
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
      merchantModelEditable: true,
      DirectPurchasingEditable: true,
      serverURI: this.$store.state.serverURI,
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      processStatus: 3, //审核状态
      supplySiteData: [], // 全部服务区域
      checkAll: true,
      checkedstatus: [],
      oldCheckedstatus: [],
      statusData: [],
      isIndeterminate: true,
      contract_pic: [], // 合同图
      business_pic: [], // 证件图

      businessLicensePic: [], // 营业执照
      accountLicencePic: [], // 开户许可证
      juridicalPersonIDPic: [], // 法人身份证
      bailEvidencePic:[],//保证金凭证
      goodsCategoryI: [],
      registration_time: "",
      afterSaleInfoList: [],
      juridical_person_name: "",
      license_type: "",
      baseCategoryIds: "",
      categoryList: "",
      baseCategoryData: "",
      isDisabled: false,
      certificatesValidity: [],
      contractValidity: [],
      data: {
        is_direct_purchasing: null
      },
      addressJson: addressJson,
      addressJson2: addressJson2,
      addressBankJson: addressBankJson,
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
        // account_type: [
        //   {
        //     required: true,
        //     type: "number",
        //     message: "请输入打款账号类型",
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
        // account_bank: [
        //   {
        //     required: true,
        //     message: "请输入开户银行",
        //     trigger: "blur"
        //   }
        // ],
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
        merchant_model: [
          {
            type: "number",
            required: true,
            message: "请选择销售模式",
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
            message: "请输入合同有效期起始日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    getInfoData: function(callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/preEditorSupply.json",
        data: { supply_id: this.$route.params.id },
        contentType: "form", //
        succ: function(data) {
          self.data = data.data.supplyInfo;
          self.data.special_type = String(data.data.supplyInfo.special_type);
          self.data.supply_identity = String(
            data.data.supplyInfo.supply_identity
          );
          self.data.tax_identity = String(data.data.supplyInfo.tax_identity);
          self.data.type = String(data.data.supplyInfo.type);
          // self.roleData = data.data.usGroupInfo
          self.$set(
            self.data,
            "isSubAccount",
            data.data.supplyInfo.is_sub_account
          );
          self.data.corporateIdentityNumber =
            data.data.supplyInfo.corporate_identity_number;
          self.data.taxpayerIdentificationNumber =
            data.data.supplyInfo.taxpayer_identification_number;
          self.data.businessLicenseNo =
            data.data.supplyInfo.business_license_no;
          self.data.registeredAddress = data.data.supplyInfo.registered_address;
          self.data.certificatesValidityBegin =
            data.data.supplyInfo.certificates_validity_begin;
          self.data.certificatesValidityEnd =
            data.data.supplyInfo.certificates_validity_end;
          self.data.businessScope = data.data.supplyInfo.business_scope;
          self.data.contractValidityBegin =
            data.data.supplyInfo.contract_validity_begin;
          self.data.contractValidityEnd =
            data.data.supplyInfo.contract_validity_end;

          data.data.serviceScopesList.forEach(item => {
            self.checkedstatus.push(item.addressProvinceId);
          });
          self.oldCheckedstatus = self.checkedstatus;

          self.tableData = data.data.afterSaleInfoList;

          if (self.tableData.length == 0) {
            self.handleAdd();
          }
          data.data.certifications.forEach(ele => {
            if (ele.certification_type == 1) {
              self.contract_pic.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 2) {
              self.business_pic.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 3) {
              self.businessLicensePic.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 4) {
              self.juridicalPersonIDPic.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 5) {
              self.accountLicencePic.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            }else if(ele.certification_type==7){
              selef.bailEvidencePic.push({
                name:ele.id,
                url:ele.certification_img_url

              })
            }
          });
          //图片初始化
          self.$refs.businessLicenseImg.updatePicList(
            self.data,
            self.businessLicensePic
          );
          self.$refs.accountLicenceImg.updatePicList(
            self.data,
            self.accountLicencePic
          );
          self.$refs.juridicalPersonImg.updatePicList(
            self.data,
            self.juridicalPersonIDPic
          );
          self.$refs.businessImg.updatePicList(self.data, self.business_pic);
          self.$refs.contractImg.updatePicList(self.data, self.contract_pic);
          self.$refs.bailEvidenceImg.updatePicList(self.data,self.bailEvidencePic);
          self.registration_time = self.data.registration_time;
          if (data.data.supplyInfo.process_status == 3) {
            self.isDisabled = true;
          }
          self.categoryList = data.data.categoryList;
          data.data.categoryList.forEach(item => {
            self.goodsCategoryI.push(item.base_category_id);
          });
          self.data.is_purchase = Boolean(data.data.is_purchase);
          self.data.addressArr = [
            data.data.supplyInfo.address_province_id || "",
            data.data.supplyInfo.address_city_id || "",
            data.data.supplyInfo.address_district_id || ""
          ];
          if (callback) {
            callback();
          }
        }
      });
    }
  }
};
