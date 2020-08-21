<template>
  <section class="content-section spu-edit">
    <!-- 新增 & 编辑模式 -->
    <el-row v-if="['add','edit','copy'].includes(baseData.mode)">
      <el-col :span="24">
        <el-steps :active="active" finish-status="success" space="300px" style="margin-top: 15px">
          <!-- @click.native="setStep(index)" -->
          <el-step
            v-for="(item, index) in steps"
            :key="'step' + index"
            :title="item.title"
            :icon="item.icon"
          ></el-step>
        </el-steps>
      </el-col>
      <el-col :span="24">
        <SguBaseInfo
          ref="baseInfo"
          v-show="active == 0"
          :entity="entity"
          :baseData="baseData"
          @imgChange="imgChange"
          @audit="audit"
          @distributionChange="distributionChange"
          @next="next"
          @prev="prev"
          @submit="submit"
          @save="save"
          @exit="exit"
        ></SguBaseInfo>
        <!-- <SguImg ref='sguImg' v-show="active==0" :entity="entity" :baseData="baseData" @audit="audit" @save="save" @submit="submit" @next="next" @prev="prev" @change='imgChange'></SguImg> -->
        <!-- 上架区域 -->
        <div v-if="entity.distributionType === 0 && !entity.cityEdit">
          <SguSaleArea
            ref="saleArea"
            v-show="active == 1"
            :entity="entity"
            :baseData="baseData"
            @audit="audit"
            @save="save"
            @submit="submit"
            @next="next"
            @prev="prev"
            @exit="exit"
          ></SguSaleArea>
        </div>
      </el-col>
    </el-row>
    <!-- 查看模式 -->
    <el-row v-else>
      <el-col :span="24">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="SGU信息" name="first">
            <SguView ref="baseInfo" :entity="entity" :baseData="baseData"></SguView>
            <!-- 上架区域 -->
            <div v-if="entity.distributionType === 0 && !entity.cityEdit">
              <SguSaleArea ref="saleArea" :entity="entity" :baseData="baseData"></SguSaleArea>
            </div>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="log">
            <sxh-log ref="detailLog" :biz-list="[1,17]" :id-list="[entity.id]"></sxh-log>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col
        v-if="baseData.mode == 'audit' && entity.sysAudit != null"
        :span="24"
        style="text-align:center;margin-top:20px;"
      >
        <span>
          <el-button type="primary" @click="audit(1)">审核通过</el-button>
          <el-button type="primary" @click="audit(-1)">审核不通过</el-button>
        </span>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import sguBaseInfo from "./controls/sgu-baseinfo";
