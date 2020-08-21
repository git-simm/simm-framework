import {
  console
} from "vuedraggable/src/util/helper";

let math = require("mathjs");
export default {
  methods: {
    /**
     * 是否为次日达
     * @param {*} formData
     */
    isNextDayTo(formData) {
      //商城 & 非预售模式，为次日达
      return formData.isNextDay === 1;
    },
    /**
     * 成功后回调
     * @param {*} msg
     * @param {*} callback
     */
    success(msg, callback) {
      var self = this;
      self.$message({
        message: msg,
        type: "success"
      });
      if (callback) {
        setTimeout(callback, 1500);
      }
    },
    /**
     * 组装业务数据
     * @param {*} data
     */
    // TODO 待处理 城市上架数据
    wrapData(data) {
      //1.直购模式下，直接组装一个全国售卖的数据
      if (data.distributionType == 1 || this.baseData.cityEdit) {
        //城市对应的商品数据
        data.sguProdInfoList.forEach(a => {
          var copy = JSON.parse(JSON.stringify(a));
          copy.sguProdId = copy.id;
          delete copy.id;
          //直购上架判断 是否已经组装了 全国城市 的信息
          if (
            data.distributionType == 1 &&
            (a.sguProdSaleScopes || []).length == 0
          ) {
            //商品没有生成对应的商品数据，则需要生成一条全国的城市信息
            a.sguProdSaleScopes = [];
            copy.addressProvinceId = 1;
            copy.addressProvince = "全国";
            copy.addressCityId = 1;
            copy.addressCity = "全国";
            copy.valid = 1;
            a.sguProdSaleScopes.push(copy);
          } else if (
            this.baseData.cityEdit &&
            (a.sguProdSaleScopes || []).length == 0
          ) {
            // 城市上架 区域信息从操作人上取
            a.sguProdSaleScopes = [];
            copy.addressProvinceId = this.baseData.userInfo.supply_site_id;
            copy.addressProvince = this.baseData.userInfo.provinceName;
            copy.addressCityId = this.baseData.userInfo.cityId;
            copy.addressCity = this.baseData.userInfo.cityName;
            copy.valid = 1;
            a.sguProdSaleScopes.push(copy);
          } else {
            //如果全国的城市信息已经存在，则需要更新其信息，将其与商品信息同步
            a.sguProdSaleScopes.forEach(scope => {
              //取最新的数据
              for (var p in copy) {
                scope[p] = copy[p];
              }
              //安全库存初始化
              scope.safeStock = scope.sellableStock;
              scope.valid = 1;
            });
          }
        });
      }
    },
    /**
     * 直购或者城市上架数据反向组装(老数据处理)
     */
    // TODO 城市上架 待验证
    alterWrapDirectData(data) {
      if (data.distributionType == 1 || this.baseData.cityEdit) {
        let props = [
          "salePrice",
          "marketPrice",
          "commissionAmount",
          "boughtPeople",
          "initSales",
          "sellableStock",
          "arrivalDate",
          "isLimit",
          "limitAmount",
          "prodDesc",
        ];
        //城市对应的商品数据
        data.sguProdInfoList.forEach(a => {
          //如果全国的城市信息已经存在，则需要更新其信息，将其与商品信息同步
          a.sguProdSaleScopes.forEach(scope => {
            //取最新的数据
            for (var i in props) {
              var p = props[i];
              a[p] = scope[p];
            }
          });
        });
      }
    },
    /**
     * 保存数据
     * @param {*} formData
     */
    save(formData) {
      var self = this;
      this.entity = {
        ...this.entity,
        ...formData
      };
      //存在id,则为更新模式
      var url = "/sguBaseInfo/save.json";
      if (this.entity.id) {
        url = "/sguBaseInfo/update.json";
      }
      if (
        this.entity.processStatus == 3 &&
        this.entity.distributionType == this.baseData.distributionMode.store
      ) {
        //商城 & 审核通过的情况下,需要校验是否存在上架城市
        if (
          !this.entity.sguProdInfoList.some(prod =>
            prod.sguProdSaleScopes.some(scope => scope.valid == 1)
          )
        ) {
          //如果没有一个城市设置为上架状态,则不允许提交(直购会默认一个全国城市，商城会出现不选择上架城市的情况)
          this.active = 1;
          this.$commonUtil.valid.throwEx(`请至少选择一个上架城市`);
        }
      }
      if (this.entity.exchange === 1) {
        if (this.entity.sguProdInfoList.length > 1) {
          this.$commonUtil.valid.throwEx(`换购SGU只允许添加一个规格商品上架`);
        }
      }
      if (this.entity.isDiff == 1 && (this.entity.leaderGroups || []).length == 0) {
        this.$commonUtil.valid.throwEx(`请选择售卖分组`);
      }
      if (
        this.$commonUtil.valid.isEmpty(this.entity.processStatus) ||
        this.entity.processStatus == -2 ||
        this.entity.processStatus == 0
      ) {
        //提交前校验
        if (self.syncProdToCity()) return;
        self.$httpUtil.post({
          url: url,
          data: self.entity,
          succ: function (data) {
            //返回列表页面
            self.success("保存成功", self.baseData.goBack);
          }
        });
      } else {
        //提交后校验
        this.alterWrapDirectData(this.entity);
        this.valid(this.entity);
        this.$refs.baseInfo.$refs["formData"].validate(valid => {
          if (valid) {
            if (self.syncProdToCity()) return;
            // TODO 验证 剔除营销活动校验
            self.$httpUtil.post({
              url: url,
              data: self.entity,
              succ: function (data) {
                //返回列表页面
                self.success("保存成功", self.baseData.goBack);
              }
            });
          } else {
            //校验出错，返回到第一个页签
            self.active = 0;
            self.$commonUtil.valid.throwEx(`信息填写不完整，请完善后再提交`);
            return false;
          }
        });
      }
    },
    /**
     * 提交请求
     * @param {*} formData
     */
    submit(formData) {
      var self = this;
      this.entity = {
        ...this.entity,
        ...formData
      };
      //提交时，先组装一个全国上架的城市数据
      this.wrapData(this.entity);
      var warnList = this.valid(this.entity);
      if (
        !this.entity.sguProdInfoList.some(prod =>
          prod.sguProdSaleScopes.some(scope => scope.valid == 1)
        )
      ) {
        //如果没有一个城市设置为上架状态,则不允许提交(直购会默认一个全国城市，商城会出现不选择上架城市的情况)
        this.active = 1;
        this.$commonUtil.valid.throwEx(`请至少选择一个上架城市`);
      }
      if (this.entity.isDiff == 1 && (this.entity.leaderGroups || []).length == 0) {
        this.$commonUtil.valid.throwEx(`请选择售卖分组`);
      }
      this.$refs.baseInfo.$refs["formData"].validate(valid => {
        if (valid) {
          if (warnList.length > 0) {
            //有报警信息，则弹出提示
            self.$commonUtil.message.confirm(`${warnList.join(",")},确定要继续提交吗?`, () => {
              self.baseCommit();
            });
          } else {
            self.baseCommit();
          }
        } else {
          //校验出错，返回到第一个页签
          self.active = 0;
          self.$commonUtil.valid.throwEx(`信息填写不完整，请完善后再提交`);
          return false;
        }
      });
    },
    /**
     * 基础提交方法
     */
    baseCommit() {
      var self = this;
      //存在id,则为更新模式
      var url = "/sguBaseInfo/addCommit.json";
      if (this.entity.id) {
        url = "/sguBaseInfo/updateCommit.json";
      }
      this.$httpUtil.post({
        url: url,
        data: self.entity,
        succ: function (data) {
          self.success("提交成功", self.baseData.goBack);
        }
      });
    },
    /**
     * 提交前校验
     * @param {*} formData
     * @param {*} tab
     */
    valid(formData, tab) {
      var warnList = [];
      if (tab == undefined || tab == null) {
        tab = 100;
      }
      var self = this;
      let isChinese = this.$commonUtil.formValid.regexEnum.chinese;
      let prodInfoValid1 = (prod, val, msg, extend) => {
        self.prodInfoValid(prod, val, msg, extend, p => `[${p.prodName}]`,
          () => {
            self.active = 0;
          }
        );
      };
      let prodInfoValid2 = (prod, val, msg, extend) => {
        self.prodInfoValid(prod, val, msg, extend,
          p => {
            return `${prod.addressProvince || ""}-${prod.addressCity || ""}-[${
              prod.prodName
              }]`;
          },
          () => {
            self.active = (self.steps.length - 1);
          }
        );
      };
      // 校验逻辑
      if (formData.tag > "" && !isChinese.test(formData.tag)) {
        this.$commonUtil.valid.throwEx(`标签只能输入中文`);
      }
      if (formData.isCycleOnSale == 1) { // 分时段商家校验 时段信息非空
        if ((formData.cycleDateRange || []).length < 1) {
          this.$commonUtil.valid.throwEx(`请选择售卖日期`);
        }
        if ((formData.cycleTimeRange || []).length < 1) {
          this.$commonUtil.valid.throwEx(`请选择售卖时段`);
        }
      }
      if (formData.saleType === 0 && formData.distributionType === 0) {
        if (formData.isNextDay === "") {
          this.$commonUtil.valid.throwEx(`请选择是否次日达`);
        }
      }
      // 分页签进行校验(tab等于100是执行所有所有的校验，不区分页签)
      if (tab == 100 || tab == 0) {
        //1.判断商品列表是否为空
        if ((formData.sguProdInfoList || []).length === 0) {
          self.active = 0;
          this.$commonUtil.valid.throwEx(`商品列表不能为空`);
        } else {
          formData.sguProdInfoList.forEach(a => self.fieldValid(a, prodInfoValid1, formData));
        }
        //2.校验图片是否为空
        if ((formData.mainPicList || []).length === 0) {
          self.active = 0;
          this.$commonUtil.valid.throwEx(`请上传SGU主图-小图`);
        }
      }
      if (this.entity.exchange === 1) {
        if (this.entity.sguProdInfoList.length > 1) {
          this.$commonUtil.valid.throwEx(`换购SGU只允许添加一个规格商品上架`);
        }
      }
      if (tab == 100 || tab == 1) {
        //商城需要校验城市明细信息
        if (formData.distributionType === 0) {
          // Error级别的校验
          formData.sguProdInfoList.forEach(a => {
            a.sguProdSaleScopes.forEach(scope => {
              //分账SGU 如果城市不选择上架的话，则不校验其明细
              if (formData.isSubAccount === 1 && scope.valid !== 1) {
                if (!scope.salePrice) {
                  scope.salePrice = 0;
                }
                return;
              }
              self.fieldValid(scope, prodInfoValid2, formData);
            });
          });
          // Warning级别的校验
          // TODO: 验证团长佣金是否为0,需要进行二次提示
          formData.sguProdInfoList.forEach(a => {
            a.sguProdSaleScopes.forEach(scope => {
              //分账SGU 如果城市不选择上架的话，则不校验其明细
              if (formData.isSubAccount === 1 && scope.valid !== 1) {
                return;
              }
              var msg = self.fieldWarning(scope, prodInfoValid2, formData);
              if (msg) {
                warnList.push(msg);
              }
            });
          });
        }
      }
      return warnList;
    },
    /**
     * 字段校验(warning级别)
     * @param {*} prod
     * @param {*} validFunc
     * @param {*} formData
     */
    fieldWarning(prod, validFunc, formData) {
      try {
        validFunc(prod, prod.commissionAmount, "团长佣金", {
          min: 0,
          minClose: false,
          noAlert: true
        });
        return null;
      } catch (ex) {
        if (prod.commissionAmount === 0) {
          return (ex.message || "").replace("不能小于", "等于");
        }
        return ex.message;
      }
    },
    /**
     * 字段校验
     * @param {*} prod
     * @param {*} validFunc
     * @param {*} formData
     */
    fieldValid(prod, validFunc, formData) {
      var isNextArrival = this.isNextDayTo(formData);
      validFunc(prod, prod.salePrice, "销售价", {
        min: 0.01,
        minClose: true
      });
      if (formData.isSubAccount === 1) {
        //分账成本价需要>0
        validFunc(prod, prod.prodPrice, "成本价", {
          min: 0
        });
      } else {
        //非分账成本价不能为空
        validFunc(prod, prod.prodPrice, "成本价", {
          min: 0,
          minClose: true
        });
      }
      validFunc(prod, prod.marketPrice, "划线价", {
        min: prod.salePrice,
        minClose: true,
        twoDecimals: true
      });
      validFunc(prod, prod.commissionAmount, "团长佣金", {
        min: 0,
        minClose: true
      });
      if (prod.isLimit == 1) {
        //如果设置了限购，要校验限购数量大于0
        validFunc(prod, prod.limitAmount, "限购数量", {
          min: 0,
          isInteger: true,
          minClose: false
        });
      }
      if (formData.isAgent === 1) {
        //代理商的团长佣金不能大于成本价
        validFunc(prod, prod.commissionAmount, "团长佣金", {
          max: prod.prodPrice
        });
      }
      if (formData.distributionType === 1) {
        validFunc(prod, prod.commissionAmount, "团长佣金", {
          min: 0,
          minClose: false
        });
      }
      if (formData.saleType != 2) {
        let validZero = val => {
          return (
            val === "" ||
            val === null ||
            val === undefined ||
            val === 0 ||
            val === "0"
          );
        };
        if (!(validZero(prod.boughtPeople) && validZero(prod.initSales))) {
          // 虚拟销量校验
          validFunc(prod, prod.initSales, "虚拟销量", {
            min: Math.max(Number(prod.boughtPeople), 3),
            minClose: true,
            isInteger: true
          });
          validFunc(prod, prod.boughtPeople, "虚拟人数", {
            min: 3,
            minClose: true,
            max: prod.initSales,
            maxClose: true,
            isInteger: true
          });
        }
        //非实物库存 需要校验(初始销量/可售库存)  审核通过不校验
        if (formData.processStatus != 3) {
          validFunc(prod, prod.sellableStock, "可售数量", {
            min: 0,
            isInteger: true
          });
        }
      }
      if (!isNextArrival) {
        if (Number(formData.deliveryType) === 1) {
          //包邮品需要校验 预计发货时间
          validFunc(prod, prod.sendHours, "预计发货时间", {
            min: 24,
            minClose: true,
          });
        } else if (formData.distributionType === 0) {
          //非次日达需要设置[预计到货时间]
          validFunc(prod, prod.arrivalDate, "预计到货时间");
        }
      }
    },
    /**
     * 商品信息审批
     * @param {*} prod
     * @param {*} val
     * @param {*} msg
     * @param {*} extend
     * @param {*} getName
     * @param {*} handler
     */
    prodInfoValid(prod, val, msg, extend, getName, handler) {
      var self = this;
      let callback = message => {
        if (handler) {
          handler();
        }
        if (extend.noAlert) {
          throw new Error(message);
        } else {
          // 弹出错误信息
          self.$commonUtil.valid.throwEx(message);
        }
      };
      var title = getName(prod);
      if (self.$commonUtil.valid.isEmpty(val)) {
        callback(`${title}的${msg}未填写`);
      }
      if (extend) {
        if (extend.min != null) {
          var b = extend.minClose ?
            Number(val) < Number(extend.min) :
            Number(val) <= Number(extend.min);
          if (b) {
            callback(`${title}的${msg}不能小于${extend.min}`);
          }
        }
        if (extend.max != null) {
          var b = extend.maxClose ?
            Number(val) > Number(extend.max) :
            Number(val) >= Number(extend.max);
          if (b) {
            callback(`${title}的${msg}不能大于${extend.max}`);
          }
        }
        // 加整数校验
        if (extend.isInteger != null && extend.isInteger) {
          var b = this.$commonUtil.formValid.regexEnum.integer.test(val);
          if (!b) {
            callback(`${title}的${msg}必须为整数`);
          }
        }

        // 加小数位数校验 twoDecimals
        if (extend.twoDecimals != null && extend.twoDecimals) {
          var b = this.$commonUtil.formValid.regexEnum.twoDecimals.test(val);
          if (!b) {
            callback(`${title}的${msg}最多只允许输入两位小数`);
          }
        }
      }
    },
    /**
     * 审批操作
     * @param {*} oper
     */
    audit(oper) {
      //TODO:完善审批操作
      if (this.entity.sysAudit == null) return;
      var self = this;
      self.entity.processStatus = oper;
      if (oper == 1) {
        //审核通过
        self
          .$confirm("确认审核通过?",
            "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            self.submitAudit();
          })
          .catch(() => {});
      } else {
        //审核不通过
        this.$prompt("确认审核不通过？请填写备注", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: self.entity.sysAuditRemark
          })
          .then(({
            value
          }) => {
            self.entity.sysAuditRemark = value;
            if (this.$commonUtil.valid.isEmpty(self.entity.sysAuditRemark)) {
              this.$commonUtil.valid.throwEx("请输入驳回备注");
              return;
            }
            self.submitAudit();
          })
          .catch(() => {});
      }
    },
    /**
     * 提交审核
     */
    submitAudit() {
      let self = this;
      self.$httpUtil.post({
        url: "/auditSguBaseInfo/auditSgu.json",
        data: self.entity,
        succ: function (data) {
          self.success("审核成功", self.baseData.goBack);
        }
      });
    }
  }
};