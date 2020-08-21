<template>
    <section class="content-section spu-list">
        <div class="search-form">
            <el-row>
                <el-form
                        :model="request"
                        :rules="rules"
                        ref="request"
                        label-width="120px"
                        class="demo-ruleForm el-drawer__body"
                        @submit.native.prevent="searchFun"
                >
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="SKU编码">
                                <el-input
                                        placeholder="请输入SKU编码"
                                        type="textarea"
                                        :rows="4"
                                        v-model="request.skuNumber"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="SPU编码">
                                <el-input
                                        placeholder="请输入SPU编码"
                                        type="textarea"
                                        :rows="4"
                                        v-model="request.spuNumber"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="组合名称">
                                <el-input placeholder="请输入组合名称" v-model.trim="request.jointName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="创建人">
                                <el-input placeholder="请输入创建人" v-model.trim="request.creatorName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类目">
                                <sxh-category v-model="request.categoryList" @change="categoryChange"></sxh-category>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="审核状态">
                                <sxh-checkbox-group dic="prod_audit_status"
                                                    v-model="request.processStatusList"></sxh-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <div class="pull-right" style="padding-bottom:10px;">
                                <el-button
                                        type="primary"
                                        class="btn-default"
                                        icon="el-icon-search"
                                        @click="searchFun()"
                                >搜 索
                                </el-button>
                                <el-button
                                        v-permission:spu_manager_export
                                        type="primary"
                                        class="btn-default"
                                        icon="el-icon-download"
                                        @click="excelExport()"
                                >导 出
                                </el-button>
                                <el-button
                                        type="primary"
                                        class="btn-default"
                                        icon="el-icon-search"
                                        style="margin-left: 10px;"
                                        @click="$refs.adviceSearch.showDrawer()"
                                >高级搜索
                                </el-button>
                                <spu-search-advice ref="adviceSearch" @confirm="adviceSearchFunc"></spu-search-advice>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
        </div>
        <div class="search-table">
            <el-row>
                <el-col :span="22">
          <span>
            <router-link to="/spumanager/add" v-permission:spu_manager_add>
              <el-button type="primary" class="btn-default" icon="el-icon-plus">新增SPU</el-button>
            </router-link>
          </span>
                </el-col>
                <el-col :span="2">
                    <div class="pull-right">
                        <sxh-help code="030101"></sxh-help>
                    </div>
                </el-col>
            </el-row>
            <sxh-table
                    ref="spuList"
                    :dataSource="data"
                    :config="config"
                    @selection-change="handleSelectionChange"
                    @expand-change="getSkuList"
            >
                <!--<el-table-column type="selection" width="55"></el-table-column>-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table
                                size="mini"
                                label-position="left"
                                :data="scope.row.skuList"
                                :show-header="true"
                                border
                                style="width: 100%;"
                        >
                            <el-table-column label="sku规格名称" prop="productName"></el-table-column>
                            <el-table-column label="单位" prop="unit" width="80"></el-table-column>
                            <el-table-column label="sku编码" prop="prodNumber" width="200">
                                <template slot-scope="item">
                                    {{ item.row.prodNumber }}
                                    <span
                                            style="color:brown"
                                    >{{ item.row.refId > 0 ? "(子码)" : "" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="条形码" prop="barCode" width="100"></el-table-column>
                            <el-table-column label="采销状态" width="100">
                                <template slot-scope="item">
                                    <!-- 审批通过后显示状态 -->
                                    <span v-if="item.row.processStatus == 3">
                    <span>
                      {{
                      item.row.canBuy === 1 ? "可订货" : "不可订货"
                      }}
                    </span>
                    <br/>
                    <span>
                      {{
                      item.row.canSale === 1 ? "可销售" : "不可销售"
                      }}
                    </span>
                  </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="processStatus" label="审核状态" width="80">
                                <template slot-scope="item">
                                    <sxh-process
                                            process-enum="SKU_AUDIT"
                                            :key="`sku_process_` + item.row.id"
                                            :ref-id="item.row.id"
                                            :process-status="item.row.processStatus"
                                    ></sxh-process>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="item">
                                    <el-button plain size="minier" @click="imgView(item.row.prodNumber, 2)">图库
                                    </el-button>
                                    <span v-permission:skuAudit>
                    <span v-if="null != item.row.sysAudit">
                      <el-button
                              plain
                              size="minier"
                              @click="auditSku(item.row)"
                              v-if="item.row.categoryId != null || ''"
                      >审核通过</el-button>
                      <el-button
                              plain
                              size="minier"
                              @click="rejectSku(item.row)"
                              v-if="item.row.categoryId != null || ''"
                      >打回</el-button>
                    </span>
                  </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="类目">
                    <template slot-scope="scope">
                        <span>一级：{{ scope.row.categoryName }}</span>
                        <div v-if="scope.row.twoCategoryName > ''">二级：{{ scope.row.twoCategoryName }}</div>
                        <div v-if="scope.row.threeCategoryName > ''">三级：{{ scope.row.threeCategoryName }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="spuNumber" label="SPU信息" width="200px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.spuNumber }}</span>
                        <el-tag
                                size="mini"
                                effect="plain"
                                title="商品属性"
                        >{{ $cacheUtil.getVal('storage_method',scope.row.storageModeCode )}}
                        </el-tag>
                        <br/>
                        <span title="组合名称">{{ scope.row.jointName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="spuName" label="品名"></el-table-column>
                <el-table-column prop="brandName" label="品牌"></el-table-column>
                <el-table-column prop="placeName" label="产地"></el-table-column>
                <el-table-column label="创建人信息" width="160px;">
                    <template slot-scope="scope">
                        <span>姓名：{{ scope.row.creatorName }}</span>
                        <br/>
                        <span>手机：{{ scope.row.adminUserMobile }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="processStatus" label="审核状态">
                    <template slot-scope="scope">
                        <sxh-process
                                process-enum="SPU_AUDIT"
                                :key="`spu_process_` + scope.row.id"
                                :ref-id="scope.row.id"
                                :process-status="scope.row.processStatus"
                        ></sxh-process>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-row>
                            <sxh-detail-view
                                    comp="spuView"
                                    :view-param="{
                    id: scope.row.id,
                    number: scope.row.spuNumber
                  }"
                            ></sxh-detail-view>
                            <el-button plain size="minier" @click="imgView(scope.row.spuNumber, 1)">图库</el-button>
                            <el-button plain size="minier" @click="deleteSPU(scope.row.id)"
                                       v-if="(scope.row.processStatus === -2 || scope.row.processStatus === 0)  && checkCreator(scope.row)">
                                删除
                            </el-button>
                            <span v-if="scope.row.spuType == 0 && checkEdit(scope.row)">
                <router-link :to="'/spumanager/edit/' + scope.row.id" v-permission:spu_manager_edit>
                  <el-button plain size="minier">编辑</el-button>
                </router-link>
              </span>
                        </el-row>
                        <el-row>
              <span v-if="null != scope.row.sysAudit">
                <span v-permission:spu_manager_audit>
                  <el-button
                          plain
                          size="minier"
                          v-if="scope.row.sysAudit.id != null"
                          @click="audit(1, scope.row.sysAudit.id)"
                  >审核通过</el-button>
                  <el-button
                          plain
                          size="minier"
                          v-if="scope.row.sysAudit.id != null"
                          @click="audit(-1, scope.row.sysAudit.id)"
                  >审核不通过</el-button>
                </span>
                  <!--<router-link :to="'/spumanager/audit/'+scope.row.id+ '/' + scope.row.sysAudit.id" v-permission:spu_manager_audit>审核</router-link>-->
              </span>
                            <el-button
                                    plain
                                    size="minier"
                                    v-if="scope.row.processStatus == 1 && checkCreator(scope.row)"
                                    @click="cancelAudit(scope.row.id)"
                            >取消审核
                            </el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </sxh-table>
        </div>
        <sxh-img-store
                ref="imgStore"
                :skuList="choosedSkuNumber"
                :spuList="choosedSpuNumber"
                :can-choose="false"
        ></sxh-img-store>
    </section>
</template>

<script>
    import {doExcelExport} from "@/common/util.js";
    import exportUtil from "../../common/utils/ExportUtil";
    import spuSearchAdvice from "./spu-search-advice";

    export default {
        name: "SpuList",
        components: {
            spuSearchAdvice
        },
        props: {
            filter: {
                type: Object,
                required: false,
                default: null
            }
        },
        data: function () {
            return {
                listData: [],
                menuBtnId: [],
                categoryNameData: [],
                twoCategoryNameData: [],
                threeCategoryNameData: [],
                isSubmit: false,
                loading: true,
                data: {},
                records: null,
                infoData: {},
                adviceRequest: null,
                choosedSpuNumber: [""],
                choosedSkuNumber: [""],
                config: {
                    getListData: this.getPagerListData,
                    simplePager: true,
                    showNo: false,
                    page: 1,
                    pagesize: 10
                },
                request: {
                    jointName: "",
                    creatorName: "",
                    spuNumber: "",
                    skuNumber: "",
                    processStatusList: [],
                    categoryList: [],
                    categoryId: "",
                    twoCategoryId: "",
                    threeCategoryId: ""
                },
                rules: {}
            };
        },
        created() {
            this.getData();
        },
        activated() {
            this.getData();
        },
        methods: {
            getData() {
                this.getListData();
            },
            imgView(number, type) {
                if (type === 1) {
                    this.$set(this.choosedSpuNumber, 0, number);
                    this.$set(this.choosedSkuNumber, 0, "");
                } else {
                    this.$set(this.choosedSkuNumber, 0, number);
                    this.$set(this.choosedSpuNumber, 0, "");
                }
                this.$refs.imgStore.show();
            },
            checkEdit: function (item) {
                var id = this.$store.state.userInfo.id;
                return (
                    ((0 == item.processStatus || -2 == item.processStatus) &&
                        item.creatorId == id) ||
                    3 == item.processStatus
                );
            },

            checkCreator: function (item) {
                var id = this.$store.state.userInfo.id;
                return item.creatorId == id;
            },
            /**
             * 类目信息获取
             */
            categoryChange(val) {
                this.request.categoryId = val.categoryId;
                this.request.twoCategoryId = val.twoCategoryId;
                this.request.threeCategoryId = val.threeCategoryId;
            },
            handleSelectionChange: function (val) {
                this.selectedRows = val;
            },
            /**
             * 查询明细
             */
            getListData: function () {
                this.config.page = 1;
                if (this.$refs.spuList) {
                    this.$refs.spuList.setPage(1);
                }
                this.getPagerListData(
                    this.config.page,
                    this.config.pagesize,
                    null,
                    false
                );
                this.getCountData();
            },
            /*
             * 获取分页数据
             * */
            getPagerListData: function (page, size, callback, count) {
                var self = this;
                var jsondata = Object.assign({}, self.adviceRequest || self.request);
                jsondata = {...jsondata, ...(this.filter || {})};
                this.config.page = page;
                this.config.pagesize = size;
                //取分页总数
                if (count) {
                    jsondata.page = 1;
                    jsondata.pagesize = 1;
                    this.$httpUtil.post({
                        url: "/spuBaseInfo/list.json",
                        data: jsondata,
                        contentType: "form", //json,form,multipart
                        loading: false, //不显示遮罩
                        succ: function (data) {
                            if (callback) {
                                callback(data);
                            }
                        }
                    });
                } else {
                    jsondata.page = page;
                    jsondata.pagesize = size;
                    jsondata.simple = 1;
                    this.$httpUtil.post({
                        url: "/spuBaseInfo/list.json",
                        data: jsondata,
                        contentType: "form", //json,form,multipart
                        succ: function (data) {
                            data.records = self.data.records;
                            self.data = data;
                            if (callback) {
                                callback(data);
                            }
                        }
                    });
                }
            },
            /*
             * 获取总数
             * */
            getCountData: function () {
                var self = this;
                this.getPagerListData(
                    this.config.page,
                    this.config.pagesize,
                    data => {
                        self.data.records = data.total;
                    },
                    true
                );
            },
            /**
             * 搜索功能
             */
            searchFun() {
                //高级搜索条件清空
                this.adviceRequest = null;
                this.request.page = 1;
                this.getListData();
            },
            /**
             * 高级搜索
             */
            adviceSearchFunc(param) {
                this.adviceRequest = param;
                this.adviceRequest.page = 1;
                this.request.page = 1;
                this.getListData();
            },
            /**
             * excel导出
             */
            excelExport() {
                var self = this;
                var jsondata = Object.assign({}, self.adviceRequest || self.request);
                jsondata = {...jsondata, ...(this.filter || {})};
                this.$httpUtil.post({
                    url: "/spuBaseInfo/export.json",
                    data: jsondata,
                    contentType: "json", //json,form,multipart
                    succ: function (data) {
                        //计算毛利率
                        var config = self.$metadata.spuExport;
                        exportUtil.exportByConfig(self, data.data, config);
                    }
                });
            },

            /**
             * 根据spu获取sku列表
             */
            getSkuList(row, event, column) {
                if (event) {
                    if (this.$commonUtil.valid.isEmpty(row.id)) {
                        this.$commonUtil.valid.throwEx(`行id为空`);
                    }
                    this.$httpUtil.post({
                        url: "/spuBaseInfo/getSkuListBySpu.json",
                        data: {
                            spuId: row.id
                        },
                        contentType: "form", //json,form,multipart
                        succ: function (data) {
                            row.skuList = data.data || [];
                        }
                    });
                }
            },

            auditSku(item) {
                var self = this;
                self
                    .$confirm("确认审核?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        self.$httpUtil.post({
                            url: "/base/prod/info/auditBaseProdInfo.json",
                            contentType: "form",
                            data: {
                                id: item.id,
                                status: 1
                            },
                            succ: function (data) {
                                self.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                self.getListData();
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            rejectSku(item) {
                var self = this;
                self
                    .$confirm("确认打回到申请人?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        self.$httpUtil.post({
                            url: "/base/prod/info/rejectBaseProdInfo.json",
                            contentType: "form",
                            data: {
                                id: item.id,
                                status: -1
                            },
                            succ: function (data) {
                                self.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                self.getListData();
                            }
                        });
                    })
                    .catch(() => {
                    });
            },

            /**
             * spu审批操作
             */
            audit(oper, id) {
                let self = this;
                if (id == null) {
                    return;
                }
                let url;
                let remark;
                if (oper == 1) {
                    //审核通过
                    self
                        .$confirm("确认审核通过?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                        .then(() => {
                            url = "/spuBaseInfo/approveSuccess.json";
                            this.submitAudit(id, url, null);
                        });
                } else {
                    //审核不通过
                    this.$prompt("确认审核不通过？请填写备注", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消"
                    }).then(({value}) => {
                        remark = value;
                        url = "/spuBaseInfo/approveFailBack.json";
                        if (this.$commonUtil.valid.isEmpty(remark)) {
                            this.$commonUtil.valid.throwEx("请输入驳回备注");
                            return;
                        }
                        this.submitAudit(id, url, remark);
                    });
                }
            },

            /**
             * spu取消审核
             */
            cancelAudit(id) {
                let self = this;
                if (id == null) {
                    return;
                }
                self
                    .$confirm("确认取消审核?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        this.$httpUtil.post({
                            contentType: "form",
                            url: "/spuBaseInfo/cancelAudit.json",
                            data: {
                                id: id
                            },
                            succ: function (data) {
                                self.success("取消成功", self.getListData);
                            }
                        });
                    });
            },

            submitAudit(id, url, remark) {
                let self = this;
                this.$httpUtil.post({
                    contentType: "form",
                    url: url,
                    data: {
                        id: id,
                        remark: remark
                    },
                    succ: function (data) {
                        self.success("审核成功", self.getListData);
                    }
                });
            },

            success(msg, callback) {
                var self = this;
                self.$message({
                    message: msg,
                    type: "success"
                });
                if (callback) {
                    setTimeout(callback, 1500);
                }
            },
            deleteSPU(id) {
                var self = this;
                this.$commonUtil.message.confirm("确定删除SPU?", () => {
                    self.$httpUtil.post({
                        url: "/spuBaseInfo/deleteSPU.json",
                        data: {
                            id: id
                        },
                        contentType: "form",
                        succ: function (data) {
                            self.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            self.getListData();
                        }
                    });
                });
            },
        }
    };
</script>
