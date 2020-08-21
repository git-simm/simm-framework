/**
 * 公共的方法提供
 */
export default {
    data() {
        return {
            drawer: false,
            firstLevel: [],
            secondLevel: [],
            threeLevel: [],
            categoryOptions: [],
            salesModelData: [],
            firstHelpDoc: [],
            helpDocTreeOptions: []
        };
    },
    methods: {
        showDrawer() {
            this.drawer = true;
        },
        hideDrawer() {
            this.drawer = false;
        },
        goBack() {
            this.$back();
        },
        /**
         * 获取单位
         */
        getSalesModelData() {
            var self = this;
            this.$httpUtil.post({
                url: "/base/prod/unit/list.json",
                contentType: "form",
                loading: false,
                data: {
                    parent_id: 0,
                    level: 123,
                    page: 1,
                    pagesize: 100000
                },
                succ: function (data) {
                    self.salesModelData = data.data;
                }
            });
        },
        /**
         * 获取帮助中心树形数据
         */
        getHelpDocTreeList(callback, afterCallback) {
            var self = this;
            this.$httpUtil.post({
                url: "/helpdoctree/list.json",
                contentType: "form",
                loading: false,
                data: {},
                succ: function (data) {
                    self.wrapHelpDocTree(data.data, callback, afterCallback);
                }
            });
        },
        wrapHelpDocTree(data, callback, afterCallback) {
            data = data || [];
            if (callback) {
                data = callback(data);
            }
            this.firstHelpDoc = data.filter(a => a.parentId == 0);
            var self = this;
            if ((self.helpDocTreeOptions || []).length > 0) {
                self.helpDocTreeOptions = [];
            }
            self.firstHelpDoc.forEach(item => {
                self.cycPackage(item, data);
                self.helpDocTreeOptions.push(item);
            });
        },
        cycPackage(item, data) {
            var childrenNode = data.filter(a => a.parentId == item.id);
            if ((childrenNode || []).length > 0) {
                item.value = item.id;
                item.label = item.name;
                item.children = childrenNode;
                childrenNode.forEach(b => {
                    this.cycPackage(b, data)
                });
            } else {
                item.value = item.id;
                item.label = item.name;
                return item
            }
        },
        /**
         * 获取类目
         */
        getCategoryList(callback, afterCallback) {
            var self = this;
            this.$httpUtil.post({
                url: "/base/prod/category/list.json",
                contentType: "form",
                loading: false,
                data: {
                    page: 1,
                    pagesize: 100000
                },
                succ: function (data) {
                    self.wrapCategoryTree(data.data, callback, afterCallback);
                }
            });
        },
        wrapCategoryTree(data, callback, afterCallback) {
            data = data || [];
            if (callback) {
                data = callback(data);
            }
            this.firstLevel = data.filter(c => c.categoryLevel == 1);
            this.secondLevel = data.filter(c => c.categoryLevel == 2);
            this.threeLevel = data.filter(c => c.categoryLevel == 3);
            var self = this;
            var second = this.secondLevel.map(a => {
                a.parent = self.firstLevel.find(one => one.id == a.parentId);
                var node = {
                    label: a.categoryName,
                    value: a.id,
                    parentId: a.parentId,
                    category: a,
                    children: this.threeLevel
                        .filter(t => t.parentId == a.id)
                        .map(t => {
                            t.parent = a;
                            return {
                                label: t.categoryName,
                                value: t.id,
                                parentId: t.parentId,
                                category: t
                            };
                        })
                };
                if (node.children.length === 0) {
                    delete node.children;
                }
                return node;
            });
            this.categoryOptions = this.firstLevel.map(a => {
                var node = {
                    label: a.categoryName,
                    value: a.id,
                    parentId: a.parentId,
                    category: a,
                    children: second.filter(t => t.parentId == a.id)
                };
                if (node.children.length === 0) {
                    delete node.children;
                }
                return node;
            });
            if (afterCallback) {
                afterCallback(this.categoryOptions);
            }
        },
        /**
         * 获取所有城市数据
         */
        getAllCityList(callback) {
            this.$httpUtil.post({
                url: "/supplyUserLevel/getCityList.json",
                contentType: "form",
                data: {},
                succ: function (data) {
                    data.data = data.data.filter(a => a.is_agent == 0 && a.status == 1)
                    //关联省级
                    if (callback) {
                        callback(data.data);
                    }
                }
            });
        },
        /**
         * 获取省级数据
         * @param {*} citys
         */
        getProviceList(citys, callback) {
            var siteList = [];
            this.$httpUtil.post({
                url: "/groupprod/list.json",
                succ: function (data) {
                    //对省级数据进行过滤
                    var list = Array.from(new Set(citys.map(a => a.supply_site_id)));
                    siteList = data.data.filter(a => list.includes(a.id));
                    siteList.forEach(site => {
                        site.cityList = citys.filter(
                            city => city.supply_site_id == site.id
                        );
                    });
                    if (callback) {
                        callback(siteList);
                    }
                }
            });
        },
        /**
         * 获取城市树
         */
        getCityTree(callback) {
            var self = this;
            this.getAllCityList(citys => {
                self.getProviceList(citys, siteList => {
                    if (callback && (siteList || []).length > 0) {
                        var treeCities = (citys || []).map(c => {
                            return {
                                treeId: `c_${c.admin_shop_id}`,
                                value: c.admin_shop_id,
                                label: c.level_name,
                                isAgent: c.is_agent,
                                parentId: c.supply_site_id,
                                type: 2
                            };
                        });
                        var treeProvinces = (siteList || []).map(p => {
                            return {
                                treeId: `p_${p.id}`,
                                value: p.id,
                                label: p.site_name,
                                type: 1,
                                parentId: -999,
                                children: treeCities.filter(c => c.parentId == p.id)
                            };
                        });
                        var tree = [{
                            treeId: `g_99999`,
                            label: "全国",
                            type: 0,
                            children: treeProvinces
                        }];
                        callback(tree, siteList, citys);
                    }
                });
            });
        },
        /**
         * 获取地址
         * @param {*} callback
         */
        getAddressAuthData(callback) {
            var self = this;
            this.$httpUtil.post({
                url: "/summary/getAddressData.json",
                succ: function (data) {
                    if (callback) {
                        callback(data.data);
                    }
                }
            });
        }
    }
};