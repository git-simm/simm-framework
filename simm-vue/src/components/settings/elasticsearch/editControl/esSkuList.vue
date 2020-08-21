<template>
    <section class="content-section es-sku-list">
        <div class="search-form el-drawer-body">
            <el-form
                    :model="request"
                    ref="request"
                    label-width="120px"
                    class="demo-ruleForm"
            >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="SKU编码">
                            <el-input
                                    placeholder="请输入SKU编码"
                                    v-model.trim="request.prodNumber"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="SKU名称">
                            <el-input
                                    placeholder="请输入SKU名称"
                                    v-model.trim="request.productName"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="SPU编码">
                            <el-input
                                    placeholder="请输入SPU编码"
                                    v-model.trim="request.spuNumber"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="SPU名称">
                            <el-input
                                    placeholder="请输入SPU名称"
                                    v-model.trim="request.spuName"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="数据状态">
                            <sxh-checkbox-group dic="es_sku_status" v-model="request.statusList"></sxh-checkbox-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <div class="pull-right" style="padding-bottom:10px;">
                            <el-button
                                    type="primary"
                                    class="btn-default"
                                    icon="el-icon-search"
                                    @click="getListData()"
                            >搜 索</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="search-table">
            <div class="search-table">
                <el-row>
                    <el-col :span="8">
                        <span>
                            <el-button
                                    type="primary"
                                    class="btn-default"
                                    icon="el-icon-s-check"
                                    @click="updateSkuEsData()"
                            >条件更新ES数据</el-button>
                        </span>
                    </el-col>
                </el-row>
                <sxh-table
                        ref="skuEsList"
                        :config="config"
                        :dataSource="infoData"
                >
                    <el-table-column prop="id" label="主键ID"></el-table-column>
                    <el-table-column prop="prodNumber" label="SKU编码"></el-table-column>
                    <el-table-column prop="productName" label="SKU名称"></el-table-column>
                    <el-table-column prop="spuNumber" label="SPU编码" ></el-table-column>
                    <el-table-column prop="spuName" label="SPU名称" ></el-table-column>
                    <el-table-column prop="categoryName" label="一级类目"></el-table-column>
                    <el-table-column prop="twoCategoryName" label="二级类目"></el-table-column>
                    <el-table-column prop="threeCategoryName" label="三级类目"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span>{{ $cacheUtil.getVal("es_sku_status", scope.row.status)}}</span>
                        </template>
                    </el-table-column>

                </sxh-table>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "esSkuList",
        props: {

        },
        data: function() {
            return {
                infoData: {},
                config: {
                    getListData: this.getPagerListData,
                    page: 1,
                    pagesize: 10
                },
                request: {
                    prodNumber: "",
                    productName:"",
                    spuNumber: "",
                    spuName:"",
                    // statusList: [],
                },
            };
        },
        created() {
            this.getListData();
        },
        activated() {
            this.getListData();
        },
        methods: {
            // 根据查询条件更新ES数据
            updateSkuEsData(){
                var self = this;
                self
                    .$confirm(
                        "该操作将批量更新满足搜索条件的ES数据,搜索条件为空则同步更新全部数据,谨慎操作全部更新!",
                        "提示",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }
                    )
                    .then(() => {
                        var requestData = Object.assign({}, self.request);
                        var url = "/skuES/updateSkuEsData.json";
                        this.$httpUtil.post({
                            url: url,
                            data: requestData,
                            contentType: "json", //json,form,multipart
                            isShowLoading: true, //显示遮罩
                            succ: function () {
                                self.$message({
                                    message: "操作成功！",
                                    type: "success"
                                });
                            }
                        });
                    }).catch(() => {
                });
            },
            /**
             * 获取SKU列表
             */
            getListData: function() {
                this.getPagerListData(
                    this.config.page,
                    this.config.pagesize
                );
            },
            /*
             * 获取分页数据
             * */
            getPagerListData: function (page, size) {
                var self = this;
                var jsondata = Object.assign({}, self.request);
                jsondata = {...jsondata, ...(this.filter || [])};
                var url = "/skuES/searchByPage.json";
                jsondata.page = page;
                jsondata.size = size;
                this.$httpUtil.post({
                    url: url,
                    data: jsondata,
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
    };
</script>