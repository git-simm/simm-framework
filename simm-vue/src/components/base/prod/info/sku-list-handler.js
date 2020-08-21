import exportUtil from "@/common/utils/ExportUtil";
export default {
    name: "skuListHandler",
    methods: {
        handUse(obj) {
            if (this.searchParam.fromAddProdPage) {
                this.$emit("use", obj);
            } else {
                this.$router.push({
                    name: "ProdAddArea",
                    params: obj
                });
            }
        },
        /**
         * 更新可购买状态
         */
        updateBuyStatus(id, status) {
            var self = this;
            this.$commonUtil.message.confirm(
                `确定${status === 1 ? "启用" : "禁止"}该SKU的商品订货?`,
                () => {
                    self.$httpUtil.post({
                        url: "/base/prod/info/updateBuyStatus.json",
                        data: {
                            id: id,
                            status: status
                        },
                        contentType: "form",
                        succ: function (data) {
                            self.$message({
                                message: "更新成功",
                                type: "success"
                            });
                            self.getListData();
                        }
                    });
                }
            );
        },
        /**
         * 更新可销售状态
         */
        updateSaleStatus(id, status) {
            var self = this;
            this.$commonUtil.message.confirm(
                `确定${status === 1 ? "启用" : "禁止"}该SKU的商品销售?`,
                () => {
                    self.$httpUtil.post({
                        url: "/base/prod/info/updateSaleStatus.json",
                        data: {
                            id: id,
                            status: status
                        },
                        contentType: "form",
                        succ: function (data) {
                            self.$message({
                                message: "更新成功",
                                type: "success"
                            });
                            self.getListData();
                        }
                    });
                }
            );
        },
        /**
         * 提交数据
         */
        postData(data) {
            let self = this;
            var jsonList = this.wrapData(data);
            self.$httpUtil.post({
                url: "/base/prod/info/batchUpdateCanSale.json",
                data: {
                    skuList: jsonList
                },
                contentType: "json",
                succ: function (data) {
                    self.getListData();
                    if (0 == data.data.length) {
                        self.$commonUtil.win.response(self, {
                            type: "txt",
                            data: "成功更改<b>" + jsonList.length + "</b>条SKU的采销状态"
                        });
                    } else {
                        self.$commonUtil.win.response(self, {
                            type: "list",
                            data: data.data,
                            excelConfig: self.$metadata.skuExport,
                            successSum: jsonList.length - data.data.length,
                            failSum: data.data.length
                        });
                    }
                }
            });
        },
        /**
         * 行数据校验
         */
        rowValid(row, index) {
            var errors = [];
            (this.requiredFields || []).forEach(f => {
                if (row[f] == null || row[f] == "") {
                    errors.push(`[${f}]`);
                }
            });
            if (errors.length > 0) {
                return `${errors.join("、")} 为空`;
            }
            return null;
        },
        /**
         * 组装数据
         */
        wrapData(data) {
            let self = this;
            let jsonArray = [];
            var validList = [];
            var fields = {
                prodNumber: { title: "SKU编码" },
                productName: { title: "商品名称" },
                canBuy: { title: "可订货", cast: val => ("是" == val ? 1 : 0) },
                canSale: { title: "可销售", cast: val => ("是" == val ? 1 : 0) }
            };
            for (let i = 0; i < data.length; i++) {
                let item = {};
                for (var f in fields) {
                    var fieldInfo = fields[f];
                    var title = fieldInfo.title;
                    item[f] = data[i][title];
                    //转换一下
                    if (fieldInfo.cast) {
                        item[f] = fieldInfo.cast(item[f]);
                    }
                }
                jsonArray.push(item);
            }
            return jsonArray;
        },
        /**
         * 逻辑删除
         */
        logicDelete(id) {
            var self = this;
            this.$commonUtil.message.confirm("确定删除SKU?", () => {
                self.$httpUtil.post({
                    url: "/base/prod/info/logicDelete.json",
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
        excelExport() {
            var self = this;
            var postData = self.adviceRequest || self.request;
            postData.fromAddProdPage = this.request.fromAddProdPage;
            postData.doExport = 1;
            self.$httpUtil.post({
                url: "/base/prod/info/list.json",
                data: postData,
                contentType: "form",
                succ: function (data) {
                    let config = self.$metadata.skuAllColExport;
                    exportUtil.exportByConfig(self, data.data, config);
                }
            });
        },
        auditSku(item) {
            var self = this;
            self
                .$confirm("确认审核?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    self.$httpUtil.post({
                        url: "/base/prod/info/auditBaseProdInfo.json",
                        contentType: "form",
                        data: {
                            id: item.id,
                            status: 1
                        },
                        succ: function (data) {
                            self.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            self.getListData();
                        }
                    });
                })
                .catch(() => { });
        },
        rejectSku(item) {
            var self = this;
            self
                .$confirm("确认打回到申请人?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    self.$httpUtil.post({
                        url: "/base/prod/info/rejectBaseProdInfo.json",
                        contentType: "form",
                        data: {
                            id: item.id,
                            status: -1
                        },
                        succ: function (data) {
                            self.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            self.getListData();
                        }
                    });
                })
                .catch(() => { });
        },
        commitSku(item) {
            var self = this;
            self
                .$confirm("确认提交当前流程?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    self.$httpUtil.post({
                        url: "/base/prod/info/commitBaseProdInfo.json",
                        contentType: "form",
                        data: {
                            id: item.id,
                            status: -2,
                            remark: ""
                        },
                        succ: function (data) {
                            self.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            self.getListData();
                        }
                    });
                })
                .catch(() => { });
        },
        allAudit: function () {
            var arr = this.selectedRows;
            var ids = [];
            arr.forEach((data, index) => {
                ids.push(data.id);
            });
            if (ids.length <= 0) {
                alert("未选取行信息");
                return;
            }
            var self = this;
            var store = this.$store;
            var url = "/base/prod/info/batchApproveSuccess.json";
            this.$httpUtil.post({
                url: url,
                data: {
                    ids: JSON.stringify(ids)
                },
                contentType: "form",
                succ: function (data) {
                    if (data.resultCode == 1000) {
                        self.$message({
                            message: "操作成功!",
                            type: "success"
                        });
                        setTimeout(function () {
                            self.$router.go(0);
                        }, 1500);
                    }
                    self.getListData();
                }
            });
        },
    },
}