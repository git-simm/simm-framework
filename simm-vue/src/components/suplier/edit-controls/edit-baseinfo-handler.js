export default {
  data() {
    return {
      formData: {
        supply_number: `GYS${this.uniqueId()}`,
        supply_name: "",
        contact_person: "",
        supply_identity: "",
        addressArr: [],
        supplyShortName: "",
        contact_phone: "",
        supply_note: "",
        address_detail_id: "",
        address_detail: "",
        address_province: "",
        address_city: "",
        address_district: "",
        address_province_id: "",
        address_city_id: "",
        address_district_id: ""
      },
      rules: {
        supply_number: [
          {
            required: true,
            message: "请输入供应商编码",
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
        contact_person: [
          {
            required: true,
            message: "请输入联系人姓名",
            trigger: "change"
          }
        ],
        supply_identity: [
          {
            required: true,
            type: "number",
            message: "请选择供应商类型",
            trigger: "change"
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
        supplyShortName: [
          {
            required: true,
            message: "请输入供应商简称",
            trigger: "change"
          },
          {
            validator: this.$commonUtil.formValid.checkChinese,
            message: "供应商简称只能输入中文",
            trigger: "blur"
          }
        ],
        contact_phone: [
          {
            required: true,
            message: "请输入联系人电话",
            trigger: "change"
          },
          {
            validator: this.$commonUtil.formValid.checkMobile,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        supply_note: [
          {
            required: true,
            message: "请输入公司说明",
            trigger: "change"
          }
        ],
        address_detail: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    /**
     * 暂存验证
     */
    saveValid() {
      let emptyValid = this.$commonUtil.valid.emptyValid;
      let isChinese = this.$commonUtil.formValid.isChinese;
      let isMobile = this.$commonUtil.formValid.isMobile;
      emptyValid(this.entity.supply_name, "请输入供应商名称");
      emptyValid(this.entity.supply_identity, "请选择供应商类型");
      if (this.entity.supplyShortName > "") {
        isChinese(this.entity.supplyShortName, "供应商简称只能输入中文");
      }
      if (this.entity.contact_phone > "") {
        isMobile(this.entity.contact_phone, "手机号格式不正确");
      }
    },
    /**
     * 提交验证
     */
    commitValid() {
      var self = this;
      let baseValid = this.$commonUtil.valid.baseValid;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      let isChinese = this.$commonUtil.formValid.isChinese;
      let isMobile = this.$commonUtil.formValid.isMobile;
      emptyValid(self.entity.contact_person, "请输入联系人姓名");
      emptyValid(self.entity.contact_phone, "请输入联系人电话");
      isMobile(self.entity.contact_phone, "手机号格式不正确");
      emptyValid(self.entity.supplyShortName, "请输入供应商简称");
      isChinese(self.entity.supplyShortName, "供应商简称只能输入中文");
      emptyValid(self.entity.addressArr.length, "请选择公司地址");
      emptyValid(self.entity.address_detail, "请输入详细地址");
    },
    /**
     * 获取数据
     */
    getData() {
      return this.formData;
    },
    /**
     * 地址变更
     * @param {*} item
     */
    onProvincesChange(item) {
      var nodes = this.$refs["cascaderAddr"].getCheckedNodes() || [];
      if (nodes.length > 0) {
        var pathLabels = nodes[0].pathLabels || [];
        if (pathLabels.length > 0) {
          this.formData.address_province = pathLabels[0] || "";
          this.formData.address_province_id = this.formData.addressArr[0] || "";
        }
        if (pathLabels.length > 1) {
          this.formData.address_city = pathLabels[1] || "";
          this.formData.address_city_id = this.formData.addressArr[1] || "";
        }
        if (pathLabels.length > 2) {
          this.formData.address_district = pathLabels[2] || "";
          this.formData.address_district_id = this.formData.addressArr[2] || "";
        }
      } else {
        this.formData.address_province = "";
        this.formData.address_city = "";
        this.formData.address_district = "";
        this.formData.address_province_id = "";
        this.formData.address_city_id = "";
        this.formData.address_district_id = "";
      }
    }
  }
};
