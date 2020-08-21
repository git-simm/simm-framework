<template>
<sxh-table :dataSource="data" ref="multipleTable" :config="prodConfig">
    <el-table-column prop="sguNumber,sguName" label="SGU信息" width="200">
        <template slot-scope="scope">
            <span>编码：{{ scope.row.sguNumber }}</span>
            <br />
            <span>名称：{{ scope.row.sguName }}</span>
            <br />
            <span v-if="scope.row.isAgent != 1">
                <el-tag size="mini" effect="plain" title="销售模式">
                    {{
            $cacheUtil.getVal("sale_type", scope.row.saleType)
            }}
                </el-tag>
            </span>
            <span v-if="scope.row.isAgent === 1">
                <el-tag size="mini" effect="plain" title="上架模式">
                    {{
            $cacheUtil.getVal("is_cycle_onsale", scope.row.isCycleOnSale)
            }}
                </el-tag>
            </span>
            <span v-if="scope.row.distributionType === 0">
                <el-tag size="mini" effect="plain" title="是否次日达">
                    {{
            scope.row.isNextDay===1?"次日达":"非次日达"
            }}
                </el-tag>
                <el-tag size="mini" effect="plain" title="是否为换购专区商品" v-if="scope.row.exchange === 1">换购专区商品</el-tag>
            </span>
        </template>
    </el-table-column>
    <el-table-column prop="prodNumber,prodName" label="商品信息" width="200">
        <template slot-scope="scope">
            <span>SKU编码：{{ scope.row.prodNumber }}</span>
            <br />
            <span>SKU名称：{{ scope.row.prodName }}</span>
        </template>
    </el-table-column>
    <el-table-column prop="supplyNumber,supplyName" label="供应商信息" width="200">
        <template slot-scope="scope">
            <sxh-detail-view comp="supplyView" :view-param="{
                id: scope.row.supplyId,
                number: scope.row.supplyNumber,
                isLink: true,
                label: scope.row.supplyNumber
              }"></sxh-detail-view>
            <br />
            <span>名称：{{ scope.row.supplyName }}</span>
            <br />
            <span v-if="scope.row.isAgent === 1">
                <el-tag size="mini" effect="plain" title="是否代理商">
                    {{
            $cacheUtil.getVal("is_agent_show", scope.row.isAgent)
            }}
                </el-tag>
            </span>
            <span v-if="scope.row.isAgent != 1">
                <el-tag size="mini" effect="plain" title="业务类型">
                    {{
            $cacheUtil.getVal("distribution_type", scope.row.distributionType)
            }}
                </el-tag>
            </span>
        </template>
    </el-table-column>··
    <el-table-column prop="creatorName,creatorMobile" label="创建人信息" width="180">
        <template slot-scope="scope">
            <span>姓名：{{ scope.row.creatorName }}</span>
            <br />
            <span>手机号：{{ scope.row.creatorMobile }}</span>
            <br />
            <el-tag size="mini" effect="plain" title="数据归属">
                <span v-if="scope.row.creatorRole == 0">总部</span>
                <span v-if="scope.row.creatorRole == 3">直购</span>
                <span v-if="scope.row.creatorRole == 1 || scope.row.creatorRole == 2">{{ scope.row.siteName }}</span>
                <span v-if="scope.row.creatorRole == 2">-{{ scope.row.cityName }}</span>
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="salePrice," label="销售价" width="100">
        <template slot-scope="scope">
            <span>{{ scope.row.salePrice }}</span>
        </template>
    </el-table-column>
    <el-table-column prop="commissionAmount" label="佣金" width="100">
        <template slot-scope="scope">
            <span>团长佣金：{{ scope.row.commissionAmount }}</span>
            <br />
            <span v-if="scope.row.isAgent === 1">实得佣金：{{ parseFloat(scope.row.commissionAmount*(1-0.07) || 0).toFixed(2) }}</span>
        </template>
    </el-table-column>
    <el-table-column prop="onSaleTime,takenOffTime" label="上下架时间" width="190">
        <template slot-scope="scope">
            <span v-if="scope.row.isCycleOnSale === 0">
                <span>上架：{{ scope.row.onSaleTime }}</span>
                <br />
                <span>下架：{{ scope.row.takenOffTime }}</span>
            </span>
            <span v-if="scope.row.isCycleOnSale === 1">
                <span>开始：{{ scope.row.cycleStartDate }}</span>
                <br />
                <span>结束：{{ scope.row.cycleEndDate }}</span>
                <br />
                <span>售卖：{{ scope.row.cycleStartTime }} - {{ scope.row.cycleEndTime }}</span>
            </span>
        </template>
    </el-table-column>
    <el-table-column prop="sellableStock" label="可售数量" width="100">
        <template slot-scope="scope">
            <span>{{ scope.row.sellableStock || ""}}</span>
        </template>
    </el-table-column>
    <el-table-column prop="guaranteePeriod" width="190">
        <template slot="header">
            <span>效期/预计(到/发)货时间</span>
            <sxh-popover tooltip="1.包邮商品显示预计发货时间<br/>2.自提商品显示预计到货时间" :tooltip-width="260"></sxh-popover>
        </template>
        <template slot-scope="scope">
            <span>生产日期：{{ scope.row.productionDate }}</span>
            <br />
            <span>保质期：{{ scope.row.guaranteePeriod }}</span>
            <br />
            <span>{{Number(scope.row.deliveryType) === 1 ? "预计发货时间" : "预计到货时间"}}：</span>
            <span>{{Number(scope.row.deliveryType) === 1 ? scope.row.sendDate : scope.row.arrivalDate}}</span>
        </template>
    </el-table-column>
    <el-table-column label="SGU状态" width="150">
        <template slot-scope="scope">
            {{
        scope.row.onSale == 1
        ? "上架"
        : scope.row.onSale == 0
        ? "下架"
        : "待上架"
        }}
        </template>
    </el-table-column>
    <!--<el-table-column label="是否显示小程序">
                <template  slot-scope="scope">{{scope.row.importEs==1?"已导入":"未导入"}}</template>
    </el-table-column>-->
    <el-table-column label="审核状态" width="190">
        <template slot-scope="scope">
            <sxh-process process-enum="SGU_AUDIT" :key="`sgu_process_` + scope.row.sguId" :ref-id="scope.row.sguId" :process-status="scope.row.processStatus"></sxh-process>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
        <template slot-scope="scope">
            <sxh-detail-view comp="sguView" :view-param="{ id: scope.row.sguId, number: scope.row.sguNumber }"></sxh-detail-view>
        </template>
    </el-table-column>
