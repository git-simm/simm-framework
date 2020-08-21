import Sortable from "../draggable/src/util/Sortable";
import $ from "jquery";
export default {
    name: "sgu-sort-handler",
    methods: {
        description() {
            return "<h4>排序操作说明:</h4>" +
                "<h5>1.【快捷排序】将会对所有营销类目页签下的SGU按采购类目进行升/降序排序;</h5>" +
                "<h5>2.【自定义排序】将开启/隐藏行号录入栏,行号录入完成输入框失去焦点后当前行会移动到目标行;</h5>" +
                "<h5>3.【预览展示SGU】根据下拉选项控制[排序预览]页签展示对应状态(待上架/上架中/全部)的SGU</h5>" +
                "<h5>4.【保存排序设置】将保存排序调整完成后的排序结果;</h5>" +
                "<h5>5.加价换购的SGU不参与排序;</h5>" +
                "<h5>6.排序预览页签不支持排序操作,仅提供排序操作结果的预览;</h5>"
        },
        // 切换预览SGU状态
        switchPreviewSguStatus(val) {
            var self = this;
            self.previewSguStatus = val;
        },
        // 切换快捷排序
        switchSortType() {
            var self = this;
            if (self.diySgu == 1) {
                self.diySgu = 0
            } else {
                self.diySgu = 1
            }
        },
        // 自定义行排序
        diySguSort(row) {
            if (!row.sortNumber) {
                return;
            }
            let isInt = this.$commonUtil.formValid.isInt;
            isInt(row.sortNumber, "目标行号必须为数值");
            var self = this;
            let currentTab = self.getActiviSguList(Number(String(self.activeTab).replace("_", "")));
            // 移除 当前行数据
            currentTab.sguList.splice(
                currentTab.sguList.findIndex(ele => ele.id == row.id),
                1
            );
            // 计算目标行号
            let newIndex = row.sortNumber - 1;
            // 插入 行
            currentTab.sguList.splice(newIndex, 0, row);
            // 清理自定义排序值
            currentTab.sguList.forEach(el => {
                self.$set(el, "sortNumber", "");
            });
            self.calcSortNo(currentTab.sguList);
            self.$message({
                message: row.sguNumber + "已移动至目标行!",
                type: "success"
            });
        },
        /**
         * 拼接预览集合
         */
        calculatePreviewList(currentTab) {
            var self = this;
            self.previewList = [];
            self.categoryTabs.forEach(ele => {
                if (ele.id !== self.specialTabEnum.previewSortedSgu) {
                    self.previewList = [...self.previewList, ...ele.sguList];
                }
            });
            if (self.previewSguStatus > 0) { // 根据指定预览SGU状态 过滤预览数据
                self.previewList = self.previewList.filter(el => el.onSale === self.previewSguStatus);
            }
            // 排序
            this.calcSortNo(self.previewList);
            // 赋值 触发绑定
            currentTab.sguList = self.previewList;
        },
        // 按 类目快捷排序 orderType 1-升序 0-降序
        sortBySecondCategory(orderType) {
            var self = this;
            self.categoryTabs.forEach(el => {
                // 剔除预览
                if (el.id !== self.specialTabEnum.previewSortedSgu) {
                    el.sguList.sort((a, b) => {
                        if (orderType && orderType == "1") {
                            return a.twoCategoryId - b.twoCategoryId;
                        } else {
                            return b.twoCategoryId - a.twoCategoryId;
                        }
                    });
                    el.sguList.sort((a, b) => {
                        if (orderType && orderType == "1") {
                            return a.categoryId - b.categoryId;
                        } else {
                            return b.categoryId - a.categoryId;
                        }
                    });
                    self.calcSortNo(el.sguList);
                }
            });
            // 排序完成提示
            self.$message({
                message: "快捷排序已完成!",
                type: "success"
            });
        },
        // 以营销类目id 作为 tab name & tab激活标记
        categoryIdToTabName(val) {
            return "_" + val;
        },
        // 计算当前激活tab 下的 SGU列表数据
        getActiviSguList(val) {
            var self = this;
            let categoryId = Number(String(val).replace("_", ""));
            return self.categoryTabs.find(el => el.id === categoryId);
        },
        stop(event) {
            event.cancelBubble = true;
        },
        // 当前tab sguList初始化排序
        initSortable(activeTab, categoryTab) {
            var self = this;
            //初始化拖拽控件
            let sortingList = [];
            if (categoryTab) {
                sortingList = categoryTab.sguList;
            } else {
                sortingList = self.list;
            }
            var className = "." + activeTab + " tbody";
            var $ul = this.$el.querySelector(className);
            new Sortable($ul, {
                draggable: ">tr",
                filter: ".undraggable",
                //不阻止默认事件
                preventOnFilter: false,
                onUpdate: function (event) {
                    var newIndex = event.newIndex,
                        oldIndex = event.oldIndex,
                        $li = $ul.children[newIndex],
                        $oldLi = $ul.children[oldIndex];
                    // 先删除移动的节点
                    $ul.removeChild($li);
                    // 再插入移动的节点到原有节点，还原了移动的操作
                    if (newIndex > oldIndex) {
                        $ul.insertBefore($li, $oldLi);
                    } else {
                        $ul.insertBefore($li, $oldLi.nextSibling);
                    }
                    //计算table的序号
                    for (var i = 0; i < $ul.children.length; i++) {
                        $ul.children[i].children[0].innerHTML = i + 1;
                    }
                    var item = sortingList.splice(oldIndex, 1);
                    sortingList.splice(newIndex, 0, item[0]);
                    self.calcSortNo(sortingList);
                },
                animation: 150
            });
        },
        /**
         * 置顶
         * 当前激活的tab操作
         */
        setTop(row, sguList) {
            //元素移除，在添加到开头
            sguList.splice(
                sguList.findIndex(a => a.id == row.id),
                1
            );
            sguList.unshift(row);
            this.calcSortNo(sguList);
        },
        /**
         * 置底
         * 当前激活的tab操作
         */
        setBottom(row, sguList) {
            sguList.splice(
                sguList.findIndex(a => a.id == row.id),
                1
            );
            sguList.push(row);
            this.calcSortNo(sguList);
        },
        /**
         * 重新计算排序码
         */
        calcSortNo(sguList) {
            var baseVal = this.getInitSortVal();
            sguList.forEach((a, index) => {
                a.sort = baseVal + index + 1;
            });
        },
        /**
         * 保存排序信息
         */
        saveSortInfo() {
            var self = this;
            if ((this.list || []).length == 0) {
                self.$message({
                    message: "列表为空,保存无效",
                    type: "info"
                });
                return;
            }
            let sortList = [];
            // 解析 汇总 类目下SGU
            self.categoryTabs.forEach((el, index) => {
                // 剔除预览数据
                if (el.id !== self.specialTabEnum.previewSortedSgu) {
                    el.sguList.forEach((a, index) => {
                        sortList.push({
                            id: a.id,
                            // 1-包邮 2-自提
                            deliveryType: a.deliveryType,
                            // 0-团购 1-直购
                            distributionType: a.distributionType,
                            sort: a.sort
                        });
                    });
                }
            });
            // 整体计算排序码
            this.calcSortNo(sortList);
            this.$commonUtil.message.confirm("确定保存排序码设置?", () => {
                self.$httpUtil.post({
                    url: "/sguBaseInfo/saveSortSetting.json",
                    data: {
                        list: JSON.stringify(sortList)
                    },
                    contentType: "form",
                    succ: function (data) {
                        self.$message({
                            message: "设置成功",
                            type: "success"
                        });
                    }
                });
            });
        },
        /**
         * 获取 当前营销类目下SGU列表
         */
        getCategorySguList(marketCategory) {
            var self = this;
            // 营销类目下存在 对应采购二级类目
            if (marketCategory && (marketCategory.secondCategoryEntities || []).length > 0) {
                // 根据采购二级类目 筛选类目下的SGU列表
                let categories = new Set();
                (marketCategory.secondCategoryEntities || []).forEach(el => {
                    categories.add(el.purSecondCategoryId);
                });
                return (self.list || []).filter(el => categories.has(el.twoCategoryId));
            }
            //无对应SGU数据则返回空集合
            return [];
        },
        // 组装 tabs信息 拼接全部类目  其他类目
        calculateCategoryTabs() {
            var self = this;
            // 已解析到类目的SGU
            let calculatedSguList = [];
            // 营销类目 仅存在 ‘全部’分类
            if (self.categoryTabs.length === 1 && self.categoryTabs[0].id === self.specialTabEnum.allCategorySgu) {
                self.$set(self.categoryTabs[0], "sguList", self.list);
                calculatedSguList = self.list;
            } else {
                (self.categoryTabs || []).forEach(el => {
                    self.$set(el, "sguList", []);
                    el.sguList = self.getCategorySguList(el);
                    // 如果类目下无SGU 则 移除 tab
                    if ((el.sguList || []).length > 0) {
                        calculatedSguList = [...calculatedSguList, ...el.sguList];
                    }
                });
            }
            // 未解析的类目列表
            let otherSguList = [];
            // 其他类目
            if (calculatedSguList.length < (self.list || []).length) {
                let calculatedSguSet = new Set();
                calculatedSguList.forEach(el => {
                    calculatedSguSet.add(el.id);
                });
                otherSguList = (self.list || []).filter(el => !calculatedSguSet.has(el.id));
                // 拼接 其他类目tab
                self.$set(self.otherCategorySgu, "sguList", otherSguList)
                self.categoryTabs.push(self.otherCategorySgu);
            }
            self.categoryTabs = self.categoryTabs.filter(el => (el.sguList || []).length > 0);
            // 城市 拼接 预览tab 大于1个类目则 展示 排序预览
            // 省级、代理城市均展示预览页签
            // if (self.categoryTabs.length > 1) {
            self.$set(self.previewSortedSgu, "sguList", self.list)
            self.categoryTabs.push(self.previewSortedSgu);
            // }
            // 从解析后的营销类目页签获取 默认激活页签
            self.activeTab = "_" + (self.categoryTabs || [])[0].id;
        },
        getAndCalculateSguList() {
            var self = this;
            self.getListData(1, 10000, data => {
                self.calculateCategoryTabs();
            }, null)
        },
        /**
         * 获取分页数据
         */
        getListData: function (page, size, callback, count) {
            var self = this;
            this.$httpUtil.post({
                url: "/sguBaseInfo/getSortList.json",
                data: {
                    //上架中，待上架的数据
                    onSaleList: [1, 2]
                },
                succ: function (data) {
                    self.list = (data.data.sguBaseInfoList || []).sort((a, b) => {
                        if (a.sort === b.sort) {
                            return a.id - b.id;
                        } else {
                            return a.sort - b.sort;
                        }
                    });
                    self.categoryTabs = data.data.categoryInfoList || [];
                    if (self.categoryTabs.length === 0) {
                        self.categoryTabs.push(self.allCategorySgu);
                    }
                    self.data = data;
                    self.activeTab = self.categoryIdToTabName((data.data.categoryInfoList || [])[0].id);
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },
        /**
         * 确定 待激活的tab
         */
        searchFun(callBack) {
            if (this.request.sguNumber == "" && this.request.sguName == "") return;
            let item, index = -1,
                activityTab = {};
            for (var i = 0; i < (this.categoryTabs || []).length; i++) {
                activityTab = this.categoryTabs[i];
                if (this.request.sguNumber > "") {
                    item = activityTab.sguList.find(sgu => sgu.sguNumber == this.request.sguNumber);
                } else {
                    item = activityTab.sguList.find(sgu => sgu.sguName.includes(this.request.sguName));
                }
                if (item) {
                    index = activityTab.sguList.findIndex(sgu => sgu.id == item.id);
                    // 定位到SGU则中止
                    break;
                }
            }
            if (index < 0) {
                return;
            }
            // 赋值  监听激活 tab
            if (this.activeTab !== this.categoryIdToTabName(activityTab.id)) {
                this.activeTab = this.categoryIdToTabName(activityTab.id);
            }
            if (callBack) {
                callBack(item, index);
            }
        },
        /**
         * 定位到的行设置为当前行
         */
        locationRow() {
            this.searchFun((item, index) => {
                setTimeout(() => {
                    var self = this;
                    let refId = self.activeTab;
                    // 获取行高
                    let height = parseInt($(self.$refs[refId][0].$el).find(".el-table__body tbody td:first-child").height()) || 77;
                    height += 1;
                    self.$refs[refId][0].bodyWrapper.scrollTop = height * (index - 1);
                    self.$refs[refId][0].setCurrentRow(item);
                    self.$message({
                        message: "SGU定位完成",
                        type: "success"
                    });
                }, 200);
            });

        }
    }
}