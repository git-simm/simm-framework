<template>
  <section class="content-section spu-edit">
    <el-row>
      <h4 class="text-theme">基本信息【ID：{{formData.id}}】【编码：{{formData.sguNumber}}】</h4>
      <sxh-view-container :item-span="8" :label-width="150" style="padding:10px;">
        <sxh-view-item title="供应商">
          <span>{{formData.supplyName}}</span>
          <span style="color:darkgoldenrod;margin-left:10px;">
            (
            <sxh-detail-view
              :view-param="{ id: formData.supplyId,number:formData.supplyNumber,isLink:true,label:$cacheUtil.getVal('settltType',formData.merchantModel,'') }"
              comp="supplyView"
            ></sxh-detail-view>)
          </span>
        </sxh-view-item>
        <sxh-view-item title="业务类型">
          <el-tag
            size="mini"
            effect="plain"
          >{{ $cacheUtil.getVal('distribution_type',formData.distributionType) }}</el-tag>
        </sxh-view-item>
        <sxh-view-item title="配送方式">
          <el-tag
            size="mini"
            effect="plain"
          >{{ $cacheUtil.getVal('delivery_type',formData.deliveryType) }}</el-tag>
        </sxh-view-item>
        <sxh-view-item title="销售名称">{{formData.sguName}}</sxh-view-item>
        <sxh-view-item title="快递运费">￥{{formData.postage}}</sxh-view-item>
        <sxh-view-item title="分享描述">{{formData.shareDesc}}</sxh-view-item>
        <sxh-view-item
          title="看点链接"
          v-if="formData.distributionType===1 && (formData.sguProdInfoList||[]).length>0"
          :span="24"
        >
          <span>{{shareLink}}</span>
          <el-button
            size="minier"
            type="primary"
            v-clipboard:copy="shareLink"
            v-clipboard:error="onError"
            v-clipboard:success="onCopy"
          >复制</el-button>
        </sxh-view-item>
      </sxh-view-container>
      <h4 class="text-theme">上架信息</h4>
      <sxh-view-container :item-span="8" :label-width="150" style="padding:10px;">
        <sxh-view-item title="售卖类型">{{ $cacheUtil.getVal('sale_type',formData.saleType) }}</sxh-view-item>
        <sxh-view-item title="标签">{{formData.tag}}</sxh-view-item>
        <sxh-view-item title="排序">{{formData.sort}}</sxh-view-item>
        <sxh-view-item v-if="formData.isCycleOnSale !==1" title="上架时间">
          <b>{{formData.onSaleTime}}</b>
        </sxh-view-item>
        <sxh-view-item v-if="formData.isCycleOnSale !==1" title="下架时间">
          <b>{{formData.takenOffTime}}</b>
        </sxh-view-item>
        <sxh-view-item v-if="formData.isCycleOnSale ==1" title="售卖日期">
          <b>{{formData.cycleStartDate}}&nbsp;至&nbsp;{{formData.cycleEndDate}}</b>
        </sxh-view-item>
        <sxh-view-item v-if="formData.isCycleOnSale ==1" title="售卖时段">
          <b>{{formData.cycleStartTime}}&nbsp;至&nbsp;{{formData.cycleEndTime}}</b>
        </sxh-view-item>
        <sxh-view-item
          title="审核状态"
        >{{ $cacheUtil.getVal('prod_audit_status',formData.processStatus ) }}</sxh-view-item>
        <sxh-view-item
          v-if="formData.isAgent==1"
          title="上架模式"
        >{{ $cacheUtil.getVal('is_cycle_onsale',formData.isCycleOnSale) }}</sxh-view-item>
        <sxh-view-item
          v-if="formData.distributionType != baseData.distributionMode.direct && baseData.onlyPartnerSign == baseData.onlyPartnerEnum.yes"
          title="仅团长购买"
        >{{ $cacheUtil.getVal('only_partner',formData.onlyPartner) }}</sxh-view-item>
        <sxh-view-item
          v-if="formData.distributionType===0 && formData.saleType===0"
          title="是否次日达"
        >{{ $cacheUtil.getVal('is_nextDay',formData.isNextDay) }}</sxh-view-item>
        <sxh-view-item
          v-if="formData.distributionType===0"
          title="是否为换购商品"
        >{{ $cacheUtil.getVal('exchange_type',formData.exchange) }}</sxh-view-item>
        <sxh-view-item title="是否差异化上架">{{ $cacheUtil.getVal('isDiff',formData.isDiff) }}</sxh-view-item>
        <sxh-view-item v-if="formData.isDiff==1" title="售卖分组信息" :span="24">
          <p style="max-height:30px;overflow:auto;">
            <el-tag
              :key="item.key"
              effect="plain"
              size="mini"
              v-for="item in isDiffData"
            >{{item.value}}</el-tag>
          </p>
        </sxh-view-item>
        <sxh-view-item
          v-if="formData.distributionType==baseData.distributionMode.direct || formData.deliveryType ==1"
          :span="24"
          title="配送模板"
        >{{currentTemplate.templateName}}</sxh-view-item>
        <sxh-view-item
          v-if="formData.distributionType==baseData.distributionMode.direct || formData.deliveryType ==1"
          :span="24"
          title="配送范围"
        >
          <p style="color:darkgoldenrod;max-height:80px;overflow:auto;">
            <el-tag
              :key="index"
              effect="plain"
              size="mini"
              v-for="(item,index) in currentTemplate.distributionTemplateDetailList.filter(a=>a.addressCity>'')"
            >{{item.addressCity}}</el-tag>
          </p>
        </sxh-view-item>
      </sxh-view-container>
    </el-row>
    <el-row>
      <!-- 直购或城市 审批后(商品信息) -->
      <!--   TODO 城市上架   -->
      <el-col :span="24">
        <!-- 直购 或 城市-->
        <sgu-prod-city-view
          :baseData="baseData"
          :sgu="formData"
          ref="prodList"
          v-if="isCityOrDirect"
        ></sgu-prod-city-view>
        <!-- 总部 或 省级-->
        <sgu-prod-multi-view :baseData="baseData" :sgu="formData" ref="prodList" v-else></sgu-prod-multi-view>
      </el-col>
    </el-row>
    <sgu-img :baseData="baseData" :entity="formData" ref="sguImg"></sgu-img>
  </section>