</sxh-table>
</template>

<script>
export default {
    name: "sguProdModeList",
    props: {
        getFilter: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            data: {
                records: 0
            },
            prodConfig: {
                getListData: this.getPagerListData,
                simplePager: true,
                multiple: false,
                page: 1,
                pagesize: 10
            }
        };
    },
    methods: {
        search: function (data) {
            //回到首页
            if (this.$refs.multipleTable) {
                this.prodConfig.page = 1;
                this.$refs.multipleTable.setPage(1);
            }
            this.getListData();
        },
        getListData: function () {
            this.getPagerListData(this.prodConfig.page, this.prodConfig.pagesize);
            //异步获取总数量
            this.getCountData();
        },
        getPagerListData: function (page, size, callback, count) {
            var self = this;
            var jsondata = {
                ...{},
                ...this.getFilter()
            };
            for (var p in jsondata) {
                if (this.$commonUtil.valid.isEmpty(jsondata[p])) {
                    jsondata[p] = null;
                }
            }
            this.prodConfig.page = page;
            this.prodConfig.pagesize = size;
            //取分页总数
            if (count) {
                jsondata.pager = {
                    pageNo: 1,
                    pageSize: 1
                };
                this.$httpUtil.post({
                    url: "/sguBaseInfo/sguProdlist.json",
                    data: jsondata,
                    loading: false, //不显示遮罩
                    succ: function (data) {
                        if (callback) {
                            callback(data);
                        }
                    }
                });
            } else {
                jsondata.pager = {
                    pageNo: page,
                    pageSize: size,
                    simple: this.prodConfig.simplePager ? 1 : 0
                };
                this.$httpUtil.post({
                    url: "/sguBaseInfo/sguProdlist.json",
                    data: jsondata,
                    succ: function (data) {
                        self.data = data;
                        self.data.records = self.records;
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
                this.prodConfig.page,
                this.prodConfig.pagesize,
                data => {
                    self.records = data.total;
                    self.data.records = data.total;
                },
                true
            );
        }
    }
};
</script>
