<template>
  <section class="content-section sgu-prodlist">
    <!-- 编辑模式 -->
    <el-row>
      <el-col>
        <p class="text-theme">*此处商品的顺序为前台小程序SGU下商品的展示顺序</p>
        <h2
          class="text-theme"
          style="color:indianred;padding-bottom:40px;"
          v-if="canShow(`isAddedStock`)"
        >
          <el-col :span="11">提示：增加库存填写正数，减少库存填写负数</el-col>
        </h2>
        <el-table
          border
          ref="multipleTable"
          :data="formData.sguProdInfoList"
          style="width: 100%;margin-top:10px;"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="70" label="序号"></el-table-column>
          <el-table-column width="180" label="商品信息" :key="Math.random()">
            <template slot-scope="scope">
              <sxh-detail-view
                comp="prodView"
                :view-param="{id:scope.row.prodId,number:(scope.row.prodId+`-`+scope.row.skuNumber),
                isLink:true,label:scope.row.prodName}"
              ></sxh-detail-view>
              <div>SKU码：{{ scope.row.skuNumber }}</div>
              <div v-if="scope.row.isPayByBalance==1">
                <el-tag size="mini" effect="plain">{{scope.row.isPayByBalance==1?"可余额支付":""}}</el-tag>
              </div>
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
                  :disabled="!canEdit('salePrice')"
                  @change="
                    val => {
                      scope.row.salePrice = val;
                      cellChange(scope.row, `salePrice`);
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
              <div v-if="canShow(`isSubAccount`)">
                <el-input
                  type="number"
                  size="small"
                  min="0"
                  disabled
                  v-model="scope.row.platformServiceFee"
                  placeholder="请输入价格"
                >
                  <template slot="prepend">
                    <span>服务费</span>
                  </template>
                </el-input>
              </div>
              <!-- 非分账 -->
              <div v-else>
                <el-input
                  type="number"
                  size="small"
                  min="0"
                  disabled
                  v-model="scope.row.prodPrice"
                  placeholder="请输入价格"
                >
                  <template slot="prepend">
                    <span>平均价</span>
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
                  :disabled="!canEdit()"
                  v-model="scope.row.commissionAmount"
                  @change="
                    val => {
                      scope.row.commissionAmount = parseFloat(val || 0).toFixed(
                        2
                      );
                      cellChange(scope.row, `commissionChange`);
                    }
                  "
                  placeholder="请输入金额"
                >
                  <template slot="prepend">团长佣金</template>
                </el-input>
              </div>
              <div v-if="canShow(`isAgent`)">
                团长实得佣金：{{
                parseFloat(
                scope.row.commissionAmount * (1 - baseData.slbProfit) || 0
                ).toFixed(2)
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="grossProfitRate"
            label="毛利率(%)"
            :key="Math.random()"
            :render-header="grossProfitRender"
          >
            <template slot-scope="scope">
              <span class="low-rate">{{ scope.row.grossProfitRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="虚拟售卖信息"
            :key="Math.random()"
            :render-header="virtualInfoRender"
          >
            <template slot-scope="scope">
              <div>
                <el-input
                  type="number"
                  size="small"
                  min="0"
                  :disabled="!canEdit(`initSales`)"
                  v-model="scope.row.initSales"
                  placeholder="请输入销量"
                  @input="
                    val => {
                      scope.row.totalSales = val;
                    }
                  "
                >
                  <template slot="prepend">虚拟销量</template>
                </el-input>
              </div>
              <div>
                <el-input
                  type="number"
                  size="small"
                  min="0"
                  :disabled="!canEdit(`initSales`)"
                  v-model="scope.row.boughtPeople"
                  placeholder="请输入人数"
                >
                  <template slot="prepend">虚拟人数</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <!-- saleType==2 实物库存(非实物库存的场景在所有地方都显示销量字段，实物库存在) -->
          <el-table-column
            width="120"
            prop="stockSellableStock"
            label="仓库实物库存"
            :key="Math.random()"
          >
            <template slot-scope="scope">
              <div>{{scope.row.stockSellableStock}}</div>
            </template>
          </el-table-column>
          <el-table-column
            width="110"
            prop="totalSales"
            label="销量"
            :key="Math.random()"
            :render-header="totalSalesRender"
          >
            <template slot-scope="scope">
              <span>
                {{
                (scope.row.totalSales || 0) - (scope.row.initSales || 0)
                }}
              </span>
            </template>
          </el-table-column>
          <!-- 非安全库存模式 begin -->
          <!-- 预售模式；实物库存不用显示 -->
          <el-table-column
            width="180"
            prop="sellableStock"
            :key="Math.random()"
            label="可售数量"
            v-if="canShow(`sellableStock`)"
          >
            <template slot-scope="scope">
              <el-input
                type="number"
                min="0"
                :disabled="!canEdit()"
                v-model="scope.row.sellableStock"
                placeholder="请输入可售库存"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="addStock"
            :key="Math.random()"
            label="增减库存数"
            v-if="canShow(`isAddedStock`)"
          >
            <template slot-scope="scope">
              <el-input
                type="number"
                v-model="scope.row.addStock"
                placeholder="请输入增/减库存数量"
                id="messageInput"
              ></el-input>
              <!--<el-input-number style="width: 150px" min='0' :step="1" v-model="scope.row.addStock" placeholder="请输入增加库存数量"></el-input-number> -->
            </template>
          </el-table-column>
          <!-- 非安全库存模式 end -->
          <el-table-column
            width="200"
            :label="!isNextDayTo()?`${getArrivalDateName()}时间/售后周期`:`售后周期`"
            :key="Math.random()"
          >
            <template slot-scope="scope">
              <div v-if="!isNextDayTo()">
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
        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<script>
let math = require("mathjs");
import SguProdListSync from "./sgu-prodlist-sync.js";
import SguProdListRender from "./sgu-prodlist-render.js";
import SguProdListValid from "./sgu-prodlist-valid.js";
import SguProdListAdd from "./sgu-prodlist-add.js";
import SguProdListPropControl from "./sgu-prodlist-prop-control";
export default {
  name: "SguProdListMultiScope",
  props: {
    baseData: {},
    sgu: {}
  },
  mixins: [
    SguProdListSync,
    SguProdListRender,
    SguProdListValid,
    SguProdListAdd,
    SguProdListPropControl
  ],
  data() {
    return {
      addProdPage: false,
      formData: {
        sguProdInfoList: []
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
      (this.formData.sguProdInfoList || []).forEach(prod => {
        if (!prod.grossProfit) {
          //计算佣金
          self.cellChange(prod, "commissionRateShow");
        }
      });
    }
  }
};
</script>
<style lang="less" scope>
@import url("sgu-prodlist.less");
</style>