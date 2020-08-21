<template>
  <section class="content-section spu-edit">
    <el-row>
      <el-col :span="16">
        <h4 class="text-theme">
          上架区域
          <span v-if="!viewMode">
            <span v-if="baseData.modify" style="margin-right:50px;">
              <el-switch
                :width="40"
                v-model="allSale"
                @change="countryChange"
                active-color="#13ce66"
                inactive-color="#cccccc"
                :active-text="allSale ? `全国上架` : `全国下架`"
              ></el-switch>
            </span>
            <!-- sku编码 -->
            <span v-if="baseData.canEdit" style="margin-right:20px;">
              <el-button @click="resetCityInfo">重置城市商品配置</el-button>
            </span>
            <span v-if="!isNextDayTo && baseData.modify">
              <el-button @click="resetArrivalDateInfo">重置预计到货时间</el-button>
            </span>
          </span>
        </h4>
        <div style="max-height:400px;overflow:auto;">
          <el-collapse v-for="(item, index) in siteList" :key="'site' + index">
            <el-collapse-item :title="item.site_name" :name="item.id">
              <template slot="title">
                <span>{{ item.site_name }}</span>
                <span style="margin-left:10px;" v-if="!viewMode && baseData.modify">
                  <el-switch
                    @click.native.stop
                    :width="40"
                    v-model="item.allSale"
                    active-color="#13ce66"
                    inactive-color="#cccccc"
                    :active-text="item.allSale ? `全省上架` : `全省下架`"
                    @change="siteChange(item)"
                  ></el-switch>
                </span>
                <b style="margin-left:20px;" v-if="item.onSaleList">上架:</b>
                <b style="margin-left:10px;color:#13ce66">{{ item.onSaleList }}</b>
              </template>
              <el-table
                border
                highlight-current-row
                ref="multipleTable"
                :data="item.cityList"
                @row-click="currentChange"
                style="width: 100%;margin-top:10px;cursor:pointer;"
              >
                <el-table-column prop="level_name" width="240" label="城市"></el-table-column>
                <el-table-column width="140" label="上架" v-if="!viewMode && baseData.modify">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isOnSale"
                      active-color="#13ce66"
                      inactive-color="#cccccc"
                      :active-text="scope.row.isOnSale ? `上架` : `下架`"
                      @change="change(item, scope.row)"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column width="80" label="上架" v-else>
                  <template slot-scope="scope">
                    <span
                      :style="{
                        color: scope.row.isOnSale ? '#13ce66' : '#cccccc'
                      }"
                    >{{ scope.row.isOnSale ? "上架" : "下架" }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
      <el-col :span="24" v-show="currentCity > ''">
        <h4 class="text-theme">
          <el-col :span="11">商品信息设置</el-col>
          <span
            style="color:red;font-weight:bold;letter-spacing:10px;"
          >{{ "[ " + currentCity + " ]" }}</span>
          <p v-if="cityData.saleLogisticsPart ===1" style="text-align:center;font-size:14px;">
            <span style="font-weight:bold">已开启提销分离模式</span> : 团长佣金为销售团长佣金，不包含自提点佣金
          </p>
        </h4>
        <sgu-prod-multi-scope-view
          v-if="viewMode"
          ref="prodList"
          :sgu="formData"
          :baseData="baseData"
        ></sgu-prod-multi-scope-view>
        <sgu-prod-multi-scope v-else ref="prodList" :sgu="formData" :baseData="baseData"></sgu-prod-multi-scope>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;" v-if="!viewMode">
      <el-col :span="24" style="text-align:center;">
        <span v-permission:sgu_manager_edit>
          <el-button type="primary" @click="exec('save')" v-if="baseData.modify">保存</el-button>
          <el-button type="primary" @click="exec('submit')" v-if="baseData.canEdit">提交</el-button>
        </span>
        <el-button style="margin-left:10px;" @click="exec('prev')">上一步</el-button>
        <el-button style="margin-left:10px;" @click="exec('exit')">退出</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import sguProdMultiScope from "./sgu-prodlist/sgu-prodlist-multi-scope.vue";
import sguProdMultiScopeView from "./sgu-prodlist/sgu-prodlist-multi-scope-view.vue";
import sguSaleAreaInit from "./sgu-sale-area-init";
import sguSaleAreaReset from "./sgu-sale-area-reset";
import moment from "moment";
export default {
  name: "SpuSaleArea",
  components: {
    "sgu-prod-multi-scope": sguProdMultiScope,
    "sgu-prod-multi-scope-view": sguProdMultiScopeView
  },
  mixins: [sguSaleAreaInit, sguSaleAreaReset],
  props: {
    baseData: {},
    entity: {}
  },
  data() {
    return {
      allSale: false,
      hasInitCity: false,
      currentCity: "",
      //省级列表
      siteList: [],
      //城市列表
      cityList: [],
      scopeList: [],
      formData: {
        sguProdInfoList: [],
        cityGroups: {},
        distributionTemplateId: ""
      },
      cityData: {
        sguProdInfoList: []
      }
    };
  },
  watch: {
    "entity.saleType": {
      //销售类型发生改变
      handler: function(val) {
        this.formData.saleType = val;
        if (val == 2) {
          //实物库存
          this.getRealStock();
        } else if (val === 0) {
          this.getRealStock();
          this.resetStock();
        } else {
          //其他库存(重置可用库存)
          //此操作，是要考虑当 城市信息已经设置，却切换了售卖模式，而导致可用库存值被更改的问题
          this.resetStock();
        }
      }
    },
    "entity.isNextDay": {
      //是否次日达发生改变发生改变
      handler: function(val) {
        this.formData.isNextDay = val;
      }
    },
    "entity.onSaleTime": {
      //上架时间发生改变发生改变
      handler: function(val) {
        this.formData.onSaleTime = val;
      }
    },
    "entity.takenOffTime": {
      //下架时间发生改变发生改变
      handler: function(val) {
        this.formData.takenOffTime = val;
      }
    },
    "entity.onlyPartner": {
      //下架时间发生改变发生改变
      handler: function(val) {
        this.formData.onlyPartner = val;
      }
    },
    entity: {
      //销售类型发生改变
      handler: function(val) {
        if (!this.hasInitCity) {
          this.hasInitCity = true;
          this.calcCityList(val);
        }
      },
      deep: true
    }
  },
  created() {
    this.initData();
  },
  computed: {
    //查看模式
    viewMode() {
      return this.baseData.mode == "view" || this.baseData.mode == "audit";
    },
    isNextDayTo() {
      //商城 & 非预售模式，为次日达
      return this.formData.isNextDay === 1;
    }
  },
  //方法列表1
  methods: {
    // ***********************************
    /**
     * 城市下商品信息循环处理
     */
    loopAllCityProd(callback) {
      if (!callback) return;
      var self = this;
      (self.siteList || []).forEach(site => {
        (site.cityList || []).forEach(city => {
          (city.sguProdInfoList || []).forEach(prod => {
            callback(prod, city, site);
          });
        });
      });
    },
    /**
     * 商品是否相等
     */
    prodEqual(cityProd, sguProd) {
      if (cityProd.prodId) {
        return cityProd.prodId == sguProd.prodId;
      } else if (cityProd.sguProdId) {
        return cityProd.sguProdId == sguProd.id;
      }
      return false;
    },
    // ***********************************
    /**
     * 触发商品信息更新
     */
    updateProdList(entity) {
      if (!this.hasInitCity) {
        this.hasInitCity = true;
        this.calcCityList(entity);
      }
      this.formData = {
        ...this.formData,
        ...entity
      };
      this.calcOnSaleState();
      //重置当前选中的城市数据
      this.currentCity = "";
      this.cityData = {
        sguProdInfoList: []
      };
    },
    /**
     * 全国上下架
     */
    countryChange(state) {
      this.siteList.forEach(s => {
        s.allSale = state;
        this.siteChange(s);
      });
    },
    /**
     * 省级上下架
     */
    siteChange(site) {
      var self = this;
      var state = site.allSale;
      site.cityList.forEach(c => {
        c.isOnSale = state;
        if (state) {
          self.baseData.validCityCanSale(c, () => {
            c.isOnSale = false;
            site.allSale = false;
            self.allSale = false;
          });
        }
      });
      this.change(site);
    },
    /**
     * 上架状态改变
     */
    change(site, city) {
      //城市设置
      if (city) {
        if (city.isOnSale) {
          //启动校验逻辑
          this.baseData.validCityCanSale(city, () => {
            city.isOnSale = false;
          });
        }
      }
      //改变上架状态
      var onSaleList = site.cityList
        .filter(a => a.isOnSale)
        .map(a => a.level_name);
      if (onSaleList && onSaleList.length > 0) {
        this.$set(site, "onSaleList", onSaleList.join("、"));
      } else {
        this.$set(site, "onSaleList", "");
      }
      this.calcOnSale();
    },
    /**
     * 如果sgu已经存在，处理编辑或查看状态，则组装城市列表
     */
    calcCityList(entity) {
      var self = this;
      var citys = (entity.sguProdInfoList || [])[0].sguProdSaleScopes || [];
      if (citys.length == 0) {
        //随意给个值999 触发城市信息获取
        this.getCityList(999);
        return;
      }
      this.cityList = citys.map(c => {
        return {
          supply_site_id: c.addressProvinceId,
          admin_shop_id: c.addressCityId,
          level_name: c.addressCity
        };
      });
      if (this.entity.processStatus !== 3) {
        //审核通过的数据不再显示提醒
        this.getCitiesSaleLogisticsPart(this.cityList, cities => {
          self.getProviceList(cities);
        });
      } else {
        //关联省级
        this.getProviceList(this.cityList);
      }
    },
    /**
     * 计算上架状态
     */
    calcOnSale() {
      this.siteList.forEach(site => {
        site.allSale = site.cityList.every(a => a.isOnSale);
      });
      this.allSale = this.siteList.every(a => a.allSale);
    },
    /**
     * 当前行改变
     */
    currentChange(city, old) {
      //切换到该城市下的商品信息
      this.cityData = city;
      this.currentCity = city.level_name;
      this.$refs.prodList.initData(this.cityData);
    },
    /**
     * 组装sgu
     */
    wrapSguProdInfoList() {
      var self = this;
      //按商品维度生成数据
      self.formData.sguProdInfoList.forEach(prod => {
        prod.sguProdSaleScopes = [];
        self.cityList.forEach(city => {
          if (city.sguProdInfoList != null) {
            var tempProd = city.sguProdInfoList.find(a =>
              self.prodEqual(a, prod)
            );
            if (tempProd == null) return;
            //上线状态，将数据修改为在售
            tempProd.valid = city.isOnSale ? 1 : 0;
            prod.sguProdSaleScopes.push(tempProd);
          }
        });
      });
    },
    exec(cmd) {
      //组装规格名称
      this.wrapSguProdInfoList();
      //只发布自己的信息
      this.$emit(cmd, {
        sguProdInfoList: this.formData.sguProdInfoList
      });
    }
  }
};
</script>

<style lang="less" scoped>
.number {
  width: 100%;
  padding-top: 5px;
}
</style>
