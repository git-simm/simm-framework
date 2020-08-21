export default {
    methods: {
        // del: function (id) {
        //     var self = this;
        //     self
        //         .$confirm("此操作将永久删除, 是否继续?", "提示", {
        //             confirmButtonText: "确定",
        //             cancelButtonText: "取消",
        //             type: "warning"
        //         })
        //         .then(() => {
        //             self.$httpUtil.post({
        //                 url: "/prodInfo/del.json",
        //                 data: {
        //                     id: id
        //                 },
        //                 contentType: "form", //json,form,multipart
        //                 succ: function (data) {
        //                     self.$message({
        //                         message: "删除成功",
        //                         type: "success"
        //                     });
        //                     if (self.request.page === 1) {
        //                         self.getListData();
        //                     } else {
        //                         self.request.page = 1;
        //                     }
        //                 }
        //             });
        //         })
        //         .catch(() => { });
        // },
        editFun: function (item, index) {
            this.$set(
                this.data.data,
                index,
                Object.assign(item, {
                    change_inventory: item.inventory,
                    editFlg: true
                })
            );
        },
        cancelFun: function (item, index) {
            this.$set(
                this.data.data,
                index,
                Object.assign(item, {
                    editFlg: false
                })
            );
        },
        /**
         * 是否启用/禁用余额支付
         * @param {*} item 
         */
        setPayByBalance: function (item) {
            var self = this;
            self
                .$confirm(
                    "确定将该商品修改为" + (item.is_pay_by_balance == 1 ? "不可" : "可") + "余额支付？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                .then(() => {
                    var self = this;
                    var isPayByBalance = item.is_pay_by_balance == 1 ? 0 : 1;
                    this.$httpUtil.post({
                        url: "/prodInfo/setPayByBalance.json",
                        data: {
                            id: item.id,
                            isPayByBalance: isPayByBalance
                        },
                        contentType: "form", //json,form,multipart
                        succ: function (data) {
                            item.is_pay_by_balance = isPayByBalance;
                            self.$message({
                                message: "修改成功！",
                                type: "success"
                            });
                        }
                    });
                })
                .catch(() => { });
        },
        /**
         * 是否上架
         * @param {*} item 
         */
        setOnSale: function (item) {
            var self = this;
            self
                .$confirm(
                    "确定将该商品修改为" + (item.is_onsale == 1 ? "不可订货" : "可订货"),
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                .then(() => {
                    var self = this;
                    this.$httpUtil.post({
                        url: "/prodInfo/setOnSale.json",
                        data: {
                            id: item.id,
                            isOnSale: item.is_onsale == 1 ? 0 : 1
                        },
                        contentType: "form", //json,form,multipart
                        succ: function (data) {
                            self.$message({
                                message: "修改成功！",
                                type: "success"
                            });
                            self.getListData();
                        }
                    });
                })
                .catch(() => { });
        },
        cancelAudit(prodId) {
            if (prodId == null) {
                alert("商品信息不存在");
            } else {
                this.$confirm("确认取消审核", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        var self = this;
                        var store = this.$store;
                        var url = "/supplyProd/approveCancel.json?id=" + prodId;
                        this.$httpUtil.post({
                            url: url,
                            succ: function (data) {
                                self.$message({
                                    message: "操作成功!",
                                    type: "success"
                                });
                                self.getListData();
                            }
                        });
                    })
                    .catch(() => { });
            }
        },
        deleteProd(id) {
            var self = this;
            this.$commonUtil.message.confirm("确定删除商品?", () => {
                self.$httpUtil.post({
                    url: "/prodInfo/deleteProd.json",
                    data: {
                        id: id
                    },
                    contentType: "form",
                    succ: function (data) {
                        self.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        self.getListData();
                    }
                });
            });
        },
        // 上架操作
        onSaleOperation(row) {
            var self = this;
            //校验最低服务费
            this.$httpUtil.post({
                url: "/prodInfo/checkJump.json",
                data: {
                    prodId: row.id,
                    supplyId: row.purchase_supply_id
                },
                contentType: "form", //json,form,multipart
                succ: function (data) {
                    self.analysisSguDeliveryType(row, deliveryType => {
                        if (deliveryType == 4) {
                            //禁止上架 弹框提示
                            self.$message.warning(
                                "该商品不允许上架:供应商团购配送方式与城市团购配送方式不匹配!"
                            );
                        } else if (deliveryType === 1 || deliveryType === 2) {
                            self.show("onsale", {
                                prodId: row.id,
                                number: `${row.id}-${row.prod_number}`,
                                deliveryType: deliveryType
                            });
                        } else if (deliveryType === 3) {
                            // 弹框选择配送模式
                            self.$commonUtil.win.selectDeliveryType(
                                self,
                                row.id,
                                row.prod_number,
                                deliveryType
                            );
                        }
                    });
                }
            });
        },
        // 解析上架配送方式
        analysisSguDeliveryType(row, callBack) {
            if (row.is_direct_purchasing == 1) {
                // 直购直接跳转
                var deliveryType = 1; // 直购 deliveryType 默认给1
                this.show("onsale", {
                    prodId: row.id,
                    number: `${row.id}-${row.prod_number}`,
                    deliveryType: deliveryType
                });
                return;
            }
            this.$httpUtil.post({
                url: "/sguBaseInfo/analysisSguDeliveryType.json",
                data: {
                    supplyNumber: row.supply_number,
                    skuNumber: row.prod_number,
                    prodId: row.id
                },
                contentType: "json", //json,form,multipart
                succ: function (data) {
                    var deliveryType = data.data;
                    if (callBack) {
                        callBack(deliveryType);
                    }
                }
            });
        },
        /**
         * 头部渲染
         */
        renderPriceHeader(h, { column, $index }, index) {
            return h(
                "span",
                {
                    attrs: {
                        title: `红色的售后时效：商品中心更改后的售后时效，可在详情页查看详情；\r\n黑色的售后时效：创建的归属人设定`
                    }
                },
                [
                    h("span", column.label),
                    h("i", {
                        attrs: {
                            class: "element-icons el-icon-information",
                            style: "margin-left:3px;"
                        }
                    })
                ]
            );
        },
        /**
         * 调价审核
         */
        renderHeader1(h, { column, $index }, index) {
            return h(
                "span",
                {
                    attrs: {
                        title: `分账商品调价供应商审核状态`
                    }
                },
                column.label
            );
        },
    }
}