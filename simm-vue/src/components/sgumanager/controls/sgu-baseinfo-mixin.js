import moment from "moment";
export default {
  data() {
    return {
      leaderGroupsData: [], //差异化分组数据源
      getLeaderGroupsDataCallback: null, //回调事件
      cityIsDiff: null, //城市是否差异化标记
      specList: [],
      specDic: [],
      isLoad: true,
      unAddSpec: false,
      templateList: [],
      saleTypes: this.$cacheUtil.getDic("sale_type").filter(a => a.key != 1),
      onlyPartners: this.$cacheUtil.getDic("only_partner"),
      isCycleOnSaleTypes: this.$cacheUtil.getDic("is_cycle_onsale"),
      exchangeTypes: this.$cacheUtil.getDic("exchange_type"),
      isDiffs: this.$cacheUtil.getDic('isDiff'),
      currentTemplate: {
        distributionTemplateDetailList: []
      },
      onSaleRemark: `1.上架SGU时提前10分钟创建并审核通过,SGU会准时按照上架时间显示在小程序,不会延
迟,(例如：SGU上架时间是20：00,19：50已创建并审核通过,20：00会准时在小程序显示);<br/>
2.若没有提前10分钟创建或者审核通过,毛利值正常时,可人工点击【立即上架】,
毛利值不正常时,采购审核后,点击【立即上架】会在当前时间立即上架;<br/>
3.若没有提前10分钟创建或者审核通过SGU,且没有人工点击【立即上架】,
系统会按照原有规则准点扫描,会有2-5分钟的延迟;<br/>
4.下架时间不会延迟.`,
      formData: {
        grossProfitRate: "", //毛利率
        sguName: "",
        prefixName: "",
        suffixName: "",
        spuId: "",
        spuName: "",
        shareDesc: "",
        supplyId: null,
        supplyName: "",
        prodId: null,
        mainImageUrl: "",
        prodImageUrl: "",
        saleType: "",
        onSaleLevel: "",
        onSaleTime: "",
        takenOffTime: "",
        restrictionStartTime: "",
        restrictionEndTime: "",
        restrictionNumber: "",
        restrictionTypeCode: "",
        postage: "",
        sort: "",
        onSale: null,
        distributionType: "",
        remark: "",
        sysAuditRemark: "",
        distributionTemplateId: "",
        processStatus: "",
        tag: "", // 标签
        deliveryType: "",
        onlyPartner: 0, // 仅团长购买
        isNextDay: "", //是否次日达
        isCycleOnSale: 0,
        exchange: 0,
        cycleDateRange: [],
        cycleTimeRange: ["00:00:00", "23:59:59"],
        cycleStartDate: "",
        cycleStartTime: "",
        cycleEndDate: "",
        cycleEndTime: "",
        cycleTakenOffTime: "",
        isDiff: 0, //是否差异化上架
        leaderGroups: [],
        onSalePickerOptions: {
          disabledDate: this.disableOnSaleDate
        },
        offSalePickerOptions: {
          disabledDate: this.disableOffSaleDate
        },
        onSaleTimeRange: {
          selectableRange: '00:00:00 - 23:59:59'
        },
      },
      rules: {
        isNextDay: [{
          validator: this.numberValid,
          required: true,
          message: "是否次日达不能为空",
          trigger: "change"
        }],
        supplyName: [{
          required: true,
          message: "供应商不能为空",
          trigger: "change"
        }],
        sguName: [{
            required: true,
            message: "销售名称不能为空",
            trigger: "change"
          },
          {
            min: 1,
            max: 24,
            message: "长度在 1 到 24 个字符"
          }
        ],
        distributionType: [{
          validator: this.numberValid,
          required: true,
          message: "配送方式不能为空",
          trigger: "change"
        }],
        distributionTemplateId: [{
          validator: this.numberValid,
          required: true,
          message: "配送范围不能为空",
          trigger: "change"
        }],
        postage: [{
          type: "number",
          min: 0,
          message: "快递运费不能小于0",
          trigger: "blur"
        }],
        saleType: [{
          validator: this.numberValid,
          required: true,
          message: "售卖类型不能为空",
          trigger: "change"
        }],
        onlyPartner: [{
          validator: this.numberValid,
          required: true,
          message: "仅团长购买不能为空",
          trigger: "change"
        }],
        exchange: [{
          validator: this.numberValid,
          required: true,
          message: "是否为换购专区商品不能为空",
          trigger: "change"
        }],
        isCycleOnSale: [{
          validator: this.numberValid,
          required: true,
          message: "上架模式不能为空",
          trigger: "change"
        }],
        defaultTotalSales: [{
            validator: this.numberValid,
            required: true,
            message: "初始销量不能为空",
            trigger: "change"
          },
          {
            type: "number",
            min: 0,
            message: "初始销量不能小于0",
            trigger: "blur"
          }
        ],
        defaultSalePrice: [{
            validator: this.numberValid,
            required: true,
            message: "销售价格不能为空",
            trigger: "change"
          },
          {
            type: "number",
            min: 0.01,
            message: "销售价格要大于0",
            trigger: "blur"
          }
        ],
        defaultSellableStock: [{
            validator: this.numberValid,
            required: true,
            message: "可售数量不能为空",
            trigger: "change"
          },
          {
            type: "number",
            min: 1,
            message: "可售数量要大于0",
            trigger: "blur"
          }
        ],
        // TODO 标签 限制
        tag: [{
            required: false,
            message: "标签不能为空",
            trigger: "change"
          },
          {
            min: 0,
            max: 3,
            message: "长度不超过3个字符"
          }
        ],
        sort: [{
          validator: this.numberValid,
          required: true,
          message: "排序码不能为空",
          trigger: "change"
        }],
        onSaleTime: [{
          required: true,
          message: "上架时间为必填",
          trigger: "change"
        }],
        takenOffTime: [{
          required: true,
          message: "下架时间为必填",
          trigger: "change"
        }],
        cycleDateRange: [{
          validator: this.cycleDateRangeValid,
          required: true,
          message: "售卖日期为必填",
          trigger: "change"
        }],
        cycleTimeRange: [{
          required: true,
          message: "售卖时段为必填",
          trigger: "change"
        }],
        isDiff: [{
          required: true,
          message: "是否差异化上架必填",
          trigger: "change"
        }]
      }
    };
  },
  watch: {
    "formData.saleType": {
      handler: function (val, oldVal) {
        if (this.baseData.cityEdit) {
          this.$set(this.formData, "saleType", val);
          if (val == 2) {
            // 获取实物库存、虚拟销售信息 同步到商品
            this.$set(this.formData, "showRealStock", true);
            this.baseData.getRealStock(this.formData, this.baseData);
          } else if (val === 0) {
            this.$set(this.formData, "showRealStock", false);
            this.baseData.getRealStock(this.formData, this.baseData);
            // 销售类型转换时 才重置商品列表预售信息
            if (oldVal !== "" && oldVal !== val) {
              this.resetStock();
            }
          } else {
            this.$set(this.formData, "showRealStock", false);
            // 销售类型转换时 才重置商品列表预售信息
            if (oldVal !== "" && oldVal !== val) {
              this.resetStock();
            }
          }
        }
        //团购非预售模式，默认次日达
        if (this.baseData.canEdit) {
          if (val !== 0 && this.formData.distributionType === 0) {
            this.formData.isNextDay = 1;
          }
          if (this.formData.deliveryType === 1) {
            //包邮品的 次日达标记为否
            this.formData.isNextDay = 0;
          }
        }
      }
    },
    "formData.distributionType": {
      handler: function (val) {
        //处理平台变更后的信息
        if (val === 1) {
          //分账的直购供应商,只能选择直购模式
          this.saleTypes = [{
            key: 0,
            value: "预售"
          }];
          // 预售保留：分账供应商处理逻辑
          this.formData.saleType = 0;
          //直购默认非次日达
          this.formData.isNextDay = 0;
        } else if (val === 0 && this.formData.deliveryType === 1) {
          // 团购 且 团购包邮
          this.saleTypes = [{
            key: 0,
            value: "预售"
          }];
          this.formData.saleType = 0;
        } else {
          this.resetSaleTypes();
        }
        this.$emit("distributionChange", this.formData);
      }
    },
    "formData.distributionTemplateId": {
      handler: function (val) {
        this.templateChange(val);
      }
    },
    "formData.takenOffTime": {
      handler: function (val, oldVal) {
        //非次日达预计到货时间（下架时间后24小时）
        if (moment(val).format("YYYY-MM-DD") == moment(oldVal).format("YYYY-MM-DD")) {
          return;
        }
        if (val !== "" && this.formData.isNextDay === 0) {
          if (this.formData.id) {
            if (oldVal !== "" && oldVal !== val) {
              this.getArrivalDate();
            }
          } else {
            this.getArrivalDate();
          }
        }
      }
    },
    "formData.isNextDay": {
      handler: function (val, oldVal) {
        //非次日达预计到货时间（下架时间后24小时）
        if (val === 0 && this.formData.takenOffTime !== "") {
          if (this.formData.id) {
            if (oldVal !== "" && oldVal !== val) {
              this.getArrivalDate();
            }
          } else {
            this.getArrivalDate();
          }
        }
      }
    },
    "formData.isCycleOnSale": {
      handler: function (val, oldVal) {
        //非次日达预计到货时间（下架时间后24小时）
        if (oldVal !== val) {
          // 由 分时段切换为 24小时
          if (oldVal == 1) {
            this.clearOnSaleTime();
          } else if (oldVal !== 1 && (this.formData.cycleDateRange || []).length > 0) {
            this.calculateTimes();
          }
        }
      }
    },
    "formData.isDiff": {
      handler: function (val) {
        var self = this;
        if (val === 1) {
          if ((this.leaderGroupsData || []).length == 0) {
            this.getLeaderGroupsData(this.formData.addressCityId || this.$store.state.userInfo.cityId, list => {
              if (self.getLeaderGroupsDataCallback) {
                self.getLeaderGroupsDataCallback(list);
              }
            });
          }
        } else {
          this.formData.leaderGroups = [];
        }
      }
    }
  },
  methods: {
    /**
     * 重置销售模式
     */
    resetSaleTypes() {
      if (this.formData.saleType === 1) {
        //加载的数据是预售或安全库存(旧数据)
        this.saleTypes = this.$cacheUtil.getDic("sale_type");
      } else {
        //分账模式可以使用 预售、库存两种模式
        this.saleTypes = this.$cacheUtil
          .getDic("sale_type")
          .filter(a => a.key != 1);
      }
    },
    cycleDateRangeValid(rule, value, callback) {
      if (this.formData.isCycleOnSale !== 1) {
        return callback();
      }
      if ((value || []).length < 2 || (value || [])[0] === null || (value || [])[0] === "") {
        return callback(new Error(rule.message));
      } else {
        return callback();
      }
    },
    numberValid(rule, value, callback) {
      if (value === "" || value === null || value === undefined) {
        return callback(new Error(rule.message));
      } else {
        return callback();
      }
    },
    rangeValid(rule, value, callback) {
      if (value < rule.min || value > rule.max) {
        return callback(new Error(rule.message));
      } else {
        return callback();
      }
    },
    cycleDateRangeChange(val) {
      var self = this;
      self.formData.cycleDateRange = val;
      // 判空 与 值改变
      if (!val || self.formData.isCycleOnSale !== 1) {
        self.formData.cycleStartDate = "";
        self.formData.cycleEndDate = "";
        return;
      }
      // 拼接 上下架时间
      self.formData.cycleStartDate = val[0];
      self.formData.cycleEndDate = val[1];
      if ((self.formData.cycleTimeRange || []).length > 1) {
        self.formData.cycleStartTime = self.formData.cycleTimeRange[0];
        self.formData.cycleEndTime = self.formData.cycleTimeRange[1];
        self.calculateTimes();
        self.getArrivalDate();
      }
    },
    cycleTimeRangeChange(val) {
      var self = this;
      self.formData.cycleTimeRange = val;
      // 判空 与 值改变
      if (!val || self.formData.isCycleOnSale !== 1) {
        self.formData.cycleStartTime = "00:00:00";
        self.formData.cycleEndTime = "23:59:59";
        self.formData.cycleTimeRange = [];
        self.formData.cycleTimeRange.push(self.formData.cycleStartTime);
        self.formData.cycleTimeRange.push(self.formData.cycleEndTime);
        return;
      }
      self.formData.cycleStartTime = val[0];
      self.formData.cycleEndTime = val[1];
      if (self.formData.cycleStartDate && self.formData.cycleEndDate) {
        self.calculateTimes();
      }
    },
    calculateTimes() {
      var self = this;
      if ((self.formData.cycleDateRange || []).length < 2 ||
        (self.formData.cycleDateRange || [])[0] === null ||
        (self.formData.cycleDateRange || [])[0] === ""
      ) {
        return
      }
      if ((self.formData.cycleTimeRange || []).length < 2 ||
        (self.formData.cycleTimeRange || [])[0] === null ||
        (self.formData.cycleTimeRange || [])[0] === ""
      ) {
        return
      }
      var formatter = "YYYY-MM-DD HH:mm:ss";
      var onSaleTime = self.formData.cycleStartDate + " " + self.formData.cycleStartTime;
      var takenOffTime = self.formData.cycleStartDate + " " + self.formData.cycleEndTime;
      var cycleTakenOffTime = self.formData.cycleEndDate + " " + self.formData.cycleEndTime;
      self.formData.onSaleTime = moment(onSaleTime).format(formatter);
      self.formData.takenOffTime = moment(takenOffTime).format(formatter);
      self.formData.cycleTakenOffTime = moment(cycleTakenOffTime).format(formatter);

    },
    clearOnSaleTime() {
      var self = this;
      self.formData.onSaleTime = "";
      self.formData.takenOffTime = "";
      // self.getArrivalDate();
    },
    /**
     * 上架时间监听
     * @param {*} val
     */
    onSaleTimeChange(val) {
      if (this.formData.takenOffTime > "" && val > this.formData.takenOffTime) {
        this.formData.onSaleTime = "";
        this.$commonUtil.message.alert("上架时间不能大于下架时间");
        return;
      }
    },
    /**
     * 下架时间监听
     * @param {*} val
     */
    takenOffTimeChange(val) {
      if (val > "" && this.formData.onSaleTime > val) {
        this.formData.takenOffTime = "";
        this.$commonUtil.message.alert("下架时间不能小于上架时间");
        return;
      }
      this.formData.takenOffTime = val
      this.getArrivalDate();
    },
    /**
     * 上架时间限制
     * */
    disableOnSaleDate(time) {
      return time.getTime() < new Date().getTime() - 8.64e7;
    },
    selectableRange() {
      return
    },
    /**
     * 下架时间限制
     * */
    disableOffSaleDate(time) {
      return time.getTime() < new Date().getTime() - 8.64e7;
    },
    /**
     * 商品列表
     */
    prodChange(list) {
      var spuName = this.formData.sguName
        .replace(this.formData.prefixName || "", "")
        .replace(this.formData.suffixName || "", "");
      this.specList = (list || []).map(a =>
        a.prodName.replace(spuName || "", "")
      );
    },

    /**
     * 获取模板列表
     */
    getTemplateList() {
      var self = this;
      this.$httpUtil.post({
        url: "/distributionTemplate/list.json",
        contentType: "form",
        data: {
          page: 1,
          pagesize: 9999
        },
        succ: function (data) {
          self.templateList = (data.data || []).filter(a => a.valid == 1);
        }
      });
    },
    /**
     * 获取模板明细信息
     */
    templateChange(id) {
      if (id == null || id == undefined) return;
      var self = this;
      this.$httpUtil.post({
        url: "/distributionTemplate/getDetail.json?id=" + id,
        succ: function (data) {
          self.currentTemplate = data.data;
        }
      });
    },
    updateSguName(val) {
      this.formData.sguName =
        this.formData.prefixName +
        this.formData.spuName +
        this.formData.suffixName;
    },
    //获取预计到货时间
    getArrivalDate() {
      var self = this;
      // 提交审核后 不触发 预计到货时间计算
      let time = new Date(self.formData.takenOffTime);
      if (self.formData.isCycleOnSale == 1) {
        // 分时段上架时 切换是否次日达 触发一次时间计算
        time = new Date(self.formData.cycleTakenOffTime);
      }
      let setArrivalDate = prod => {
        prod.arrivalDate = new Date();
        prod.arrivalDate = moment(
          prod.arrivalDate.setTime(time.getTime() + 24 * 60 * 60 * 1000)
        ).format("YYYY-MM-DD HH:mm:ss");
      };
      (self.formData.sguProdInfoList || []).forEach(prod => {
        setArrivalDate(prod);
      });
      //城市或直购
      ((self.formData.direct || {}).sguProdInfoList || []).forEach(prod => {
        setArrivalDate(prod);
      });
    },
    exchangeTypeChange(val) {
      if (this.formData.exchange === 1) {
        if (this.entity.sguProdInfoList != null && this.entity.sguProdInfoList.length > 1) {
          this.formData.exchange = 0;
          this.$commonUtil.valid.throwEx("换购SGU只允许添加一个规格商品上架");
        }
      }
    },
    getLeaderGroupsData(cityId, callback) {
      var self = this;
      self.$httpUtil.post({
        url: "/sguBaseInfo/getLeaderGroups.json",
        data: {
          admin_shop_id: cityId
        },
        contentType: "form",
        succ: function (data) {
          if ((data.data || []).length > 0) {
            self.leaderGroupsData = data.data.map(a => {
              return {
                key: a.id,
                value: a.groupName
              }
            });
            if (callback) {
              callback(self.leaderGroupsData);
            }
          }
        }
      })
    },
  }
};