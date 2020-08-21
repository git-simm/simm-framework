<template>
    <section class="content-section">
        <el-row class="cmd_detail">
            <el-col :span="24">
                <div class="pull-right">
                    <el-button type="primary" icon="el-icon-download" @click="excelExport()">导出变更的业务数据</el-button>
                </div>
            </el-col>
        </el-row>
        <p></p>
        <sxh-table :dataSource="data" ref="multipleTable" :config="config">
            <el-table-column prop="sysModuleId" label="业务模块">
                <template slot-scope="scope">
                    <span>ID：{{scope.row.sysModuleId}}</span>
                    <el-tag size="mini" effect="plain">{{scope.row.sysModuleName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="refId" label="业务ID"></el-table-column>
            <el-table-column prop="refNumber" label="业务数据编码"></el-table-column>
            <el-table-column prop="oldGrossProfitRate" label="旧毛利率">
                <template slot-scope="scope">
                    {{scope.row.oldGrossProfitRate}}%
                </template>
            </el-table-column>
            <el-table-column prop="grossProfitRate" label="新毛利率">
                <template slot-scope="scope">
                    {{scope.row.grossProfitRate}}%
                </template>
            </el-table-column>
        </sxh-table>
    </section>
</template>
<style lang="less">
    .cmd_detail {
        .table.table-largePadding > tbody > tr > td:nth-child(2n + 1) {
            width: 100px !important;
        }
    }
</style>
<script>
    import exportUtil from "../../../../common/utils/ExportUtil";
    export default {
        name: "editGrossData",
        props: {
            //查看参数
            viewParam: {
                type: Object,
                required: false,
                default: null
            }
        },
        data() {
            return {
                id: this.viewParam ? this.viewParam.id : Number(this.$route.params.id),
                request: {
                    sysModuleId: 25 //类目编辑毛利率
                },
                config: {
                    getListData: this.getPagerListData,
                    page: 1,
                    pagesize: 10
                },
                data: {}
            };
        },
        created() {
            this.getListData();
        },
        methods: {
            /**
             * 获取分页数据
             */
            getPagerListData: function(page, size) {
                var self = this;
                var jsondata = self.request;
                jsondata.id = this.id;
                this.config.page = page;
                this.config.pagesize = size;
                jsondata.pageNo = page;
                jsondata.pageSize = size;
                this.$httpUtil.post({
                    url: "/sysCmdBizLog/list.json",
                    data: jsondata,
                    contentType: "form",
                    succ: function(data) {
                        var page = data.data || {};
                        self.data = {
                            data: page.records,
                            records: page.total
                        };
                    }
                });
            },
            getListData: function() {
                this.getPagerListData(this.config.page, this.config.pagesize);
            },
            /**
             * excel导出
             */
            excelExport() {
                var self = this;
                var jsondata = self.request;
                jsondata.id = this.id;
                this.$httpUtil.post({
                    url: "/sysCmdBizLog/export.json",
                    data: jsondata,
                    contentType: "form", //json,form,multipart
                    succ: function(data) {
                        var config = self.$metadata.categoryExport;
                        exportUtil.exportByConfig(self, data.data, config);
                    }
                });
            }
        }
    };
</script>
