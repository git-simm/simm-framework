<template>
    <section class="content-section sgu-prodlist">
        <!-- 编辑模式 -->
        <el-row>
            <el-col>
                <h4 class="text-theme">
                    商品列表
                </h4>
                <el-table
                        border
                        ref="multipleTable"
                        :data="formData.sguPlanProdInfoList"
                        style="width: 100%;margin-top:10px;"
                >
                    <el-table-column type="index" width="60" label="序号" :key="Math.random()"></el-table-column>

                    <el-table-column
                            width="200"
                            label="sku编码"
                            :key="Math.random()"
                    >
                        <template slot-scope="scope">
                            <el-input
                                    type="text"
                                    size="small"
                                    v-model="scope.row.skuNumber"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column width="200" label="价格信息(元)" :key="Math.random()">
                        <template slot-scope="scope">
                            <div>
                                <!-- 分账供应商不能调整销售价 -->
                                <el-input
                                        size="small"
                                        type="number"
                                        :step="0.01"
                                        min="0.01"
                                        @change="
                    val => {
                      scope.row.salePrice = val;
                    }
                  "
                                        v-model="scope.row.salePrice"
                                        placeholder="请输入销售价"
                                >
                                    <template slot="prepend">销售价</template>
                                </el-input>
                            </div>
                            <div>
                                <el-input
                                        type="number"
                                        :step="0.01"
                                        size="small"
                                        min="0"
                                        v-model="scope.row.marketPrice"
                                        placeholder="请输入划线价格"
                                        @change="
                    val => {
                      if (val > 0) {
                        scope.row.marketPrice = Number(
                          parseFloat(val).toFixed(2)
                        );
                      }
                    }
                  "
                                >
                                    <template slot="prepend">划线价</template>
                                </el-input>
                            </div>
                            <div>
                                <el-input
                                        type="number"
                                        size="small"
                                        min="0"
                                        v-model="scope.row.platformServiceFee"
                                        placeholder="请输入价格"
                                        v-if="formData.supplyInfo!=null&&formData.supplyInfo.isSubAccount===1"
                                >
                                    <template slot="prepend">
                                        <span>服务费</span>
                                    </template>
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="230" label="佣金金额(元)" :key="Math.random()">
                        <template slot-scope="scope">
                            <div>
                                <el-input
                                        type="number"
                                        size="small"
                                        :min="0"
                                        :controls="false"
                                        v-model="scope.row.commissionAmount"
                                        @change="
                    val => {
                      scope.row.commissionAmount = parseFloat(val || 0).toFixed(
                        2
                      );
                    }
                  "
                                        placeholder="请输入金额"
                                >
                                    <template slot="prepend">团长佣金</template>
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="200"
                            label="虚拟售卖信息"
                            :key="Math.random()"
                    >
                        <template slot-scope="scope">
                            <div>
                                <sxh-input-number
                                        :value="0"
                                        :min="0"
                                        :precision="0"
                                        :step="1"
                                        step-strictly
                                        size="small"
                                        :controls="false"
                                        title="请输入大于或等于0的整数"
                                        v-model="scope.row.initSales"
                                >
                                    <template slot="prepend">虚拟销量</template>
                                </sxh-input-number>

                            </div>
                            <div>
                                <sxh-input-number
                                        :value="0"
                                        :min="0"
                                        :precision="0"
                                        :step="1"
                                        step-strictly
                                        size="small"
                                        :controls="false"
                                        title="请输入大于或等于0的整数"
                                        v-model="scope.row.boughtPeople"
                                >
                                    <template slot="prepend">虚拟人数</template>
                                </sxh-input-number>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 非安全库存模式 begin -->
                    <!-- 预售模式；实物库存不用显示 -->
                    <el-table-column
                            width="180"
                            prop="sellableStock"
                            :key="Math.random()"
                            label="可售数量"
                    >
                        <template slot-scope="scope">
                            <el-input
                                    type="number"
                                    min="0"
                                    v-model="scope.row.sellableStock"
                                    placeholder="请输入可售库存"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <!-- 非安全库存模式 end -->
                    <el-table-column
                            width="200"
                            :key="Math.random()"
                            :label="`${getArrivalDateName()}时间/售后周期`"
                    >
                        <template slot-scope="scope">
                            <div>
                                <sxh-input-number
                                        v-if="isDelivery()"
                                        :precision="0"
                                        :step="24"
                                        step-strictly
                                        size="small"
                                        :controls="false"
                                        title="请输入24的倍数值"
                                        v-model="scope.row.sendHours"
                                        @input="val=> setSendDate(val,scope.row)"
                                >
                                    <template slot="prepend">下单后</template>
                                    <template slot="append">小时发货</template>
                                </sxh-input-number>
                                <el-date-picker
                                        v-else
                                        v-model="scope.row.arrivalDate"
                                        style="width:100%"
                                        size="small"
                                        @change="val=>arrivalDateChange(val,scope.row)"
                                        :placeholder="`请输入${getArrivalDateName()}时间`"
                                        :picker-options="{disabledDate: disableArrivalDate}"
                                ></el-date-picker>
                            </div>
                            <div>
                                <el-input
                                        type="text"
                                        size="small"
                                        v-model="scope.row.afterSaleCycle"
                                        placeholder="例:一个月"
                                >
                                    <template slot="prepend">售后周期</template>
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="260" label="效期" :key="Math.random()">
                        <template slot-scope="scope">
                            <div>
                                <el-input
                                        type="text"
                                        size="small"
                                        v-model="scope.row.productionDate"
                                        placeholder="例:2019年11月11日"
                                >
                                    <template slot="prepend">生产日期</template>
                                </el-input>
                            </div>
                            <div>
                                <el-input
                                        type="text"
                                        size="small"
                                        v-model="scope.row.guaranteePeriod"
                                        placeholder="例:十二个月"
                                >
                                    <template slot="prepend">保&nbsp; 质&nbsp; 期</template>
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 团购的商品明细，以及直购的SGU可以显示是否限购的条件 -->
                    <el-table-column
                            width="200"
                            label="是否限购"
                            :key="Math.random()"
                    >
                        <template slot-scope="scope">
                            <div>
                                <el-select size="small" v-model="scope.row.isLimit">
                                    <el-option label="否" :value="0"></el-option>
                                    <el-option label="是" :value="1"></el-option>
                                </el-select>
                            </div>
                            <!-- 审批中 或者 审批通过数据库里已经保存了限购数量 这时不允许再编辑限购数量-->
                            <div v-if="scope.row.isLimit == 1">
                                <el-input
                                        size="small"
                                        type="number"
                                        v-model="scope.row.limitAmount"
                                        :min="1"
                                        :step="1"
                                        title="每个用户最多购买数量"
                                        placeholder="每个用户最多购买数量"
                                >
                                    <template slot="prepend">限购数量</template>
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    let math = require("mathjs");

    import SguProdListValid from "./sgu-prodlist-valid.js";
    import SguProdListPropControl from "./sgu-prodlist-prop-control";

    export default {
        name: "SguProdMulti",
        props: {
            baseData: {},
            sgu: {},
            entity: {},
        },
        mixins: [
            SguProdListValid, SguProdListPropControl
        ],
        created() {
            this.initData();
        },
        data() {
            return {
                addProdPage: true,
                oldProdList: [],
                formData: {
                    // add in 2019-11-27 批量设置属性
                    defaultSellableStock: 0,
                    defaultInitSales: 0,
                    defaultBoughtPeople: 0,
                    defaultSalePrice: 0,
                    defaultMarketPrice: 0,
                    defaultCommissionAmount: 0,
                    defaultSharedCommissionAmount: 0,
                    defaultCommissionAmountRate: "",
                    defaultSharedCommissionRate: "",
                    defaultAfterSaleCycle: "",
                    defaultProductionDate: "",
                    defaultGuaranteePeriod: "",
                    defaultIsLimit: 0,
                    defaultLimitAmount: "",
                    
                }
            };
        },
        //方法列表1
        methods: {
            /**
             * 刷新数据
             */
            initData(entity) {

                var self = this;
                //拷贝列表信息
                this.formData = {
                    ...this.formData,
                    ...entity
                };

                //商品选品界面
                this.oldProdList = JSON.parse(
                    JSON.stringify(this.formData.sguPlanProdInfoList || [])
                );
            },
        }
    };
</script>
<style lang="less" scope>
    @import url("./sgu-prodlist.less");
</style>