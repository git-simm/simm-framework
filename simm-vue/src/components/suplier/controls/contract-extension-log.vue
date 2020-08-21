<template>
    <section>
        <div class="search-table">
            <sxh-table
                    ref="contractLogList"
                    :config="config"
                    :dataSource="infoData"
            >
                <el-table-column prop="supplyId" label="供应商ID"></el-table-column>
                <el-table-column label="合同开始日期">
                    <template slot-scope="scope">{{formatDate(scope.row.contractValidityBegin)}}</template>
                </el-table-column>
                <el-table-column label="合同结束日期">
                    <template slot-scope="scope">{{formatDate(scope.row.contractValidityEnd)}}</template>
                </el-table-column>
                <el-table-column prop="settleDay" label="账期/天"></el-table-column>
                <el-table-column prop="depositPrice" label="保证金/元"></el-table-column>
                <el-table-column prop="description" label="特殊说明"></el-table-column>
                <el-table-column prop="creatorName" label="提交人"></el-table-column>
                <el-table-column prop="createTime" label="提交时间"></el-table-column>
                <el-table-column label="是否生效">
                    <template slot-scope="scope">
                        {{$cacheUtil.getVal("valid", scope.row.valid)}}
                    </template>
                </el-table-column>
                <el-table-column label="是否作废">
                    <template slot-scope="scope">
                        {{$cacheUtil.getVal("delete_flag", scope.row.deleteFlag)}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作" min-width="120">
                    <template slot-scope="scope">
                        <span >
                            <el-button plain size="minier" @click="viewDetail(scope.row)">查看明细</el-button>
                        </span>
                    </template>
                </el-table-column>
            </sxh-table>
        </div>
    </section>
</template>

<script>
    import moment from "moment";
    export default {
        name: "contract-extension-log",
        props:{
            supplyInfo:Object
        },
        data(){
            return{
                infoData: {},
                config: {
                    getListData: this.getPagerListData,
                    page: 1,
                    pagesize: 10
                },
                request:{
                    supplyId:null
                },
                contractOpeModel:{
                    VIEW:"view",
                    EDIT:"edit"
                }
            }
        },
        created() {
        },
        mounted(){
            this.getListData();
        },
        methods:{
            /**
             * 日期格式化
             */
            formatDate(date){
                if(date){
                    return moment(date).format("YYYY-MM-DD");
                }
                return null;
            },
            /**
             * 明细查看
             */
            viewDetail(row){
                var self = this;
                this.$commonUtil.win.contractDetail(
                    self, // 当前VUE对象
                    {id:row.supplyId},
                    "log_view" // 合同续签明细
                );
            },
            getListData: function() {
                this.getPagerListData(
                    this.config.page,
                    this.config.pagesize
                );
            },
            getPagerListData: function (page, size) {
                var self = this;
                var jsonData = Object.assign({}, self.supplyInfo);
                jsonData.page = page;
                jsonData.size = size;
                this.$httpUtil.post({
                    url: "/supplyContract/list.json",
                    data: jsonData,
                    contentType: "form", //json,form,multipart
                    isShowLoading: false, //不显示遮罩
                    succ: function (data) {
                        var page = data.data || {};
                        self.infoData = {
                            data: page.records,
                            records: page.total
                        };
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>