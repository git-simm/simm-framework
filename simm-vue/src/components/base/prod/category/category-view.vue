<template>
    <section class="content-section">
        <el-row class="cmd_detail">
            <el-col :span="12">
                <h4 class="text-theme">类目详情</h4>
            </el-col>
            <el-col :span="24" style="padding:20px;">
                <table class="table table-hover table-bordered table-largePadding">
                    <tbody>
                    <tr>
                        <td>类目ID</td>
                        <td>{{category.id}}</td>
                        <td>类目名称</td>
                        <td>{{category.categoryName}}</td>
                        <td>类目等级</td>
                        <td>{{category.categoryLevel==1?"一级类目":
                            category.categoryLevel==2?"二级类目":
                            category.categoryLevel==3?"三级类目":""}}</td>
                    </tr>
                    <tr>
                        <td>售后时效</td>
                        <td>{{category.afterTime}}</td>
                        <td>毛利率</td>
                        <td>{{category.grossProfitRate}}</td>
                    </tr>
                    </tbody>
                </table>
            </el-col>
        </el-row>
        <el-col :span="12">
            <h4 class="text-theme">操作列表</h4>
        </el-col>
        <sxh-table :dataSource="data" ref="multipleTable" :config="config">
            <el-table-column prop="createBy" label="操作人">
                <template slot-scope="scope">
                    <span>创建人：{{scope.row.createBy}}</span>
                    <br />
                    <span>{{scope.row.createAt}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sysModuleId" label="模块">
                <template slot-scope="scope">
                    <span>ID：{{scope.row.sysModuleId}}</span>
                    <br />
                    <span>{{scope.row.sysModuleName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cmdType" label="指令类型"></el-table-column>
            <el-table-column prop="cmdRemark" label="指令描述"></el-table-column>
            <el-table-column prop="cmdResult" label="执行结果"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <sxh-detail-view comp="editGrossData" :view-param="{ id: scope.row.id}"></sxh-detail-view>
                    <el-button
                            plain
                            size="minier"
                            @click="()=>refresh()"
                    >刷新</el-button>
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
    export default {
        name: "categoryView",
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
                category: {},
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
            this.getDetail();
            this.getListData();
        },
        methods: {
            getDetail() {
                var self = this;
                this.$httpUtil.post({
                    url: "/base/prod/category/getOne.json",
                    data: {id: this.id},
                    succ: function (data) {
                        self.category = data.data;
                    }
                });
            },
            /**
             * 获取分页数据
             */
            getPagerListData: function (page, size) {
                var self = this;
                var jsondata = self.request;
                jsondata.refId=self.id;
                this.config.page = page;
                this.config.pagesize = size;
                jsondata.pageNo = page;
                jsondata.pageSize = size;
                this.$httpUtil.post({
                    url: "/sysCmd/list.json",
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
            getListData: function () {
                this.getPagerListData(this.config.page, this.config.pagesize);
            },
            /**
             * 刷新
             */
            refresh() {
                var self = this;
                self.getListData();
            }
        }
    };
</script>
