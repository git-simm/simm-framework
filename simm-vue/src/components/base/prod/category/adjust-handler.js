import reNameComp from "./adjust-controls/rename.vue";
import changeParentComp from "./adjust-controls/change-parent.vue";
export default {
    methods: {
        /**
         * 当前节点变更
         * @param {*} data 
         * @param {*} node 
         */
        currentChange(data, node) {
            var category = data.category;
            var level = category.categoryLevel;
            var id = category.id;
            var name=category.categoryName;
            if (level === 1) {
                this.$set(this, "currCategory", {
                    categoryId: id,
                    category_id: id,
                    oneCategoryId: id,
                    one_category_id: id
                });
            } else if (level === 2) {
                this.$set(this, "currCategory", {
                    twoCategoryId: id,
                    two_category_id: id
                });
            } else if (level === 3) {
                this.$set(this, "currCategory", {
                    threeCategoryId: id,
                    threeCategoryName:name,
                    three_category_id: id,
                    three_category_name:name
                });
            }
            this.currCategoryId = id;
        },
        /**
         * 类目迁移
         * @param {*} node 
         * @param {*} data 
         */
        move(node, data) {
            this.$layerUtil.openWin(this, {
                title: `【${data.category.categoryName}】类目迁移`,
                area: ["700px", "400px"],
                data: {
                    category: data.category,
                    invoke: this.invoke,
                },
                component: changeParentComp,
            });
        },
        /**
         * 重命名
         * @param {*} node 
         * @param {*} data 
         */
        rename(node, data) {
            this.$layerUtil.openWin(this, {
                title: `【${data.category.categoryName}】类目重命名`,
                area: ["500px", "300px"],
                data: {
                    category: data.category,
                    invoke: this.invoke,
                },
                component: reNameComp,
            });
        },
        /**
         * 执行方法
         * @param {*} param 
         * @param {*} succ 
         * @param {*} fail 
         */
        invoke(param, succ, fail) {
            var self = this;
            param.sysModuleId = 18; //category_adjust
            this.$httpUtil.post({
                url: "/sysCmd/invoke.json",
                data: param,
                succ: function (data) {
                    self.$message({
                        message: '执行成功！',
                        type: 'success'
                    });
                    //刷新指令管理列表
                    self.endFunc();
                    if (succ) {
                        succ();
                    }
                },
                fail: function (result) {
                    self.endFunc();
                    self.$commonUtil.message.alert(`指令执行失败，原因：${result.error}，请到指令管理列表中执行重试命令`);
                    if (fail) {
                        fail();
                    }
                }
            });
        },
        endFunc() {
            this.activeName = "sysCmd";
            //刷新指令管理列表
            this.getCategoryList();
            if (this.$refs.cmdList) {
                this.$refs.cmdList.getListData();
            }
        }
    },
};