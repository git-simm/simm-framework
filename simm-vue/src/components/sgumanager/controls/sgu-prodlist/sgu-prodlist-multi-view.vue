<template>
  <section class="content-section sgu-prodlist">
    <!-- 查询模式 -->
    <el-row>
      <el-col>
        <h4 class="text-theme">商品列表</h4>
        <h6 class="text-bold">*此处商品的顺序为前台小程序SGU下商品的展示顺序</h6>
        <el-table
          border
          ref="multipleTable"
          :data="formData.sguProdInfoList"
          style="width: 100%;margin-top:10px;"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="70" label="序号"></el-table-column>
          <el-table-column width="240" label="商品信息" :key="Math.random()">
            <template slot-scope="scope">
              <sxh-detail-view
                comp="prodView"
                :view-param="{id:scope.row.prodId,number:(scope.row.prodId+`-`+scope.row.skuNumber),
                isLink:true,label:scope.row.prodName}"
              ></sxh-detail-view>
              <div>SKU编码:{{ scope.row.skuNumber }}</div>
              <div v-if="scope.row.isPayByBalance==1">
                <el-tag size="mini" effect="plain">{{scope.row.isPayByBalance==1?"可余额支付":""}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column width="180" prop="skuNumber" label="SKU编码"></el-table-column>-->
          <el-table-column width="120" label="价格信息(元)" :key="Math.random()">
            <template slot-scope="scope">
              <div>
                销售价:
                <b>{{ scope.row.salePrice }}</b>
              </div>
              <div>
                划线价:
                <b>{{ scope.row.marketPrice }}</b>
              </div>
              <div v-if="canShow(`isSubAccount`)">
                <span>
                  服务费:
                  <b>{{ parseFloat(scope.row.platformServiceFee || 0).toFixed(2) }}</b>
                </span>
              </div>
              <div v-else>
                <span>
                  平均价:
                  <b>{{ scope.row.prodPrice }}</b>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="150" label="佣金信息(元)" :key="Math.random()">
            <template slot-scope="scope">
              <div>
                团长佣金:
                <b>{{ scope.row.commissionAmount }}</b>
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
            width="120"
            prop="initSales"
            label="虚拟销量"
            v-if="canShow(`sellableStock`)"
            :key="Math.random()"
            :render-header="virtualInfoRender"
          >
            <template slot-scope="scope">
              <div>
                虚拟销量:
                <b>{{ scope.row.initSales }}</b>
              </div>
              <div>
                虚拟人数:
                <b>{{ scope.row.boughtPeople }}</b>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="sellableStock"
            label="可售数量"
            :key="Math.random()"
            v-if="canShow(`sellableStock`)"
          ></el-table-column>
          <el-table-column
            width="180"
            :label="!isNextDayTo()?`${getArrivalDateName()}时间/售后周期`:`售后周期`"
            :key="Math.random()"
          >
            <template slot-scope="scope">
              <div v-if="!isNextDayTo()">
                {{getArrivalDateName()}}:
                <span v-if="isDelivery()">{{ scope.row.sendDate }}</span>
                <span v-else>{{ scope.row.arrivalDate }}</span>
              </div>
              <div>售后周期:{{ scope.row.afterSaleCycle }}</div>
            </template>
          </el-table-column>
          <el-table-column width="160" label="效期" :key="Math.random()">
            <template slot-scope="scope">
              <div>生产日期:{{ scope.row.productionDate }}</div>
              <div>保&nbsp;质&nbsp;期&nbsp;:{{ scope.row.guaranteePeriod }}</div>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            label="是否限购"
            :key="Math.random()"
            :render-header="limitRender"
          >
            <template slot-scope="scope">
              <el-tag size="mini" effect="plain">{{ scope.row.isLimit == 1 ? "限购" : "不限购" }}</el-tag>
              <div v-if="scope.row.isLimit == 1">
                限购数量:
                <b>{{ scope.row.limitAmount }}</b>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品描述" width="200">
            <template slot-scope="scope">
              <div>{{scope.row.prodDesc}}</div>
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
import SguProdListPropControl from "./sgu-prodlist-prop-control";
export default {
  name: "SguProdListMultiView",
  props: {
    baseData: {},
    sgu: {},
    entity: {}
  },
  mixins: [
    SguProdListSync,
    SguProdListRender,
    SguProdListValid,
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