import moment from "moment";

export default {
    data: function () {
        var checkAfterTime = (rule, value, callback) => {
            var regExp = /^[+]{0,1}(\d+)$/;
            if (regExp.test(value) === false) {
                callback(new Error("请输入商品售后时效(正整数)"));
            } else {
                callback();
            }
        };
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
            if (this.$route.params.auditFlag != 3 && (!Number(value) || value <= 0)) {
                // 供应商解绑操作不校验
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
            if (this.$route.params.auditFlag != 3 && value < 0) {
                // 供应商解绑不校验
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
            prodInfo: {},
            checkedstatus: [],
            produserlevelprice: "",
            unitBoxData: [],
            supplyData: [],
            prodTypeData: [],
            priceCanEdit: false,
            formDate: {
                supplyId: "",
                supplyName: "",
                agent_city: "",
                platformRatio: 0,
                isAgent: null,
                admin_user_id: "",
                create_role: "",
                isOnSale: "",
                sub_account_prod_price: "",
                sub_account_proportion: 0,
                is_direct_purchasing: "",
                is_sub_account: "",
                merchant_model: "", // 供应商类型
                qdl: "",
                afterTime: null,
                prod_name: "", // string
                prod_price: 0, // number
                platform_service_fee: 0,
                payCommissionFee: 0,//支付手续费 （销售价*0.6%）
                prod_number: "",
                specification: "",
                unit_name: "",
                unit_box_name: "",
                unit_box_number: null,
                purchase_supply_id: "",
                prod_category_id: "",
                purchase_supply_prod_number: "",
                recommend_content: "",
                bar_code: "", // stringrj
                purchase_price: "",
                rrp: "",
                prodType: "",
                isPayByBalance: "", //是否支持余额支付
                // TODO
                // bindSupply:"",
                valid: "",
                // selectTags: [],
                thumbnailsuo_url: "", // 缩略图
                main_pic: [], // 主图
                detail_pic: [], // 详情图
                main_pic_list: [], // 主图
                detail_pic_list: [], // 详情图
                realPic: [],//实物图
                realPicList: [],//实物图
                main_video_list: [],// 视频
                sort: 0, // number
                is_pay_on_delivery: false, // 是否支持货到付款，0为不支持，1为支持,
                tax: "",
                category_name: "",
                two_category_name: "",
                tableData: [],
                formTableSort: {
                    prop: "sort",
                    order: "ascending"
                },
                multipleSelection: [],
                diffAfterTime: ""
            },
            rules: {
                afterTime: [
                    {
                        type: "number",
                        required: true,
                        message: "请输入商品售后时效(正整数)",
                        trigger: "blur"
                    },
                    {
                        validator: checkAfterTime,
                        trigger: "blur"
                    }
                ],
                prod_name: [
                    {
                        required: true,
                        message: "请输入商品名称",
                        trigger: "blur"
                    }
                ],
                unit_name: [
                    {
                        required: true,
                        message: "请输入商品单位",
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
                        message: "请输入正确的是商品编码",
                        trigger: "blur"
                    }
                ],
                bar_code: [
                    {
                        type: "string",
                        required: false,
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
                prod_category_id: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择商品类目",
                        trigger: "change"
                    }
                ],
                purchase_supply_id: [
                    {
                        type: "number",
                        required: true,
                        message: "请输入采购供应商",
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
                        message: "请选择是否支持余额支付",
                        trigger: "blur"
                    }
                ],
            }
        };
    },
    methods: {
        getSupplyData: function (merchantModel) {
            /*供应商列表*/
            var self = this;
            var setListFunc = list => {
                self.supplyData = list || [];
                self.SupplyDataChange();
                self.supplyData.forEach(ele => {
                    if (ele.id == self.formDate.purchase_supply_id) {
                        self.formDate.merchant_model = ele.merchant_model;
                        self.formDate.is_direct_purchasing = ele.is_direct_purchasing;
                        self.formDate.is_sub_account = ele.is_sub_account;
                        self.formDate.supplyName = ele.supply_name;
                    }
                });
            };
            if (self.formDate.prod_number.includes("ZZ")) {
                //组装码只加载加工供应商
                self.getJgSupply(supply => {
                    setListFunc([supply]);
                });
            } else {
                self.$httpUtil.post({
                    url: "/supplyInfo/addlistBySku.json",
                    contentType: "form", //json,form,multipart
                    data: self.formDate,
                    succ: function (data) {
                        setListFunc(data.data);
                    }
                });
            }
        },
        /**
         * 获取加工供应商
         */
        getJgSupply(callback) {
            var self = this;
            this.$httpUtil.post({
                url: "/prodInfo/getJgSupply.json",
                succ: function (data) {
                    var jgSupply = data.data;
                    jgSupply.is_agent = jgSupply.isAgent;
                    jgSupply.merchant_model = jgSupply.merchantModel;
                    jgSupply.is_sub_account = jgSupply.isSubAccount;
                    if (callback) {
                        callback(jgSupply);
                    }
                }
            });
        },
        getSkuInfo: function (skuNumber, callback) {
            var self = this;
            this.$httpUtil.post({
                url: "/base/prod/info/get.json",
                data: {
                    prod_number: skuNumber
                },
                contentType: "form", //json,form,multipart
                loading: false,
                succ: function (data) {
                    callback(data.data);
                }
            });
        },
        getProInfo: function () {
            var self = this;
            this.$httpUtil.post({
                url: "/prodInfo/view.json",
                data: {
                    id: self.$route.params.id
                },
                contentType: "form",
                succ: function (data) {
                    self.formDate.isPayByBalance = data.data.prodInfo.isPayByBalance;
                    var prodInfo = data.data.prodInfo;
                    //获取城市开关
                    if (prodInfo.creator_role === 2) {
                        self.getProdCityInfo(prodInfo.city_id);
                    }
                    self.prodInfo = prodInfo;
                    self.prodInfo.audits = data.data.audits;
                    self.formDate.is_sub_account = prodInfo.is_sub_account;
                    self.formDate.isAgent = prodInfo.isAgent;
                    self.formDate.platformRatio = prodInfo.platformRatio;
                    self.formDate.supplyId = prodInfo.supply_id;
                    if (
                        (data.data.produserlevelprice || []).length > 0 &&
                        (prodInfo.creator_role == 2 ||
                            prodInfo.creator_role == 3)
                    ) {
                        var cityLevel = data.data.produserlevelprice.find(
                            a => a.admin_shop_id == 1
                        );
                        if (!cityLevel) {
                            cityLevel = data.data.produserlevelprice[0];
                        }
                        //判断数据归属是否为城市维度(城市维度，主表数据展示最后有效的城市价格信息)
                        self.formDate.isOnSale = cityLevel.status == 1;
                        self.formDate.valid = cityLevel.valid == 1;
                        self.formDate.sub_account_proportion = cityLevel.sub_account_proportion;
                        self.formDate.sub_account_prod_price = cityLevel.sub_account_prod_price;
                        self.formDate.prod_price = cityLevel.prod_price;
                        self.formDate.platform_service_fee = cityLevel.platform_service_fee;
                    } else {
                        self.formDate.sub_account_proportion = prodInfo.sub_account_proportion;
                        self.formDate.sub_account_prod_price = prodInfo.sub_account_prod_price;
                        self.formDate.prod_price = prodInfo.prod_price;
                        self.formDate.platform_service_fee = prodInfo.platform_service_fee;
                    }
                    self.formDate.qdl = prodInfo.qdl;
                    self.formDate.afterTime = prodInfo.afterTime;
                    self.formDate.detail_pic = data.data.detail_pic;
                    self.formDate.main_pic = data.data.main_pic;
                    self.formDate.main_pic_list = data.data.main_pic_list;
                    self.formDate.detail_pic_list = data.data.detail_pic_list;
                    self.formDate.realPic = data.data.realPic;
                    self.formDate.realPicList = data.data.realPicList;
                    self.formDate.thumbnailsuo_url = data.data.thumbnailsuo_url;
                    // 视频地址
                    self.formDate.main_video_list = data.data.main_video_list;
                    self.formDate.bar_code = prodInfo.bar_code;
                    self.formDate.rrp = prodInfo.rrp || "";
                    self.formDate.prod_category_id = prodInfo.prod_category_id;
                    self.formDate.purchase_price =
                        prodInfo.purchase_price || "";
                    self.formDate.prod_name = prodInfo.prod_name;
                    self.formDate.prod_number = prodInfo.prod_number;
                    self.formDate.recommend_content = prodInfo.recommend_content;
                    self.formDate.sort = prodInfo.sort;
                    self.formDate.specification = prodInfo.specification;
                    self.formDate.unit_name = prodInfo.unit_name;
                    self.formDate.note = prodInfo.note;
                    self.formDate.tax = prodInfo.tax;
                    self.formDate.box_gauge = prodInfo.box_gauge;
                    self.$set(self.formDate, "category_name", data.data.category_name);
                    self.$set(self.formDate, "two_category_name", data.data.two_category_name);
                    self.$set(self.formDate, "three_category_name", data.data.three_category_name);
                    self.$set(self.formDate, "storage_method", data.data.storage_method);
                    self.$set(self.formDate, "quaranteePeriodCode", data.data.quaranteePeriodCode);
                    self.$set(self.formDate, "spuId", data.data.spuId);
                    self.$set(self.formDate, "spuNumber", data.data.spuNumber);
                    self.formDate.unit = prodInfo.unit;
                    self.formDate.merchant_model = prodInfo.merchant_model;
                    self.formDate.processStatus = prodInfo.processStatus;
                    self.formDate.isJgSupply = prodInfo.isJgSupply;
                    self.formDate.supplyNumber = prodInfo.supplyNumber;
                    self.formDate.supplyName = prodInfo.supplyName;
                    self.formDate.prodType = data.data.prod_type;
                    self.formDate.create_role = prodInfo.creator_role;
                    self.formDate.admin_user_id = prodInfo.admin_user_id;
                    //价格是否允许编辑
                    self.calcPriceCanEdit();
                    prodInfo.purchase_supply_id &&
                        (self.formDate.purchase_supply_id =
                            prodInfo.purchase_supply_id);
                    self.formDate.selectTags = data.data.prodLablelist;
                    self.formDate.is_pay_on_delivery = Boolean(
                        prodInfo.is_pay_on_delivery
                    );
                    self.produserlevelprice = data.data.produserlevelprice;
                    self.formDate.produserlevelprice = data.data.produserlevelprice;
                    self.formDate.unit_box_number = prodInfo.unit_box_number;
                    self.formDate.unit_box_name = prodInfo.unit_box_name;
                    self.getSupplyData();
                    self.$refs.mainImg.updatePicList(
                        self.formDate,
                        self.formDate.main_pic_list
                    );
                    self.$refs.detailImg.updatePicList(
                        self.formDate,
                        self.formDate.detail_pic_list
                    );
                    self.$refs.mainVideo.updateVideoList(
                        self.formDate,
                        self.formDate.main_video_list
                    );
                    if (self.$refs.realImg) {
                        //实物图
                        self.$refs.realImg.updateVideoList(
                            self.formDate,
                            self.formDate.realPicList
                        );
                    }
                    //控件刷新
                    self.$refs.prodPrice.initData(self.formDate, "edit");
                }
            });
        },
        getThreeCategoryAfterTime: function () {
            var self = this;
            this.$httpUtil.post({
                url: "/base/prod/category/threeCategory.json",
                data: {
                    id: self.$route.params.id
                },
                contentType: "form", //json,form,multipart
                succ: function (data) {
                    self.diffAfterTime = data.data.afterTime;
                }
            });
        },
        /**
         * 提交表单
         * @param {*} formName 
         * @param {*} typeValue 
         */
        submitForm(formName, typeValue) {
            this.$refs[formName].validate(valid => {
                var self = this;
                if (!valid) {
                    self.$commonUtil.valid.throwEx("填写信息不完整，请完善后再提交");
                    return;
                };
                var request = {};
                if ((self.formDate.main_pic_list || []).length == 0) {
                    self.$commonUtil.valid.throwEx("商品主图不能为空");
                }
                self.formDate.payCommissionFee = Math.round(self.formDate.sub_account_prod_price * 0.006 * 100) / 100;
                if (self.formDate.payCommissionFee >= parseFloat(self.formDate.prod_price).toFixed(2)) {
                    self.$commonUtil.valid.throwEx(
                        "平台服务费过高，供应商无法支付分账手续费，请重新设置"
                    );
                }
                request.afterTime = self.formDate.afterTime;
                if (request.afterTime > self.diffAfterTime) {
                    self.$commonUtil.valid.throwEx(
                        "售后时效修改时间不得大于商品中心设置的售后时效，如有异议请联系商品中心"
                    );
                }
                request.isPayByBalance = self.formDate.isPayByBalance;
                self.$refs.prodPrice.getCityPriceData(userLevelPrice => {
                    //为城市/直购状态赋值
                    if (
                        self.formDate.create_role == 2 ||
                        self.formDate.create_role == 3
                    ) {
                        request.isOnSale = Number(self.formDate.isOnSale);
                        // 城市角色 操作
                        (userLevelPrice || []).forEach(city => {
                            city.status = request.isOnSale;
                            city.valid = self.formDate.valid;
                            //供应商平台修改分账比列，同步
                            if (self.formDate.isAgent == 1) {
                                city.sub_account_proportion = self.formDate.platformRatio;
                            }
                        });
                    }
                    request.prod_user_level_price = JSON.stringify(userLevelPrice);
                    self.getProdData(request);
                    request.saveType = typeValue;
                    self.$httpUtil.post({
                        url: "/prodInfo/doupdateall.json",
                        data: request,
                        contentType: "form", //json,form,multipart
                        succ: function (data) {
                            let sum = data.data.length;
                            self.$message({
                                message: "商品信息修改成功!",
                                type: "success"
                            });

                            if (sum > 0) {
                                self.$commonUtil.win.preSubmit(self, {
                                    title: "同步提示",
                                    type: "list",
                                    data: data.data,
                                    excelConfig: self.$metadata.sguFailExport,
                                    sum: sum,
                                    id: request.id,
                                    preSubmit: self.preUpdate
                                });
                            }
                            setTimeout(function () {
                                self.$router.push({
                                    path: "/prod/prodmanage/list"
                                });
                            }, 1500);

                        }
                    });
                });
            });
        },
        /**
         * 获取商品数据
         * @param {*} request 
         */
        getProdData(request) {
            var self = this;
            request.unit_box_name = self.formDate.unit_box_name;
            request.unit_box_number = self.formDate.unit_box_number;
            if ((request.unit_box_name == null || request.unit_box_name == '') && (request.unit_box_number != null && request.unit_box_number != '')) {
                self.$commonUtil.valid.throwEx(
                    "箱规未填写完整"
                );
            }
            request.is_pay_on_delivery = Number(self.formDate.is_pay_on_delivery);
            request.label_ids = "";
            request.bar_code = self.formDate.bar_code;
            request.rrp = self.formDate.rrp;
            request.purchase_price = self.formDate.purchase_price;
            request.id = self.$route.params.id;
            //详情图信息获取
            let detailPic = [];
            for (var d of self.formDate.detail_pic_list) {
                if (d.url && d.url.includes("blob")) {
                    self.$commonUtil.valid.throwEx(
                        "商品详情图还未上传完毕，请稍等..."
                    );
                }
                detailPic.push(d.url);
            }
            if (detailPic.length > 10) {
                self.$commonUtil.valid.throwEx("商品详情图最多只能上传10张");
            }
            request.detail_pic = detailPic.toString();
            //实物图信息获取
            request.realPic = self.getImgs().toString();
            // 校验视频上传过程中的提交
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
                        self.$commonUtil.valid.throwEx("商品视频长度超过3分钟,请删除后重新上传!");
                    }
                }
                mainVideo.push(m.url);
            }
            request.main_video = mainVideo.toString();
            //主图信息搜集
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
            if (mainPic.length > 0) {
                request.thumbnailsuo_url = mainPic[0];
            }
            request.main_pic = mainPic.toString();
            //分账信息
            request.sub_account_prod_price = self.formDate.sub_account_prod_price;
            if (self.formDate.isAgent == 0) {
                request.sub_account_proportion =
                    self.formDate.sub_account_proportion;
            } else {
                request.sub_account_proportion = self.formDate.platformRatio;
            }
            request.prod_name = self.formDate.prod_name;
            request.recommend_content = self.formDate.recommend_content;
            request.prod_number = self.formDate.prod_number;
            request.prod_price = self.formDate.prod_price;
            request.platform_service_fee = self.formDate.platform_service_fee;
            request.sort = self.formDate.sort;
            request.specification = self.formDate.specification;
            request.unit_name = self.formDate.unit_name;
            request.qdl = self.formDate.qdl;
            request.note = self.formDate.note;
            request.box_gauge = self.formDate.box_gauge;
            request.sales_multiple = "";
            request.prod_category_id = self.formDate.prod_category_id || "";
            request.purchase_supply_id = self.formDate.purchase_supply_id;
        },
        getImgs() {
            var self = this;
            let realPic = [];
            for (var d of self.formDate.realPicList) {
                if (d.url && d.url.includes("blob")) {
                    self.$commonUtil.valid.throwEx("商品实物图还未上传完毕，请稍等...");
                }
                realPic.push(d.url);
            }
            //商品管理员进入修改界面，需要补充上传实物图（且开启实物图审核）
            if (self.canUpdateRealImg && self.isAudit) {
                if (realPic.length < 2) {
                    self.$commonUtil.valid.throwEx("商品实物图不能少于2张");
                }
            }
            return realPic;
        },
        preUpdate(id, sum) {
            let self = this;
            let request = {};
            request.id = id;
            self.$httpUtil.post({
                url: "/prodInfo/syncSguSalePrice.json",
                data: request,
                contentType: "form", //json,form,multipart
                succ: function (data) {
                    if (0 === data.data.length) {
                        self.$commonUtil.win.response(self, {
                            title: "同步结果",
                            type: "txt",
                            data: "成功同步" + sum + "条SGU"
                        });
                    } else {
                        self.$commonUtil.win.response(self, {
                            title: "同步结果",
                            type: "list",
                            data: data.data,
                            excelConfig: self.$metadata.sguFailExport,
                            successSum: sum - data.data.length,
                            failSum: data.data.length
                        });
                    }
                }
            });
        },
    }
};


