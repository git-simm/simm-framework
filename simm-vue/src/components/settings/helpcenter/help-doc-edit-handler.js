export default {

    methods: {
        /**
         * 初始化数据结构
         */
        initData() {
            var self = this;
            if (this.$route.path.includes("/add")) {
                this.data.treeId = this.$route.params.treeId;
            } else if (this.$route.path.includes("/edit")) {
                //获取基础信息
                this.getDoc(this.$route.params.id, entity => {
                    self.data = entity;
                });
            }
        },
        /**
         * 获取文档
         * @param {*} docId 
         * @param {*} callback 
         */
        getDoc(docId, callback) {
            this.$httpUtil.post({
                url: "/helpdoc/view.json",
                data: { id: docId },
                contentType: "form",
                succ: function(data) {
                    var entity = data.data || {};
                    if (callback) {
                        callback(entity);
                    }
                }
            });
        }
    }
};