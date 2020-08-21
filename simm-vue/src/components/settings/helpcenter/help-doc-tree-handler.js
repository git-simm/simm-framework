import helpTreeEdit from "./help-doc-tree-edit.vue";
export default {
    methods: {
        /**
         * 当前节点变更
         * @param {*} data 
         * @param {*} node 
         */
        currentChange(data, node) {
            this.treeIdList = this.circleData(data);
            this.$set(this, "currHelpDocTree", {
                treeIdList: this.treeIdList,
                helpDocTree: data
            });
            this.$emit("onChange", this.currHelpDocTree);
        },
        /**
         * 递归获取当前节点idS
         * @param {*} data 
         * @param {*} treeIdList 
         */
        circleData(data) {
            var treeIdList = [];
            treeIdList.push(data.id);
            if ((data.children || []).length > 0) {
                data.children.forEach(item => {
                    treeIdList = [...treeIdList, ...this.circleData(item)];
                });
            }
            return treeIdList;
        },
        /**
         * 新增一级
         * @param {*} data 
         * @param {*} node 
         */
        addParent(parentId) {
            this.$layerUtil.openWin(this, {
                title: "",
                area: ["600px", "350px"],
                data: {
                    helpDocTree: {
                        parentId: parentId,
                        name: "",
                        code: "",
                        sort: ""
                    },
                    invoke: this.invoke
                },
                component: helpTreeEdit
            })
        },
        /**
         * 新增下一级
         * @param {*} data 
         * @param {*} node 
         */
        addChild(node, data) {
            this.$layerUtil.openWin(this, {
                title: "",
                area: ["600px", "350px"],
                data: {
                    helpDocTree: {
                        parentId: data.id,
                        name: "",
                        code: "",
                        sort: ""
                    },
                    invoke: this.invoke
                },
                component: helpTreeEdit
            })
        },
        /**
         * 编辑
         * @param {*} data 
         * @param {*} node 
         */
        edit(node, data) {
            this.$layerUtil.openWin(this, {
                title: "",
                area: ["600px", "450px"],
                data: {
                    helpDocTree: {
                        id: data.id,
                        parentId: data.parentId,
                        name: data.name,
                        code: data.code,
                        sort: data.sort,
                        status: data.status
                    },
                    invoke: this.invoke
                },
                component: helpTreeEdit
            })
        },
        /**
         * 执行方法
         * @param {*} data 
         * @param {*} node 
         */
        invoke(data, succ) {
            var url = "";
            if (data.id) {
                url = "/helpdoctree/edit.json"
            } else {
                url = "/helpdoctree/add.json"
            }
            var self = this;
            this.$httpUtil.post({
                url: url,
                data: data,
                contentType: "json",
                succ: function(data) {
                    self.getHelpDocTreeList();
                    if (succ) {
                        succ();
                    }
                }
            });
        }
    }

}