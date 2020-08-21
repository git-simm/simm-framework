<template>
    <section class="content-section es_index">
            <el-container>
                <el-main>
                    <el-tabs v-model="activeName" type="border-card" ref="tabs">
                        <el-tab-pane label="SKU索引维护" name="index_modify">
                            <index-editor ref="index_editor" indexName="indexName"></index-editor>
                        </el-tab-pane>
                        <el-tab-pane label="SKU索引数据管理">
                            <es-sku-list ref="es-sku-list"></es-sku-list>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
    </section>
</template>

<script>
    import indexEditor from "./editControl/indexEditor";
    import esSkuList from "./editControl/esSkuList";
    export default {
        name: "esSkuIndex",
        components:{indexEditor,esSkuList},
        data(){
            return{
                esMappingsJson:"",
                indexDicData:[],
                activeName:"index_modify"
            }
        },
        created(){
            this.queryTreeNode();
        },
        mounted(){
            // 默认选中tree第一节点

        },

        methods:{
            queryTreeNode(){
                var self = this;
                this.$httpUtil.post({
                    url: "/dictionary/queryByClassCode.json?classCode=es_index",
                    data: {},
                    succ: function(data) {
                        var indexDicList =  (data.data || []).sort((a,b)=>{
                            return a.order - b.order;
                        })
                        self.wrapIndexTreeNode(indexDicList);
                    }
                });
            },

            wrapIndexTreeNode(data){
                var self = this;
                self.indexDicData = (data || []).map(el =>{
                    var node = {
                        label: el.itemName,
                        value: el.itemCode,
                        level:1
                    };
                    return node;
                });
            }
        }
    }
</script>

<style lang="less">
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .es_index {
        .sidebar {
            border: 1px solid #dcdfe6;
            -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
            0 0 6px 0 rgba(0, 0, 0, 0.04);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        }

        .el-main {
            padding: 0 0 0 10px !important;
        }

        .el-tree-node > .el-tree-node__children {
            overflow: inherit !important;
        }
    }
</style>