import moment from "moment";

export default {
    name: "sgu-list-saletime-handler",
    methods: {
        /**
         * 操作单个SGU上下架
         * @param row
         */
        onSaleOpera(row) {
            // 校验供应商交行账户状态
            var self = this;
            if (row.onSale == 1) { // 下架操作不校验供应商交行账户状态
                if (row.isCycleOnSale === 0) {
                    self.dialogBy24(row);
                } else {
                    self.cycleDialog(row);
                }
                return;
            }
            this.$httpUtil.post({
                url: "/supplyInfo/getCommActiveStatus.json",
                data: { supplyId: row.supplyId },
                contentType: "form", //json,form,multipart
                succ: function (data) {
                    if (row.isCycleOnSale === 0) {
                        self.dialogBy24(row);
                    } else {
                        self.cycleDialog(row);
                    }
                }
            });
        },
        changeAll: function (sguList) {
            var self = this;
            this.$httpUtil.post({
                url: "/sguBaseInfo/onSaleAll.json",
                data: { list: JSON.stringify(sguList) },
                contentType: "form", //json,form,multipart
                succ: function (data) {
                    if (data) {
                        if (0 == data.data.length) {
                            self.$commonUtil.win.response(self, {
                                type: "sgu",
                                data: "成功更改<b>" + sguList.length + "</b>条sgu"
                            });
                        } else {
                            self.$commonUtil.win.response(self, {
                                type: "list",
                                data: data.data,
                                excelConfig: self.$metadata.sguChangeAll,
                                successSum: sguList.length - data.data.length,
                                failSum: data.data.length
                            });
                        }
                        self.getListData();
                    }
                }
            });
        },
        filterSomeSgu(isCycleOnSale, callback) {
            var self = this;
            var arr = self.selectedRows;
            if (arr.length <= 0) {
                this.$commonUtil.valid.throwEx(`请选择sgu信息`);
            }
            var nonMatches = arr.filter(a => a.isCycleOnSale !== isCycleOnSale);
            if ((nonMatches || []).length > 0) {
                this.$confirm("<p style='color:darkgoldenrod;max-height:300px;overflow:auto;'>" + nonMatches.map(b => b.sguNumber).join("<br/>") + "</p>" + "<br>上架模式不符合，无法批量修改，系统将自动过滤", "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        dangerouslyUseHTMLString: true,
                        type: "warning"
                    }
                ).then(() => {
                    self.selectedRows = arr.filter(a => a.isCycleOnSale === isCycleOnSale);
                    self.$refs.multipleTable.toggleRowSelection(nonMatches);
                    if (callback) {
                        callback(self.selectedRows);
                    }
                }).catch(() => {
                });
            } else if (callback) {
                callback(self.selectedRows);
            }
        },
        /**
         * 时间修改
         * @param {*} isOnSale 
         * @param {*} isCycleOnSale 
         */
        onSale(isOnSale, isCycleOnSale) {
            var self = this;
            self.filterSomeSgu(isCycleOnSale, arr => {
                if (arr.length <= 0) {
                    self.$commonUtil.valid.throwEx(`请选择sgu信息`);
                }
                if (arr.some(a => a.onSale === 1)) {
                    var sguNumbers = arr.filter(a => a.onSale === 1).map(b => b.sguNumber).join("<br/>");
                    self.$confirm("<p style='color:darkgoldenrod;max-height:300px;overflow:auto;'>" + sguNumbers + "</p>" + "<br/>为上架中的数据，无法批量修改，系统将自动过滤", "提示",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            dangerouslyUseHTMLString: true,
                            type: "warning"
                        }
                    ).then(() => {
                        self.selectedRows = arr.filter(a => a.onSale !== 1);
                        self.$refs.multipleTable.toggleRowSelection(arr.filter(a => a.onSale === 1));
                        if (self.selectedRows.length === 0) {
                            self.$commonUtil.valid.throwEx(`选择sgu的信息不符合条件，请重新选择`);
                        }
                        self.onSaleAll(isOnSale, isCycleOnSale, self.selectedRows);
                    }).catch(() => {
                    });
                } else {
                    self.onSaleAll(isOnSale, isCycleOnSale, arr);
                }
            });
        },
        onSaleAll(isOnSale, isCycleOnSale, list) {
            var self = this;
            self.$commonUtil.win.changeOnSaleTime(
                self,
                {
                    isOnSale: isOnSale,
                    sguBaseProd: list,
                    isCycleOnSale: isCycleOnSale,
                    beforeCallback: self.beforeCallback
                },
                data => {
                    var sguList = data.sguBaseProd;
                    self.changeAll(sguList);
                }
            )
        },
        takenOff(isOnSale, isCycleOnSale) {
            var self = this;
            self.filterSomeSgu(isCycleOnSale, arr => {
                if (arr.length <= 0) {
                    self.$commonUtil.valid.throwEx(`请选择sgu信息`);
                }
                if (arr.some(a => a.onSale === 0)) {
                    var sguNumbers = arr.filter(a => a.onSale === 0).map(b => b.sguNumber).join("<br/>");
                    self.$confirm("<p style='color:darkgoldenrod;max-height:300px;overflow:auto;'>" + sguNumbers + "</p>" + "<br/>为下架的数据，无法批量修改，系统将自动过滤",
                        "提示",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            dangerouslyUseHTMLString: true,
                            type: "warning"
                        }
                    ).then(() => {
                        self.selectedRows = arr.filter(a => a.onSale !== 0);
                        self.$refs.multipleTable.toggleRowSelection(arr.filter(a => a.onSale === 0));
                        if (self.selectedRows.length === 0) {
                            self.$commonUtil.valid.throwEx(`选择的sgu信息不符合条件，请重新选择`);
                            self.getListData();
                        }
                        self.takenOffAll(isOnSale, isCycleOnSale, self.selectedRows);
                    }).catch(() => {
                    });
                } else {
                    self.takenOffAll(isOnSale, isCycleOnSale, arr);
                }
            });
        },
        takenOffAll(isOnSale, isCycleOnSale, list) {
            var self = this;
            this.$commonUtil.win.changeOnSaleTime(
                self,
                {
                    isOnSale: isOnSale,
                    sguBaseProd: list,
                    isCycleOnSale: isCycleOnSale,
                    beforeCallback: self.beforeCallback
                },
                data => {
                    var sguList = data.sguBaseProd;
                    //24和循环上架区分
                    if (data.isCycleOnSale === 0) {
                        self.changeAll(sguList);
                    } else {
                        if (data.onSaleType === 3) {
                            self.takenoffNow(sguList);
                        } else {
                            self.changeAll(sguList);
                        }
                    }
                }
            )
        },
        takenoffNow(list) {
            var self = this;
            self.$confirm('分时段售卖，使用【立即下架】后,上架模式将改为：24小时售卖,请确认是否操作', "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).then(() => {
                self.$httpUtil.post({
                    url: "/sguBaseInfo/onSaleAll.json",
                    data: { list: JSON.stringify(list) },
                    contentType: "form", //json,form,multipart
                    succ: function (data) {
                        if (data) {
                            self.$message({
                                message: "设置成功",
                                type: "success"
                            });
                            self.selectedRows = [];
                            self.getListData();
                        }
                    }
                });
            }).catch(() => {
            });
        },
        beforeCallback(item) {
            var self = this;
            //24小时
            if (item.isCycleOnSale === 0) {
                if (item.onSale != 1 || item.isOnSale === 1) {
                    if (self.$commonUtil.valid.isEmpty(item.onSaleTime)) {
                        self.$commonUtil.valid.throwEx("上架时间不能为空");
                    }
                    item.onSaleTime = moment(item.onSaleTime).format("YYYY-MM-DD HH:mm:ss");
                }
                if (self.$commonUtil.valid.isEmpty(item.takenOffTime)) {
                    self.$commonUtil.valid.throwEx("下架时间不能为空");
                }
                item.takenOffTime = moment(item.takenOffTime).format("YYYY-MM-DD HH:mm:ss");
                if (
                    (item.onSale != 1 || item.isOnSale === 1) &&
                    item.onSaleTime > item.takenOffTime
                ) {
                    self.$commonUtil.valid.throwEx("上架时间不能大于下架时间");
                }
                if (
                    (item.onSale == 1 || item.onSale == 2) &&
                    item.onSaleTime > item.takenOffTime
                ) {
                    self.$commonUtil.valid.throwEx("下架时间调整有误，不可小于上架时间");
                }
            }
            //循环
            else {
                if (item.onSaleType !== 3 && self.$commonUtil.valid.isEmpty(item.onSaleTime)) {
                    self.$commonUtil.valid.throwEx("请修改信息后再提交!");
                }
                if (item.onSale != 1 || item.isOnSale === 1) {
                    if (self.$commonUtil.valid.isEmpty(item.cycleStartDate)) {
                        self.$commonUtil.valid.throwEx("开始日期不能为空");
                    }
                }
                if (self.$commonUtil.valid.isEmpty(item.cycleEndDate)) {
                    self.$commonUtil.valid.throwEx("结束日期不能为空");
                }
                if (self.$commonUtil.valid.isEmpty(item.cycleStartTime)) {
                    self.$commonUtil.valid.throwEx("上架时间不能为空");
                }
                if (self.$commonUtil.valid.isEmpty(item.cycleEndTime)) {
                    self.$commonUtil.valid.throwEx("下架时间不能为空");
                }
                if (
                    (item.onSale != 1 || item.isOnSale === 1) &&
                    item.cycleStartDate > item.cycleEndDate
                ) {
                    self.$commonUtil.valid.throwEx("开始日期不能大于结束日期");
                }
            }
        },
        /**
         * 营销活动请求确认  取SGU明细信息 暂不废弃该方法
         * 2020--4-28 不再校验SGU是否参与营销活动
         * @param {*} param
         * @param {*} callback 
         */
        activityConfirm({ id, onSaleType }, callback) {
            var self = this;
            //查询营销活动状态
            self.$httpUtil.post({
                url: "/sguBaseInfo/getActivityStatus.json",
                data: { id: id },
                contentType: "json", //json,form,multipart
                succ: function (data) {
                    var message = "";
                    if (onSaleType === 3) {
                        message = "确定下架？";
                    } else if (onSaleType === 2) {
                        message = "确定上架？";
                    } else if (onSaleType === 1) {
                        message = "是否确认修改时间？";
                    }
                    self
                        .$confirm(message,
                            "提示",
                            {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }
                        )
                        .then(() => {
                            if (callback) {
                                callback(data);
                            }
                        })
                        .catch(() => { });
                }
            });
        },
        dialogBy24(item) {
            var self = this;
            this.$commonUtil.win.changeOnSaleTime(
                self,
                {
                    id: item.id,
                    onSale: item.onSale,
                    onSaleTime: item.onSaleTime,
                    takenOffTime: item.takenOffTime,
                    isCycleOnSale: item.isCycleOnSale,
                    beforeCallback: self.beforeCallback
                },
                dateDialog => {
                    self.activityConfirm(dateDialog, data => {
                        dateDialog.isNextDay = data.data.isNextDay;
                        dateDialog.oldTakenOffTime = data.data.takenOffTime;
                        self.$httpUtil.post({
                            url: "/sguBaseInfo/onSale.json",
                            data: dateDialog,
                            contentType: "json", //json,form,multipart
                            succ: function (data) {
                                if (data) {
                                    if (
                                        dateDialog.isNextDay === 0 &&
                                        moment(dateDialog.oldTakenOffTime).format("YYYY-MM-DD") !==
                                        moment(dateDialog.takenOffTime).format("YYYY-MM-DD") &&
                                        dateDialog.onSaleType !== 3
                                    ) {
                                        self.$message({
                                            message: "商品预计到货时间已更新，并同步到所有城市",
                                            type: "success"
                                        });
                                    } else {
                                        self.$message({
                                            message: "设置成功",
                                            type: "success"
                                        });
                                    }
                                    self.getListData();
                                }
                            }
                        });
                    });
                }
            );
        },
        cycleDialog(item) {
            var self = this;
            this.$commonUtil.win.changeOnSaleTime(
                self,
                {
                    id: item.id,
                    onSale: item.onSale,
                    cycleStartDate: item.cycleStartDate,
                    cycleStartTime: item.cycleStartTime,
                    cycleEndDate: item.cycleEndDate,
                    cycleEndTime: item.cycleEndTime,
                    isCycleOnSale: item.isCycleOnSale,
                    beforeCallback: this.beforeCallback
                },
                cycleDialog => {
                    self.activityConfirm(cycleDialog, data => {
                        var arr = [cycleDialog];
                        if (cycleDialog.onSaleType === 3) {
                            self.takenoffNow(arr);
                        } else {
                            self.$httpUtil.post({
                                url: "/sguBaseInfo/onSaleAll.json",
                                data: { list: JSON.stringify(arr) },
                                contentType: "form", //json,form,multipart
                                succ: function (data) {
                                    if (data) {
                                        if (0 == data.data.length) {
                                            if (
                                                item.isNextDay === 0 &&
                                                item.cycleEndDate !== cycleDialog.cycleEndDate &&
                                                cycleDialog.onSaleType !== 3
                                            ) {
                                                self.$message({
                                                    message: "商品预计到货时间已更新，并同步到所有城市",
                                                    type: "success"
                                                });
                                            } else {
                                                self.$message({
                                                    message: "设置成功",
                                                    type: "success"
                                                });
                                            }
                                        } else {
                                            self.$alert(data.data[0].remark, "提示", {
                                                type: "error"
                                            });
                                        }
                                        self.getListData();
                                    }

                                }
                            });
                        }
                    });
                }
            );
        },
    }
};