</template>

<script>
import sguProdCityView from "./sgu-prodlist/sgu-prodlist-city-view.vue";
import sguProdMultiView from "./sgu-prodlist/sgu-prodlist-multi-view.vue";
import sguImg from "./sgu-img";
import sguBaseinfoMixin from "./sgu-baseinfo-mixin";

export default {
  name: "SguView",
  mixins: [sguBaseinfoMixin],
  components: {
    "sgu-prod-city-view": sguProdCityView,
    "sgu-prod-multi-view": sguProdMultiView,
    sguImg
  },
  props: {
    entity: {},
    baseData: {}
  },
  data() {
    return {
      currentTemplate: {
        templateName: null,
        distributionTemplateDetailList: []
      },
      formData: {},
      shareLink: "",
      isDiffData: []
    };
  },
  computed: {
    //城市或直购上架
    isCityOrDirect() {
      return (
        this.formData.distributionType ==
          this.baseData.distributionMode.direct || this.baseData.cityEdit
      );
    }
  },
  watch: {
    //监听外部实体信息的变化
    entity: {
      handler: function(val) {
        this.formData = {
          ...this.formData,
          ...val
        };
        this.shareLink = `pages/home/goods-detail/goods-detail?prodId=${this.formData.sguProdInfoList[0].prodId}`;
        var self = this;
        this.templateChange(this.formData.distributionTemplateId);
        this.$nextTick(() => {
          //等待组件切换完成
          if (self.baseData.directEdit) {
            //直购编辑通过
            self.$refs.prodList.initData(self.formData.direct);
          } else if (self.baseData.cityEdit) {
            //城市获取实物库存
            self.baseData.getRealStock(self.formData, self.baseData, stocks => {
              self.$refs.prodList.initData(
                self.baseData.processStatus != 3
                  ? self.formData
                  : self.formData.direct
              );
            });
          } else {
            self.$refs.prodList.initData(self.formData);
          }
        });
      }
    }
  },
  created() {
    var self = this;
    this.getLeaderGroupsDataCallback = list => {
      self.formData.leaderGroups.forEach(id => {
        self.isDiffData.push(
          list.find(item => {
            return item.key == id;
          })
        );
      });
    };
  },
  //方法列表
  methods: {
    initData(entity) {
      if (this.$refs.sguImg) {
        this.$refs.sguImg.initData(entity);
      }
    },

    /**
     * 获取模板明细信息
     */
    templateChange(id) {
      if (id == null || id == undefined) return;
      var self = this;
      this.$httpUtil.post({
        url: "/distributionTemplate/getDetail.json?id=" + id,
        succ: function(data) {
          self.currentTemplate = data.data;
        }
      });
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message.success("内容已复制到剪切板！");
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message.error("抱歉，复制失败！");
    }
  }
};
</script>
