import moment from "moment";

export default {
    data() {
        return {
            templateList: [],
            onlyPartners: this.$cacheUtil.getDic("only_partner"),
            exchangeTypes: this.$cacheUtil.getDic("exchange_type"),
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
                sguName: "",
                prefixName: "",
                suffixName: "",
                shareDesc: "",
                supplyId: null,
                supplyName: "",
                prodId: null,
                saleType: "",
                onSaleTime: "",
                takenOffTime: "",
                restrictionStartTime: "",
                restrictionEndTime: "",
                restrictionNumber: "",
                restrictionTypeCode: "",
                postage: "",
                supplyNumber:"",
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
                supplyNumber: [{
                    required: true,
                    message: "供应商编码不能为空",
                    trigger: "change"
                }
                ],
                sort: [{
                    validator: this.numberValid,
                    required: true,
                    min: 0,
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
                }]
            }
        };
    },

    methods: {
        numberValid(rule, value, callback) {
            if (value === "" || value === null || value === undefined) {
                return callback(new Error(rule.message));
            } else {
                return callback();
            }
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
        //获取预计到货时间
        getArrivalDate() {
            var self = this;
            // 提交审核后 不触发 预计到货时间计算
            let time = new Date(self.formData.takenOffTime);
            let setArrivalDate = prod => {
                prod.arrivalDate = new Date();
                prod.arrivalDate = moment(
                    prod.arrivalDate.setTime(time.getTime() + 24 * 60 * 60 * 1000)
                ).format("YYYY-MM-DD HH:mm:ss");
            };
            (self.formData.sguPlanProdInfoList || []).forEach(prod => {
                setArrivalDate(prod);
            });
            //城市或直购
            ((self.formData.direct || {}).sguPlanProdInfoList || []).forEach(prod => {
                setArrivalDate(prod);
            });
        },

        /**
         * 提交请求
         * @param {*} formData
         */
        submit() {
            var self = this;
            let prodInfoValid = (index, val, msg) => {
                if (self.$commonUtil.valid.isEmpty(val)) {
                    self.$commonUtil.valid.throwEx('第' + index + `行商品的${msg}未填写`);
                }
            };

            var priceValid = (index,val,msg) => {
                if (val < 0) {
                    self.$commonUtil.valid.throwEx('第' + index + `行商品的${msg}必须大于或等于0`);
                } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(val)) {
                    self.$commonUtil.valid.throwEx('第' + index + `行商品的${msg}最多2位小数`);
                }
            };

            var checkInt = (index,val,msg) => {
                var regExp = /^[+]{0,1}(\d+)$/;
                if (regExp.test(val) === false||val===0) {
                    self.$commonUtil.valid.throwEx('第' + index + `行商品的${msg}必须为正整数`);
                }
            };

            var checkIntCanZero = (val,msg) => {
                var regExp = /^[+]{0,1}(\d+)$/;
                if (regExp.test(val) === false) {
                    self.$commonUtil.valid.throwEx(`${msg}必须为大于0的整数`);
                }
            };

            checkIntCanZero(self.formData.sort,"排序码");

            //子表校验
            self.formData.sguPlanProdInfoList.forEach((prod, index) => {
                prodInfoValid(index + 1, prod.skuNumber, "商品编码");
                prodInfoValid(index + 1, prod.salePrice, "销售价");
                prodInfoValid(index + 1, prod.marketPrice, "划线价");
                if(self.formData.supplyInfo!=null&&self.formData.supplyInfo.isSubAccount === 1){
                    prodInfoValid(index + 1, prod.platformServiceFee, "服务费");
                    priceValid(index + 1, prod.platformServiceFee, "服务费");
                }
                prodInfoValid(index + 1, prod.commissionAmount, "团长佣金");
                priceValid(index + 1, prod.salePrice, "销售价");
                priceValid(index + 1, prod.marketPrice, "划线价");
                priceValid(index + 1, prod.commissionAmount, "团长佣金");
                checkIntCanZero(prod.sellableStock, "第"+(index+1)+"行商品的可售数量");
                if (self.formData.deliveryType === 1) {
                    prodInfoValid(index + 1, prod.sendHours, "预计发货时间");
                } else {
                    prodInfoValid(index + 1, prod.arrivalDate, "预计到货时间");
                }
                prodInfoValid(index + 1, prod.isLimit, "是否限购");
                if(prod.isLimit===1){
                    prodInfoValid(index + 1, prod.limitAmount, "限购数量");
                    checkInt(index + 1, prod.limitAmount, "限购数量");
                }
                prodInfoValid(index + 1, prod.sellableStock, "可售数量");

                if (self.$commonUtil.valid.isEmpty(prod.boughtPeople)) {
                    prod.boughtPeople = 0;
                }
                if (self.$commonUtil.valid.isEmpty(prod.initSales)) {
                    prod.initSales = 0;
                }

            })
            //校验
            self.$refs["formData"].validate(valid => {
                if (valid) {
                    var url = "/sguPlanBaseInfo/submit.json";
                    self.$httpUtil.post({
                        url: url,
                        data: self.formData,
                        contentType: "json",
                        succ: function (data) {
                            self.success("修改成功", () => self.$back());
                        }
                    });
                } else {
                    self.$commonUtil.valid.throwEx(`信息填写不完整，请完善后再提交`);
                    return false;
                }
            });
        },

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

    }
};