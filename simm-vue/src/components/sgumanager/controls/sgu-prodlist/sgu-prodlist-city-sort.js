import Sortable from "../../../draggable/src/util/Sortable";
export default {
    methods: {
        // 当前tab sguList初始化排序
        initSortable() {
            var self = this;
            var className = ".sgu_prodlist_sort tbody";
            var $ul = this.$el.querySelector(className);
            new Sortable($ul, {
                draggable: ">tr",
                handle: ".draggable",//拖动手柄
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
                    var item = self.formData.sguProdInfoList.splice(oldIndex, 1);
                    self.formData.sguProdInfoList.splice(newIndex, 0, item[0]);
                    //重算sort值
                    (self.formData.sguProdInfoList || []).forEach((prod, index) => {
                        prod.sort = index;
                    });
                },
                animation: 150
            });
        },
    },
}