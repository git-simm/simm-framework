import moment from "moment";
export default {
  data: function () {
    var checkNum = (rule, value, callback) => {
      if (this.formDate.prodType != 3) {
        if (!Number(value) || Number(value) < 1) {
          return callback(new Error("请正确填写起订量"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkGoodsPrice = (rule, value, callback) => {
      if (!Number(value) && value > 0) {
        return callback(new Error("请正确填写商品价格"));
      } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,6})?$/.test(value)) {
        return callback(new Error("订货单价最多6位小数"));
      } else {
        callback();
      }
    };
    var checkProdPrice = (rule, value, callback) => {
      if (!Number(value) && value > 0) {
        return callback(new Error("请正确填写销售价格"));
      } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
        return callback(new Error("销售价格最多2位小数"));
      } else {
        callback();
      }
    };

    var checkPlatformFee = (rule, value, callback) => {
      if (value < 0) {
        return callback(
          new Error("平台服务费必须大于或等于0,请正确填写平台服务费")
        );
      } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
        return callback(new Error("平台服务费最多2位小数"));
      } else {
        callback();
      }
    };

    var checkProportion = (rule, value, callback) => {
      if (value < 0) {
        return callback(
          new Error("平台比例必须大于或等于0,请正确填写平台服务费和销售价")
        );
      } else if (value >= 99.4) {
        return callback(
          new Error("平台比例必须小于99.4%,请正确填写平台服务费和销售价")
        );
      } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
        return callback(new Error("平台比例最多2位小数"));
      } else {
        callback();
      }
    };
    var checkUnitBoxNum = (rule, value, callback) => {
      if (this.formDate.unit_box_number != null && this.formDate.unit_box_number != '') {
        if (!Number(value) || Number(value) < 1) {
          return callback(new Error("请正确填数量"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      roleType: this.$store.state.userInfo.userType,
      salesMultipleFruit: 0,
      categoryId: "",
      paramsFlag: true,
      skuFlag: false,
      checkedstatus: [],
      userInfo: this.$store.state.userInfo,
      supplyNumberData: [],
      unitBoxData: [],
      supplyData: [],
      jgSupply: {},
      prodAfterTime: null,
      formDate: {
        spuId: null,
        spuNumber: null,
        agent_city: "",
        platformRatio: 0,
        isAgent: null,
        isOnSale: true,
        sub_account_prod_price: "",
        sub_account_proportion: 0,
        is_direct_purchasing: null,
        merchant_model: "", // 供应商类型
        is_sub_account: null,
        prod_name: "", // string
        prod_price: "", // number
        platform_service_fee: 0,
        payCommissionFee: 0, //支付手续费 （销售价*0.6%）
        prod_number: "",
        specification: "",
        unit_name: "",
        unit_box_name: "",
        unit_box_number: null,
        supply_site_id: "",
        prod_category_id: "",
        purchase_supply_id: "",
        supply_number: "",
        purchase_supply_prod_number: "",
        recommend_content: "",
        bar_code: "", // stringrj
        onsale_end_at: null,
        rrp: "",
        purchase_price: "",
        note: "", // 备注
        tax: "",
        category_name: "",
        two_category_name: "",
        three_category_name: "",
        storage_method: "",
        qdl: "",
        afterTime: null,
        isPayByBalance: 1,
        dynamicTags: [
          {
            id: 1,
            label_name: "新品发版1"
          },
          {
            id: 2,
            label_name: "新品发版2"
          },
          {
            id: 3,
            label_name: "新品发版3"
          }
        ],
        // selectTags: [],
        thumbnailsuo_url: "", // 缩略图
        main_pic: [], // 主图
        detail_pic: [], // 详情图
        main_pic_list: [],
        main_video_list: [],
        detail_pic_list: [],
        sort: 0, // number
      },
      rules: {
        prod_name: [
          {
            required: true,
            message: "商品名称必填",
            trigger: "blur"
          }
          // {
          //   min: 1,
          //   max: 40,
          //   message: '长度在 1 到 40 个字符',
          //   trigger: 'blur'
          // }
        ],
        unit_name: [
          {
            required: true,
            message: "商品单位必填",
            trigger: "blur"
          },
          {
            min: 1,
            max: 4,
            message: "长度在 1 到 4个字符",
            trigger: "blur"
          }
        ],
        sort: [
          {
            type: "integer",
            required: true,
            message: "必须为整数",
            trigger: "blur"
          }
        ],
        prod_number: [
          {
            type: "string",
            required: true,
            message: "请输入SKU编码",
            trigger: "blur"
          }
        ],
        afterTime: [
          {
            type: "number",
            required: true,
            message: "请输入商品售后时效(正整数)",
            trigger: "blur"
          },
          {
            pattern: /^[+]{0,1}(\d+)$/,
            message: "请输入商品售后时效(正整数)",
            trigger: "blur"
          }
        ],
        bar_code: [
          {
            type: "string",
            required: true,
            message: "SKU编码必填",
            trigger: "blur"
          }
        ],
        prod_price: [
          {
            required: true,
            message: "请输入正确的商品价格",
            trigger: "blur"
          },
          {
            validator: checkGoodsPrice,
            trigger: "blur"
          }
        ],
        sub_account_prod_price: [
          {
            required: true,
            message: "请输入正确的售卖价格",
            trigger: "blur"
          },
          {
            validator: checkProdPrice,
            trigger: "blur"
          }
        ],
        platform_service_fee: [
          {
            required: true,
            message: "请输入正确的平台服务费",
            trigger: "blur"
          },
          {
            validator: checkPlatformFee,
            trigger: "blur"
          }
        ],
        sub_account_proportion: [
          {
            type: "number",
            required: true,
            message: "请输入正确的平台比例",
            trigger: "blur"
          },
          {
            validator: checkProportion,
            trigger: "blur"
          }
        ],
        purchase_supply_id: [
          {
            type: "number",
            required: true,
            message: "请选择供应商",
            trigger: "change"
          }
        ],
        prod_category_id: [
          {
            type: "number",
            required: true,
            message: "请选择商品类目",
            trigger: "change"
          }
        ],
        purchase_supply_prod_number: [
          {
            required: true,
            message: "请输入采购商品",
            trigger: "change"
          }
        ],
        min_amount: [
          {
            type: "integer",
            required: true,
            message: "请输入正确的起订量（整数，非空）",
            trigger: "blur"
          }
        ],
        specification: [
          {
            required: true,
            message: "请填写规格",
            trigger: "blur"
          }
        ],
        supply_site_id: [
          {
            required: true,
            type: "number",
            message: "请填写所属分站",
            trigger: "change"
          }
        ],
        qdl: [
          {
            required: true,
            type: "number",
            message: "请输入起订量",
            trigger: "blur"
          },
          {
            validator: checkNum,
            trigger: "blur"
          }
        ],
        unit_box_number: [
          {
            required: false,
            message: "请输入(正整数)",
            trigger: "blur"
          },
          {
            validator: checkUnitBoxNum,
            trigger: "blur"
          }
        ],
        isPayByBalance: [
          {
            required: true,
            type: "number",
            message: "请选择是否支持余额支付",
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
    /**
     * 保存数据的相关处理
     * @param {*} typeValue
     */
    submitFun(typeValue) {
      var self = this;
      var store = this.$store;
      var request = {};
      request.isPayByBalance = self.formDate.isPayByBalance;
      request.bar_code = self.formDate.bar_code;
      request.afterTime = self.formDate.afterTime;
      if (request.afterTime > this.prodAfterTime) {
        self.$commonUtil.valid.throwEx(
          "售后时效修改时间不得大于商品中心设置的售后时效，如有异议请联系商品中心"
        );
      }
      self.formDate.payCommissionFee = Math.round(self.formDate.sub_account_prod_price * 0.006 * 100) / 100;
      if (self.formDate.payCommissionFee >= parseFloat(self.formDate.prod_price).toFixed(2)) {
        self.$commonUtil.valid.throwEx(
          "平台服务费过高，供应商无法支付分账手续费，请重新设置"
        );
      }
      self.formDate.onsale_end_at &&
        moment(self.formDate.onsale_end_at)._isValid === true
        ? (request.onsale_end_at = moment(self.formDate.onsale_end_at).format(
          "YYYY-MM-DD HH:mm:ss"
        ))
        : (request.onsale_end_at = "");
      // request.rrp = self.formDate.rrp
      self.$refs.prodPrice.getCityPriceData(userLevelPrice => {
        //为城市状态赋值
        if (self.roleType == 2 || self.roleType == 3) {
          (userLevelPrice || []).forEach(city => {
            city.status = self.formDate.isOnSale ? 1 : 0;
            city.valid = self.formDate.isOnSale;
            //供应商平台修改分账比列，同步
            if (self.formDate.isAgent == 1) {
              city.sub_account_proportion = self.formDate.platformRatio;
            }
          });
        }
        request.prod_user_level_price = JSON.stringify(userLevelPrice);
        request.purchase_price = self.formDate.purchase_price;

        let detailPic = [];
        for (var d of self.formDate.detail_pic_list) {
          if (d.url && d.url.includes("blob")) {
            self.$commonUtil.valid.throwEx("商品详情图还未上传完毕，请稍等...");
          }
          detailPic.push(d.url);
        }
        if (detailPic.length > 10) {
          self.$commonUtil.valid.throwEx("商品详情图最多只能上传10张");
        }
        request.detail_pic = detailPic.toString();
        request.is_pay_on_delivery = 0;//Number(self.formDate.is_pay_on_delivery);
        request.label_ids = "";

        let mainPic = [];
        for (var m of self.formDate.main_pic_list) {
          if (m.url && m.url.includes("blob")) {
            self.$commonUtil.valid.throwEx("商品主图还未上传完毕，请稍等...");
          }
          mainPic.push(m.url);
        }
        if (mainPic.length > 10) {
          self.$commonUtil.valid.throwEx("商品主图最多只能上传10张");
        }
        request.main_pic = mainPic.toString();
        if (mainPic.length > 0) {
          request.thumbnailsuo_url = mainPic[0];
        }
        // TODO 商品视频 校验上传是否成功 而后赋值
        // 限制视频上传过程中的提交
        let videoIsUploading = this.$refs.mainVideo.getVideoUploadStatus();
        if (videoIsUploading) {
          self.$commonUtil.valid.throwEx("商品视频正在上传中,请稍等...");
        }
        let mainVideo = [];
        for (var m of self.formDate.main_video_list) {
          if (m.url && m.url.includes("blob")) {
            self.$commonUtil.valid.throwEx("商品视频未上传完毕");
          }
          if (m.url) { // 校验视频时长
            var duration = document.getElementById(m.url).duration;
            if (duration && duration > 180) {
              self.$commonUtil.valid.throwEx("视频长度超过3分钟,请删除后重新上传!");
            }
          }
          mainVideo.push(m.url);
        }
        request.main_video = mainVideo.toString();

        request.platform_service_fee = self.formDate.platform_service_fee;
        request.sub_account_prod_price = self.formDate.sub_account_prod_price;
        if (self.formDate.isAgent == 0) {
          request.sub_account_proportion = self.formDate.sub_account_proportion;
        } else {
          request.sub_account_proportion = self.formDate.platformRatio;
        }
        request.isOnSale = typeValue == 2 ? 1 : 0; // 提交时状态为 可订货 保存时 为不可订货
        request.prod_name = self.formDate.prod_name;
        request.recommend_content = self.formDate.recommend_content;
        request.prod_number = self.formDate.prod_number;
        request.prod_price = self.formDate.prod_price;
        request.sort = self.formDate.sort;
        request.specification = self.formDate.specification;
        request.supply_site_id = self.formDate.supply_site_id;
        request.prod_category_id = self.formDate.prod_category_id;
        request.purchase_supply_id = self.formDate.purchase_supply_id;
        request.purchase_supply_prod_number =
          self.formDate.purchase_supply_prod_number || "";
        request.qdl = self.formDate.qdl;
        request.note = self.formDate.note;
        request.unit_name = self.formDate.unit_name;
        request.box_gauge = self.salesMultipleFruit;
        request.unit = self.formDate.unit_name;
        request.sales_multiple = self.formDate.qdl;
        request.is_fruit = 0;
        request.saveType = typeValue;
        request.unit_box_name = self.formDate.unit_box_name;
        request.unit_box_number = self.formDate.unit_box_number;
        if ((request.unit_box_name == null || request.unit_box_name == '') && (request.unit_box_number != null && request.unit_box_number != '')) {
          self.$commonUtil.valid.throwEx(
            "箱规未填写完整"
          );
        }
        var jsondata = Object.assign(request, {
          token: store.state.token,
          tokenid: store.state.tokenid
        });
        self.$httpUtil.post({
          url: "/prodInfo/doaddallgys.json",
          contentType: "form",
          data: jsondata,
          succ: function (data) {
            self.$message({
              message: "添加成功!",
              type: "success"
            });
            self.isRepeatSave(null, () => {
              setTimeout(function () {
                self.$router.push({
                  path: "/prod/prodmanage/list"
                });
              }, 1500);
            });
          }
        });
      });
    },
    /**
     * 表单提交
     * @param {*} formName
     * @param {*} typeValue
     */
    submitForm(formName, typeValue) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if ((self.formDate.main_pic_list || []).length == 0) {
            self.$commonUtil.valid.throwEx("商品主图不能为空");
          }
          this.$confirm(
            1 == typeValue ? "确认保存？" : "确认提交？",
            "提示",
            {
              confirmButtonText: 1 == typeValue ? "继续保存" : "继续提交",
              cancelButtonText: "再看看"
            }
          )
            .then(() => {
              this.submitFun(typeValue);
            })
            .catch(() => {
              return false;
            });
        } else {
          self.$commonUtil.valid.throwEx("填写信息不完整，请完善后再提交");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
};