import sguSaleArea from "./controls/sgu-sale-area";
import sguView from "./controls/sgu-view";
import sguEditBase from "./sgu-edit-base";
import sguEditSave from "./sgu-edit-save";
import sguEditInit from "./sgu-edit-init";
import sguCommonHandler from "./controls/sgu-common-handler";
export default {
  name: "sguEdit",
  components: {
    SguBaseInfo: sguBaseInfo,
    SguSaleArea: sguSaleArea,
    SguView: sguView
  },
  props: {
    //查看参数
    viewParam: {
      type: Object,
      required: false,
      default: null
    }
  },
  mixins: [sguEditBase, sguEditInit, sguEditSave, sguCommonHandler],
  data() {
    return {
      steps: [
        {
          title: "基本信息",
          icon: "el-icon-edit"
        },
        {
          title: "上架区域",
          icon: "el-icon-upload"
        }
      ],
      activeName: "first",
      active: 0,
      baseData: {
        saleMode: {
          advance: 0,
          safeStock: 1,
          realStock: 2
        },
        distributionMode: {
          store: 0, //商城
          direct: 1 //直购
        },
        onlyPartnerEnum: {
          // 仅团长可见 开关枚举值
          yes: "Y", // 开启
          no: "N" // 关闭
        },
        sguExchangeSwitchEnum: {
          // SGU换购开关 开关枚举值
          yes: "Y", // 开启
          no: "N" // 关闭
        },
        grossThresholdConfig: [],
        slbProfit: 0,
        getOnSaleCity: this.getOnSaleCity,
        getStockAvgPrice: this.getStockAvgPrice,
        validCityCanSale: this.validCityCanSale,
        multiplyVal: this.multiplyVal,
        calcDefaultCommissionAmount: this.calcDefaultCommissionAmount,
        calcGrossRate: this.calcGrossRate,
        syncSalePrice: this.syncSalePrice,
        getProInfo: this.getProInfo,
        getRealStock: this.getRealStock,
        mode: "add",
        modify: true,
        canEdit: true,
        //城市支持销提分离
        citySaleLogisticsPart: 0,
        //城市团长佣金默认比例(0表示无效，有效值需要大于0小于100)
        cityCommissionRatio: 0,
        goBack: this.goBack,
        // 用户信息
        userInfo: this.$store.state.userInfo
      },
      entity: {
        id: null,
        grossProfitRate:"",
        sguProdInfoList: []
      }
    };
  },
  created() {
    //TODO:获取基础配置信息
    this.getDicConfig();
    //执行初始化方法
    this.initData();
  },
  //方法列表
  methods: {
    goBack: function() {
      if (this.viewParam) {
        this.viewParam.goBack();
      } else {
        this.$back();
      }
    },
    exit() {
      this.goBack();
    },
    next(formData) {
      //将编辑完成的数据返回给主界面
      this.entity = {
        ...this.entity,
        ...formData
      };
      //-- 切换前数据传递 ----
      if (this.active == 0) {
        //切换前校验一下
        if (
          !(
            this.$commonUtil.valid.isEmpty(this.entity.processStatus) ||
            this.entity.processStatus == -2 ||
            this.entity.processStatus == 0
          )
        ) {
          this.valid(this.entity, 0);
        }
        if (this.syncProdToCity()) return;
        if (this.$refs.saleArea) {
          this.$refs.saleArea.updateProdList(this.entity);
        }
      }
      this.active++;
    },
    prev(formData) {
      if (formData) {
        this.entity = {
          ...this.entity,
          ...formData
        };
      }
      if (this.active > 0) {
        this.active--;
      }
    },
    setStep(index) {
      this.active = index;
    },
    /**
     * 图片信息变更
     */
    imgChange(formData) {
      //刷新图片数据
      this.entity = {
        ...this.entity,
        ...formData
      };
    },
    /**
     * 商品变更同步给城市(城市上架 待验证)
     */
    syncProdToCity() {
      var self = this;
      if (
        this.entity.hasChange &&
        this.$refs.saleArea &&
        this.entity.distributionType == this.baseData.distributionMode.store &&
        !this.baseData.cityEdit
      ) {
        this.entity.hasChange = false;
        //判断发生变化，需要通知给上架区域做调整(商城)
        if (
          this.entity.sguProdInfoList.some(
            prod => (prod.sguProdSaleScopes || []).length > 0
          )
        ) {
          //1.页签跳转到尾页
          this.setStep(1);
          //2.弹出同步基础信息的提示
          //审核通过
          self
            .$confirm(
              "商品列表信息发生改变,是否将最新设置值同步到所有的城市中?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
            .then(() => {
              self.$refs.saleArea.baseResetCityInfo();
            });
          return true;
        }
      }
      return false;
    },
    //配送方式改变
    distributionChange(formData) {
      if (formData) {
        this.entity = {
          ...this.entity,
          ...formData
        };
      }
      //
      if (this.entity.distributionType == 1 || this.baseData.cityEdit) {
        this.steps = [
          {
            title: "基本信息",
            icon: "el-icon-edit"
          }
        ];
      } else {
        this.steps = [
          {
            title: "基本信息",
            icon: "el-icon-edit"
          },
          {
            title: "上架区域",
            icon: "el-icon-upload"
          }
        ];
      }
    }
  }
};
</script>
