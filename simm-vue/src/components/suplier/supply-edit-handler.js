import addressJson from "../plugin/address.json";

export default {
  data() {
    return {
      baseData: {
        mode: "add",
        addressJson,
        baseCategoryData: [],
        bankList: [],
        disabled: false,
        agentDisabled: false,
        agentEditDisabled: false,
        deliveryTypeDisabled: false,
        merchantModelDisabled: false,
        disableAgent: false,
        subAccountBankCode: "",
        bankCodeEnum: {
          bocom: "BOCOM", // 交通银行
          pad: "PAB" // 平安银行
        }
      },
      oldSupplyInfo: {},// 原供应商信息 用于比对变化
      entity: {
        baseInfo: {},
        business: {},
        cooperate: {},
        finance: {},
        license: {},
        statusData: [],
        checkedstatus: [],
        contractPicList: [],
        businessPicList: [],
        businessLicensePicList: [],
        juridicalPersonIDPicList: [],
        accountLicencePicList: [],
        bailEvidencePicList: [],
        goodsCategoryI: [],
        afterSaleInfoList: [],
        identityCardPic: [],
        agentCityI: []
      }
    };
  },
  created() {
    this.getAllBaseCategory();
    this.getBankList();
    this.getSubAccountBankCode();
  },
  methods: {
    /**
     * 初始化新增数据
     */
    initNewData() {
      this.initCompData(this.entity);
    },
    /**
     * 初始化编辑数据
     */
    initEditData: function (callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/preEditorSupply.json",
        data: { supply_id: this.$route.params.id },
        contentType: "form", //
        succ: function (data) {
          self.entity = data.data.supplyInfo;

          // self.roleData = data.data.usGroupInfo
          self.$set(self.entity, "isSubAccount", self.entity.is_sub_account);
          self.$set(self.entity, "merchantModel", self.entity.merchant_model);
          self.$set(
            self.entity,
            "accountBankCode",
            self.entity.account_bank_code
          );
          self.$set(self.entity, "companyName", self.entity.company_name);
          self.$set(self.entity, "supBankCode", self.entity.sup_bank_code);
          self.$set(self.entity, "identityCard", self.entity.identity_card);
          self.$set(self.entity, "financeType", self.entity.finance_type);
          self.$set(
            self.entity,
            "platformAccount",
            self.entity.platform_account
          );
          self.$set(self.entity, "platformRatio", self.entity.platform_ratio);
          self.$set(self.entity, "subBankCity", self.entity.sub_bank_city);
          self.$set(self.entity, "bankDrecCode", self.entity.bank_drec_code);
          self.$set(
            self.entity,
            "identityCardEnd",
            self.entity.identity_card_end
          );
          self.$set(
            self.entity,
            "subBankCityCode",
            self.entity.sub_bank_city_code
          );
          self.$set(self.entity, "subBankCode", self.entity.sub_bank_code);
          self.$set(self.entity, "subBankName", self.entity.sub_bank_name);
          self.$set(
            self.entity,
            "subBankProvince",
            self.entity.sub_bank_province
          );
          self.$set(
            self.entity,
            "subBankProvinceCode",
            self.entity.sub_bank_province_code
          );
          self.$set(
            self.entity,
            "supplyShortName",
            self.entity.supply_short_name
          );
          self.$set(
            self.entity,
            "corporateIdentityNumber",
            self.entity.corporate_identity_number
          );

          self.$set(
            self.entity,
            "corporatePhoneNumber",
            self.entity.corporate_phone_number
          );
          self.$set(
            self.entity,
            "oldCorporatePhoneNumber",
            self.entity.corporate_phone_number
          );
          self.$set(
            self.entity,
            "corporateIdentityValidityBegin",
            self.entity.corporate_identity_validity_begin
          );
          self.$set(
            self.entity,
            "corporateIdentityValidityEnd",
            self.entity.corporate_identity_validity_end
          );
          self.$set(
            self.entity,
            "authorizedAgentName",
            self.entity.authorized_agent_name
          );
          self.$set(
            self.entity,
            "identityCardKind",
            self.entity.identity_card_kind
          );
          self.$set(
            self.entity,
            "authorizedAgentPhoneNumber",
            self.entity.authorized_agent_phone_number
          );
          self.$set(
            self.entity,
            "taxpayerIdentificationNumber",
            self.entity.taxpayer_identification_number
          );
          self.$set(
            self.entity,
            "businessLicenseNo",
            self.entity.business_license_no
          );
          self.$set(
            self.entity,
            "registeredAddress",
            self.entity.registered_address
          );
          self.$set(
            self.entity,
            "certificatesValidityBegin",
            self.entity.certificates_validity_begin
          );
          self.$set(
            self.entity,
            "certificatesValidityEnd",
            self.entity.certificates_validity_end
          );
          self.$set(self.entity, "businessScope", self.entity.business_scope);
          self.$set(
            self.entity,
            "contractValidityBegin",
            self.entity.contract_validity_begin
          );
          self.$set(
            self.entity,
            "contractValidityEnd",
            self.entity.contract_validity_end
          );
          self.$set(self.entity, "agentCityI", self.entity.agent_city);
          self.$set(self.entity, "isAgent", self.entity.is_agent);
          self.$set(
            self.entity,
            "tax_identity",
            self.entity.tax_identity === 0 ? "" : self.entity.tax_identity
          );
          self.$set(self.entity, "contractPicList", []);
          self.$set(self.entity, "businessPicList", []);
          self.$set(self.entity, "businessLicensePicList", []);
          self.$set(self.entity, "juridicalPersonIDPicList", []);
          self.$set(self.entity, "accountLicencePicList", []);
          self.$set(self.entity, "goodsCategoryI", []);
          self.$set(self.entity, "identityCardPicList", []);
          self.$set(self.entity, "bailEvidencePicList", []);
          self.$set(
            self.entity,
            "afterSaleInfoList",
            data.data.afterSaleInfoList
          );
          self.$set(
            self.entity,
            "serviceScopesList",
            data.data.serviceScopesList
          );
          self.$set(
            self.entity,
            "bailEvidenceRemarks",
            data.data.bailEvidenceRemarks
          );
          self.$set(
            self.entity,
            "biz_status",
            data.data.bizStatus
          );
          (data.data.certifications || []).forEach(ele => {
            if (ele.certification_type == 1) {
              self.entity.contractPicList.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 2) {
              self.entity.businessPicList.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 3) {
              self.entity.businessLicensePicList.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 4) {
              self.entity.juridicalPersonIDPicList.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 5) {
              self.entity.accountLicencePicList.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 6) {
              self.entity.identityCardPicList.push({
                name: ele.id,
                url: ele.certification_img_url
              });
            } else if (ele.certification_type == 7) {
              self.entity.bailEvidencePicList.push({
                name: ele.id,
                url: ele.certification_img_url

              })
            }
          });
          (data.data.categoryList || []).forEach(item => {
            self.entity.goodsCategoryI.push(item.base_category_id);
          });
          //基础信息的禁用设置
          self.baseData.processStatus = self.entity.process_status;
          self.baseData.disabled = self.baseData.processStatus == 3;
          if (
            self.baseData.processStatus != 0 &&
            self.baseData.processStatus != -2
          ) {
            self.baseData.agentEditDisabled = true;
          }
          self.baseData.baseCategoryData.forEach(ele => {
            ele.disabled =
              self.baseData.disabled &&
              (self.entity.goodsCategoryI || []).includes(ele.id);
          });
          // 复制原数据
          self.oldSupplyInfo = JSON.parse(JSON.stringify(self.entity));
          if (callback) {
            callback(self.entity);
          }
        }
      });
    },
    /**
     * 初始化基础信息
     * @param {*} entity
     */
    initCompData(entity) {
      var self = this;
      this.steps.forEach(step => {
        //新增时，直接取子组件中的formData信息绑定到父组件
        self.$refs[step.comp].initData(entity, step.comp);
      });
    },
    /**
     * 获取组件数据
     * @param {*} comp
     */
    getCompData(comp) {
      var data = this.$refs[comp].getData();
      // 组件值搜集
      for (var p in data) {
        this.$set(this.entity, p, data[p]);
      }
    },
    getCurrPageData() {
      var self = this;
      this.getCompData(
        self.steps.find(step => step.active == self.active).comp
      );
    },
    getAllCompData() {
      var self = this;
      this.steps.forEach(step => {
        //新增时，直接取子组件中的formData信息绑定到父组件
        self.getCompData(step.comp);
      });
    },

    /**
     * 获取所有的类目
     */
    getAllBaseCategory() {
      var self = this;
      var jsondata = {};
      this.$httpUtil.post({
        url: "/base/prod/category/queryAllBaseCategoryList.json",
        data: jsondata,
        contentType: "form", //json,form,multipart
        succ: function (data) {
          self.baseData.baseCategoryData = data.data.filter(
            el => el.status == 1
          );
        }
      });
    },
    /*获取分账银行配置项*/
    getSubAccountBankCode() {
      var self = this;
      this.$httpUtil.post({
        url: "/dictionary/queryByClassCode.json?classCode=sub_account_bank",
        data: {},
        succ: function (data) {
          self.baseData.subAccountBankCode = data.data[0].itemName;
        }
      });
    },

    getBankList() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/getBankList.json",
        data: {},
        succ: function (data) {
          self.baseData.bankList = data.data;
        }
      });
    },
    /**
     * 验证基础信息
     * @param {*} formData
     */
    valid: function (formName) {
      var self = this;
      this.steps.forEach(step => {
        //新增时，直接取子组件中的formData信息绑定到父组件
        var comp = self.$refs[step.comp];
        try {
          if (comp.saveValid) {
            comp.saveValid();
          }
          //提交 或 审核通过以后都需要校验所有的信息
          if (
            (comp.commitValid && formName == "commit") ||
            self.baseData.disabled
          ) {
            comp.commitValid();
          }
        } catch (error) {
          self.setStep(step.active);
          throw new Error(error.message);
        }
      });
    },
    accountInfoChange(callback) {
      var self = this;
      if (self.baseData.subAccountBankCode == self.baseData.bankCodeEnum.pad) { // 平安分账
        self.accountNumberChange(callback)
      } else if (self.baseData.subAccountBankCode == self.baseData.bankCodeEnum.bocom) { // 交行分账
        self.commAccountInfoChange(callback);
      }

    },

    /**
     * 比较是否发生变化
     */
    compareChanges(props) {
      var self = this;
      for (var prop in self.oldSupplyInfo) {
        if (props.includes(prop)) {
          if (self.oldSupplyInfo[prop] === self.entity[prop]) {
            continue;
          } else {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * 交行分账信息变更提示 需要重新激活
     */
    commAccountInfoChange(callback) {
      var self = this;
      //  比较财务变更字段 提款人信息、代理人信息 是否触发修改
      let financeProps = ["account_name", "account_number", "account_bank", "subBankName",
        "authorizedAgentName", "identityCard", "authorizedAgentPhoneNumber"];
      // 没有审核完，可以不管 非分账供应商，不必校验 卡号没有改变，则不必调整
      if (
        !self.baseData.disabled ||
        self.entity.isSubAccount !== 1 ||
        self.entity.comm_account_status !== 1 ||
        !self.compareChanges(financeProps)
      ) {
        if (callback) {
          callback();
        }
        return;
      }
      //跳转到财务信息页
      self.setStep(3);
      self.$commonUtil.message.confirm(
        `您修改了该供应商的财务打款信息,点击‘确定’会触发交行分账信息修改，修改后将通知供应商进行再次激活或小额鉴权，是否继续？`,
        () => {
          if (callback) {
            callback();
          }
        },
        () => {
        }
      );
    },
    /**
     * 平安分账银行卡信息发生改变提示解绑
     */
    accountNumberChange(callback) {
      var self = this;
      var acctId = (self.entity.currentAccount || {}).acctId;
      // 没有审核完，可以不管 非分账供应商，不必校验 卡号没有改变，则不必调整
      if (
        !self.baseData.disabled ||
        self.entity.isSubAccount !== 1 ||
        acctId === self.entity.account_number ||
        !self.entity.currentAccount
      ) {
        if (callback) {
          callback();
        }
        return;
      }
      //跳转到财务信息页
      self.setStep(3);
      self.$commonUtil.message.confirm(
        `输入的供应商财务打款卡号【<span style="color:red;">${self.entity.account_number}</span>】与<br/>
         供应商平台绑定的提现卡号【<span style="color:red;">${acctId}</span>】不一致,<br/>
        ‘确定’将触发供应商平台提现卡号解绑，是否继续？`,
        () => {
          if (callback) {
            callback();
          }
        },
        () => {
          //回退卡号信息
          self.entity.account_number = acctId;
          self.entity.finance.account_number = acctId;
          self.$commonUtil.valid.throwEx(
            `打款账号已经还原为当前绑定账号[${acctId}]`
          );
        }
      );
    },
    /**
     * 保存
     */
    submit: function (formName) {
      var self = this;
      self.getAllCompData();
      self.accountInfoChange(() => {
        self.valid(formName);
        self.entity.operationType = formName;
        self.entity.audit_status = 2;
        self.entity.contract = (self.entity.contractPicList || []).map(
          a => a.url
        );
        self.entity.papers = (self.entity.businessPicList || []).map(
          a => a.url
        );
        self.entity.agent_city = self.entity.agentCityI;
        self.entity.platformRatio = self.entity.platform_ratio;
        self.entity.businessLicensePic = (
          self.entity.businessLicensePicList || []
        ).map(a => a.url);
        self.entity.accountLicencePic = (
          self.entity.accountLicencePicList || []
        ).map(a => a.url);
        self.entity.juridicalPersonIDPic = (
          self.entity.juridicalPersonIDPicList || []
        ).map(a => a.url);
        self.entity.bailEvidencePic = (
          self.entity.bailEvidencePicList || []
        ).map(a => a.url);
        self.entity.identityCardPic = (
          self.entity.identityCardPicList || []
        ).map(a => a.url);
        if (self.entity.deposit_price == "") {
          self.entity.deposit_price = 0
        }
        //代理直购，保证金大于0，校验保证金回执单
        if ((self.entity.isAgent == 1 || self.entity.is_direct_purchasing === 1) && self.entity.deposit_price > 0) {
          if ((self.entity.bailEvidencePic || []).length == 0) {
            self.$commonUtil.valid.throwEx(`请上传保证金回执单`);
          }
        }
        var url = "/supplyInfo/editorSupply.json";
        if (this.baseData.mode == "add") {
          url = "/supplyInfo/doAdd.json";
        }
        self.$httpUtil.post({
          url: url,
          data: self.entity,
          succ: function (data) {
            self.$message({
              message: "操作成功！",
              type: "success"
            });
            setTimeout(() => {
              self.$back();
            }, 1500);
          }
        });
      });
    }
  }
};
