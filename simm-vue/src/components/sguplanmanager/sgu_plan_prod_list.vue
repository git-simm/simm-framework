<template>

    <el-table size="mini" label-position="left" :data="baseData.sguPlanProdInfoList" :show-header="true" :max-height="300" border class="sgu-plan-prod">
        <el-table-column label="SKU编码" prop="skuNumber" width="150"></el-table-column>
        <el-table-column width="110" label="价格信息(元)">
            <template slot-scope="scope">
                <div>
                    <span class="sub-title">销售价:</span>
                    <b>{{ scope.row.salePrice }}</b>
                </div>
                <div>
                    <span class="sub-title">划线价:</span>
                    <b>{{ scope.row.marketPrice }}</b>
                </div>
                <div>
                    <span class="sub-title">服务费:</span>
                    <b>{{scope.row.platformServiceFee}}</b>
                </div>
            </template>
        </el-table-column>
        <el-table-column width="110" label="佣金信息(元)" :key="Math.random()">
            <template slot-scope="scope">
                <div>
                    <span class="sub-title">团长佣金:</span>
                    <b>{{ scope.row.commissionAmount }}</b>
                </div>
                <div v-if="scope.row.sharedCommissionAmount > 0">
                    <span class="sub-title">分享佣金:</span>
                    <b>{{ scope.row.sharedCommissionAmount }}</b>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="可售数量" prop="sellableStock" width="100"></el-table-column>
        <el-table-column label="限购信息" prop="isLimit" width="100">
            <template slot-scope="scope">
                <div>
                    <span class="sub-title">是否限购:</span>
                    <b><el-tag size="mini">{{$cacheUtil.getVal("only_partner",  scope.row.isLimit)}}</el-tag></b>
                </div>
                <div v-if="scope.row.isLimit ==1">
                    <span class="sub-title">限购数量:</span>
                    <b>{{ scope.row.limitAmount }}</b>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="虚拟售卖信息" width="110">
            <template slot-scope="scope">
                <div>
                    <span class="sub-title">虚拟销量:</span>
                    <b>{{ scope.row.initSales }}</b>
                </div>
                <div>
                    <span class="sub-title">虚拟人数:</span>
                    <b>{{ scope.row.boughtPeople }}</b>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="效期" width="180">
            <template slot-scope="scope">
                <div>
                    <span class="sub-title">售后周期:</span>
                    <b>{{ scope.row.afterSaleCycle }}</b>
                </div>
                <div>
                    <span class="sub-title">生产日期:</span>
                    <b>{{ scope.row.productionDate }}</b>
                </div>
                <div>
                    <span class="sub-title">保&nbsp;质&nbsp;期&nbsp;:</span>
                    <b>{{ scope.row.guaranteePeriod }}</b>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="预计发货时间(小时)" prop="sendHours" width="120"></el-table-column>
        <el-table-column label="预计到货时间" prop="arrivalDate" width="150">
            <template slot-scope="scope">
            {{(scope.row.arrivalDate || '').substring(0,10)}}
            </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="280"></el-table-column>
    </el-table>

</template>

<script>
    export default {
        name: "sgu_plan_prod_list",
        props: {
            baseData: {
                type: Object,
                required: false,
                default: function () {
                    return {};
                }
            }
        }
    }
</script>

<style scoped>
    .sgu-plan-prod .sub-title {
        color: darkgoldenrod;
        padding-right: 10px !important;
    }
</style>