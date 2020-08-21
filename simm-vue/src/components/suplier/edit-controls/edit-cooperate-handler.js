export default {
  data() {
    return {
      isAgentDisabled: true,
      citys: [],
      goodsCategoryI: [],
      contractTimeArr: [],
      agentCityI: "",
      agentCityIs: [],
      userAgent: "",
      formData: {
        is_direct_purchasing: null,
        deliveryType: null,
        isSubAccount: "",
        settle_day: "",
        deposit_price: 0, // number
        merchantModel: "",
        isAgent: "",
        platform_ratio: 0,
        agentCityI: "",
        agentCityIs: [],
        goodsCategoryI: [],
        checkedstatus: [],
        contractValidityBegin: null,
        contractValidityEnd: null,
        contact_email: "",
        receive_email: "",
        serviceScopesList: [],
        afterSaleInfoList: [] //售后信息列表
      },
      rules: {
        is_direct_purchasing: [
          {
            type: "number",
            required: true,
            message: "请选择是否直购",
            trigger: "change"
          }
        ],
        deliveryType: [
          {
            type: "number",
            required: true,
            message: "请选择是否配送方式",
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
        settle_day: [
          {
            required: true,
            validator: this.$commonUtil.formValid.checkInt,
            message: "账期必须为整数",
            trigger: "blur"
          }
        ],
        merchantModel: [
          {
            type: "number",
            required: true,
            message: "请选择销售模式",
            trigger: "change"
          }
        ],
        goodsCategoryI: [
          {
            required: true,
            type: "array",
            validator: this.checkCategoryI,
            trigger: "blur"
          }
        ],
        isAgent: [
          {
            required: true,
            type: "number",
            trigger: "blur"
          }
        ],
        contractValidityBegin: [
          {
            required: true,
            message: "请输入合同有效期",
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
        platform_ratio: [
          {
            type: "number",
            required: true,
            trigger: "blur",
            validator: this.checkPlatformRatio
          }
        ]
      }
    };
  },
  created() {
    this.getUserAgentInfo();
  },
  watch: {
    "formData.merchantModel": function (val) {
      if (val == 2) {
        //经销
        this.formData.isSubAccount = 0;
        this.formData.deliveryType = 2;
      }
    }
  },
  methods: {
    removeClass() {
      try {
        var self = this;
        setTimeout(() => {
          if (self.entity.process_status == 3) {
            var goods = document.querySelectorAll(
              "#goodsCatagory i.el-icon-close"
            );
            goods.forEach(a => {
              a.classList.remove("el-icon-close");
            });
          }
        }, 1000);
      } catch (e) { }
    },
    checkCategoryI(rule, value, callback) {
      let len = this.goodsCategoryI.length;
      if (len != 0) {
        callback();
      } else {
        callback(new Error("请选择经营类目"));
      }
    },
    checkPlatformRatio(rule, value, callback) {
      if (value < 0) {
        return callback(
          new Error("平台比例必须大于或等于0,请正确填写平台比例")
        );
      } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
        return callback(new Error("平台比例最多2位小数"));
      } else {
        callback();
      }
    },
    /**
     * 暂存验证
     */
    saveValid() {
      var self = this;
      let baseValid = this.$commonUtil.formValid.baseValid;
      let isInt = this.$commonUtil.formValid.isInt;
      if (self.entity.deposit_price) {
        isInt(self.entity.deposit_price, "保障金必须为整数");
      }
      baseValid(
        () => (self.entity.goodsCategoryI || []).length == 0,
        "请选择经营类目"
      );

    },
    /**
     * 提交验证
     */
    commitValid() {
      var self = this;
      let baseValid = this.$commonUtil.formValid.baseValid;
      let emptyValid = this.$commonUtil.formValid.isEmpty;
      let isInt = this.$commonUtil.formValid.isInt;
      isInt(self.entity.settle_day, "供应商账期必须为整数");
      if (self.entity.deposit_price) {
        isInt(self.entity.deposit_price, "保障金必须为整数");
      }
      baseValid(
        () => self.entity.is_direct_purchasing == null,
        "请选择是否直购"
      );
      baseValid(
        () => self.entity.deliveryType == null,
        "请选择配送方式"
      );
      baseValid(() => self.entity.isSubAccount == null, "请选择是否分账");
      emptyValid(self.entity.settle_day, "请输入供应商账期");
      emptyValid(self.entity.merchantModel, "请选择销售模式");
      emptyValid(self.entity.contact_email, "请输入结算邮箱");
      emptyValid(self.entity.isAgent, "请选择是否为代理商");
      if (self.entity.isAgent == 1) {
        emptyValid(self.entity.agentCityI, "请输入代理城市");
        baseValid(
          () =>
            (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(self.entity.platform_ratio)),
          "平台比例最多2位小数"
        );
      }
      if ((self.entity.deliveryType == 1 || self.entity.deliveryType == 3) && self.entity.merchantModel != 1) {
        self.$commonUtil.valid.throwEx(
          "配送模式为团购包邮或自提与包邮时，供应商销售模式只能为代销"
        );
      }
      emptyValid(self.entity.contractValidityBegin, "请输入合同有效期起始日期");
      emptyValid(self.entity.contractValidityEnd, "请输入合同有效期结束日期");
      if (this.entity.isSubAccount == 1) {
        if (self.entity.merchantModel == 2) {
          self.$commonUtil.valid.throwEx(
            "经销供应商不参与分账，是否分账请勾选否"
          );
        }
      }
      var tableDataSubmit = (self.entity.afterSaleInfoList || []).filter(
        item => item.contactPerson != ""
      );
      baseValid(
        () =>
          (self.entity.deliveryType == 1 || self.entity.deliveryType == 3) && tableDataSubmit.length == 0,
        "请录入完整的供应商售后信息"
      );
      //判断售后电话格式是否正确
      var mobileReg = /^1[3456789]\d{9}$/;
      var telReg = /^(([04]\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/; // 座机
      (tableDataSubmit || []).forEach(afterSale => {
        emptyValid(() => afterSale.contactPerson, "请输入售后联系人姓名");
        baseValid(
          () =>
            !mobileReg.test(afterSale.phoneNumber) &&
            !telReg.test(afterSale.phoneNumber),
          `售后人${afterSale.contactPerson}的电话号码[${afterSale.phoneNumber}]格式不正确`
        );
      });
    },
    getAgentCityData() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyUserLevel/agentCityList.json",
        data: {},
        contentType: "form", //json,form,multipart
        succ: function (data) {
          self.agentCityIs = data.data;
          //如果是当前用户为城市代理商，则代理城市设置默认值为用户所属的城市
          if (self.baseData.mode == "add") {
            if (data.data != null && self.userAgent != null && self.userAgent == 1) {
              //当用户账号类型为城市级别时
              if (self.$store.state.userInfo.userType == 2) {
                self.formData.agentCityI = data.data[0].admin_shop_id;
              }
            }
          }
        }
      });
    },
    getUserAgentInfo() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyUserLevel/userAgentInfo.json",
        data: {},
        contentType: "form", //json,form,multipart
        succ: function (data) {
          self.userAgent = data.data;
          self.formData.isAgent = String(self.userAgent);
          self.getAgentCityData();
        }
      });
    },
    /**
     * 获取数据
     */
    getData() {
      //获取选中的城市信息
      var self = this;
      //获取数据
      self.formData.baseCategoryIds = self.formData.goodsCategoryI;
      self.formData.supplySiteIds = (this.$refs.tree.getCheckedCityList() || []).map(a => a.admin_shop_id);
      return self.formData;
    }
  }
};
