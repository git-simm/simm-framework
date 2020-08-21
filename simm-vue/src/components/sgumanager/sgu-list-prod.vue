<template>
<el-table size="mini" label-position="left" :data="sgu.list" :show-header="true" :max-height="300" border class="sgu-list-prod">
    <el-table-column label="商品名称" prop="prodName"></el-table-column>
    <el-table-column label="SKU编码" prop="prodNumber" width="180"></el-table-column>
    <el-table-column label="城市" prop="addressCity" width="120"></el-table-column>
    <el-table-column label="价格信息(元)">
        <template slot-scope="scope">
            <div>
                <span class="sub-title">销售价:</span>
                <b>{{ scope.row.salePrice }}</b>
            </div>
            <div>
                <span class="sub-title">划线价:</span>
                <b>{{ scope.row.marketPrice }}</b>
            </div>
            <div v-if="sgu.isSubAccount===1">
                <span class="sub-title">服务费:</span>
                <b>{{ parseFloat(scope.row.salePrice - scope.row.prodPrice).toFixed(2) }}</b>
            </div>
            <div v-else>
                <span class="sub-title">平均价:</span>
                <b>{{ scope.row.prodPrice }}</b>
            </div>
        </template>
    </el-table-column>
    <el-table-column label="佣金信息(元)" :key="Math.random()">
        <template slot-scope="scope">
            <div>
                <span class="sub-title">团长佣金:</span>
                <b>{{ scope.row.commissionAmount }}</b>
            </div>
            <div v-if="sgu.distributionType===1">
                <span class="sub-title">分享佣金:</span>
                <b>{{ scope.row.sharedCommissionAmount }}</b>
            </div>
            <div v-if="sgu.isAgent===1">
                <span class="sub-title">团长实得佣金:</span>
                <b>
                    {{
            parseFloat(
            scope.row.commissionAmount * (1 - baseData.slbProfit) || 0
            ).toFixed(2)
            }}
                </b>
            </div>
        </template>
    </el-table-column>
    <el-table-column prop="totalSales" label="销量" :key="Math.random()" :render-header="totalSalesRender">
        <template slot-scope="scope">
            <span>
                {{
          (scope.row.totalSales || 0) - (scope.row.initSales || 0)
          }}
            </span>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
import sguProdlistRender from "@/components/sgumanager/controls/sgu-prodlist/sgu-prodlist-render";
export default {
    name: "sguListOper",
    mixins: [sguProdlistRender],
    props: {
        sgu: {
            type: Object,
            default: function () {
                return {};
            }
        },
        baseData: {
            type: Object,
            required: false,
            default: function () {
                return {};
            }
        }
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.sgu-list-prod {
    .sub-title {
        color: darkgoldenrod;
        padding-right: 10px !important;
    }
}
</style>
