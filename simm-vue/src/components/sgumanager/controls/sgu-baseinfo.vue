<template>
  <section class="content-section spu-edit">
    <el-form
      :model="formData"
      ref="formData"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <h4 class="text-theme">
          基本信息
          <span v-if="formData.id>0">【ID：{{formData.id}}】【编码：{{formData.sguNumber}}】</span>
        </h4>
        <el-col :span="8">
          <el-form-item size="mini" label="供应商：" prop="supplyName">
            <span>{{formData.supplyName}}</span>
            <span style="margin-top:10px;margin-left:10px;color:darkgoldenrod;">
              (
              <sxh-detail-view
                comp="supplyView"
                :view-param="{ id: formData.supplyId,number:formData.supplyNumber,
                isLink:true,label:$cacheUtil.getVal('settltType',formData.merchantModel,'') }"
              ></sxh-detail-view>)
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item size="mini" label="业务类型：" prop="distributionType">
            <span>{{$cacheUtil.getVal('distribution_type',formData.distributionType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.distributionType === 0">
          <el-form-item size="mini" label="配送方式：" prop="deliveryType">
            <span>{{$cacheUtil.getVal('delivery_type',formData.deliveryType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item size="mini" label="是否分账：" prop="isSubAccount">
            <span>{{$cacheUtil.getVal('commonIsOrNot',formData.isSubAccount)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-card class="box-card" style="margin-bottom:10px;">
        <el-row>
          <el-col :span="24">
            <h4 class="text-theme">上架设置</h4>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售卖类型" prop="saleType" v-if="formData.isAgent != 1">
              <el-radio-group v-model.number="formData.saleType" :disabled="!baseData.canEdit">
                <!-- 禁用安全库存 (非分账供应商禁止选择预售模式，安全库存模式禁用)-->
                <!-- :disabled="(item.key==1) || (item.key==0 && formData.isSubAccount==0)" -->
                <el-radio
                  v-for="(item, index) in saleTypes"
                  :label="item.key"
                  :key="'saleType' + index"
                  :disabled="item.key == 1"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="售卖类型："
              prop="saleType"
              v-else
            >{{$cacheUtil.getVal("sale_type",formData.saleType,"")}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="仅团长购买"
              label-width="150px"
              prop="onlyPartner"
              v-if="formData.distributionType != baseData.distributionMode.direct && baseData.onlyPartnerSign == baseData.onlyPartnerEnum.yes"
            >
              <el-radio-group v-model.number="formData.onlyPartner" :disabled="!baseData.canEdit">
                <el-radio
                  :label="item.key"
                  :key="'onlyPartner' + index"
                  v-for="(item, index) in onlyPartners"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否差异化上架"
              prop="isDiff"
              label-width="150px"
              v-if="baseData.cityIsDiff==1 || formData.isDiff==1"
            >
              <el-radio-group v-model.number="formData.isDiff" :disabled="!baseData.canEdit">
                <el-radio
                  :label="item.key"
                  :key="'isDiff' + index"
                  v-for="(item, index) in isDiffs"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--仅代理商 展示上架模式 非代理商默认 24小时上架-->
          <el-col :span="8" v-if="formData.isAgent == 1">
            <el-form-item label="上架模式" prop="isCycleOnSale">
              <el-radio-group v-model.number="formData.isCycleOnSale">
                <el-radio
                  :disabled="!baseData.canEdit"
                  :label="item.key"
                  :key="'isCycleOnSaleTypes' + index"
                  v-for="(item, index) in isCycleOnSaleTypes"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="快递运费"
              prop="postage"
              v-if="formData.distributionType == baseData.distributionMode.direct"
            >
              <el-input
                v-model.number="formData.postage"
                type="number"
                :min="0"
                :disabled="!baseData.canEdit"
              >
                <template slot="prepend">￥</template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 自提品显示是否次日达 -->
          <el-col :span="8">
            <el-form-item
              label="是否次日达"
              prop="isNextDay"
              v-if="formData.distributionType===0 && formData.saleType===0 
                        && (formData.deliveryType !== 1 || formData.isNextDay == 1)"
            >
              <el-radio-group v-model.number="formData.isNextDay">
                <el-radio
                  :label="item.key"
                  :key="'isNextDay' + index"
                  :disabled="!baseData.canEdit"
                  v-for="(item, index) in $cacheUtil.getDic(`is_nextDay`)"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否为换购商品"
              label-width="150"
              prop="exchange"
              v-if="baseData.sguExchangeSwitch == baseData.sguExchangeSwitchEnum.yes && formData.distributionType ===0"
            >
              <el-radio-group
                v-model.number="formData.exchange"
                :disabled="!baseData.canEdit || formData.distributionType === 1"
                @change="exchangeTypeChange"
              >
                <el-radio
                  :label="item.key"
                  :key="'exchange' + index"
                  v-for="(item, index) in exchangeTypes"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="false">
            <el-form-item label="排序" prop="sort">
              <el-input
                v-model.number="formData.sort"
                type="number"
                :min="0"
                :disabled="!baseData.modify"
              >
                <template slot="append">
                  <el-popover placement="top-start" width="300" trigger="hover">
                    <div>
                      <p>1.排序值默认为1且可以修改,排序值越小排在越靠前;</p>
                      <p>2.此排序值只在小程序的【全部商品】专题有效,其他专题的排序可在业务系统操作;</p>
                      <p>3.城市SGU的码段为[0~2999];</p>
                      <p>4.省级SGU的码段为[3000~5999];</p>
                      <p>5.总部SGU的码段为[6000~9000];</p>
                    </div>
                    <span style="font-size: 18px; padding-left: 3px;" slot="reference">?</span>
                  </el-popover>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标签" prop="tag">
              <el-input v-model="formData.tag" type="text" style="width:90%;" placeholder="不超过3个字符"></el-input>
            </el-form-item>
          </el-col>
          <!--</el-col>-->
          <!-- 分时段售卖 -->
          <el-col :span="24" v-show="formData.isCycleOnSale == 1">
            <el-col :span="8">
              <el-form-item label="售卖日期" prop="cycleDateRange">
                <template slot="label">
                  <span>售卖日期</span>
                  <sxh-popover :tooltip="onSaleRemark" :tooltip-width="400"></sxh-popover>
                </template>
                <template>
                  <el-date-picker
                    v-model="formData.cycleDateRange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="formData.onSalePickerOptions"
                    :disabled="!baseData.canEdit"
                    @change="cycleDateRangeChange"
                  ></el-date-picker>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="售卖时段" prop="cycleTimeRange">
                <template>
                  <el-time-picker
                    :is-range="true"
                    :disabled="!baseData.canEdit"
                    :clearable="true"
                    v-model="formData.cycleTimeRange"
                    value-format="HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                    @change="cycleTimeRangeChange"
                  ></el-time-picker>
                </template>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" v-show="formData.isCycleOnSale !== 1">
            <el-col :span="8">
              <el-form-item label="上架时间" prop="onSaleTime">
                <template slot="label">
                  <span>上架时间</span>
                  <sxh-popover :tooltip="onSaleRemark" :tooltip-width="400"></sxh-popover>
                </template>
                <template>
                  <el-date-picker
                    v-model="formData.onSaleTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    @change="onSaleTimeChange"
                    :disabled="!baseData.canEdit"
                    :picker-options="formData.onSalePickerOptions"
                  ></el-date-picker>
                  <template slot="prepend">生产日期</template>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下架时间" prop="takenOffTime">
                <el-date-picker
                  v-model="formData.takenOffTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  @change="takenOffTimeChange"
                  :disabled="!baseData.canEdit"
                  :picker-options="formData.offSalePickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-col>
          <!-- 直购模式下设置配送范围 -->
          <el-col
            :span="24"
            v-if="formData.distributionType == baseData.distributionMode.direct || formData.deliveryType === 1"
          >
            <h4 class="text-theme">配送范围</h4>
            <el-form-item
              label-width="20px"
              prop="distributionTemplateId"
              style="margin-bottom:10px;"
              class="distribution"
            >
              <el-radio-group
                v-model.number="formData.distributionTemplateId"
                :disabled="!baseData.canEdit"
              >
                <el-radio
                  :label="item.id"
                  :key="'template' + index"
                  v-for="(item, index) in templateList"
                >{{ item.templateName }}</el-radio>
              </el-radio-group>
              <p style="color:darkgoldenrod;max-height:80px;overflow:auto;">
                <span
                  v-for="(item,
                index) in currentTemplate.distributionTemplateDetailList"
                  :key="index"
                  class="address-info"
                >{{ item.addressCity }}</span>
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formData.isDiff==1">
            <h4 class="text-theme">售卖分组设置</h4>
            <div style="max-height:110px;overflow: auto;">
              <el-form-item label="团长分组" :required="true">
                <sxh-checkbox-group :data="leaderGroupsData" v-model="formData.leaderGroups"></sxh-checkbox-group>
              </el-form-item>
            </div>
            <br />
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" style="margin-bottom:10px;">
        <el-row>
          <!-- 编辑 -->
          <el-col :span="24">
            <sgu-prod-city
              v-if="isCityOrDirect"
              ref="prodList"
              :sgu="formData"
              :entity="formData.direct"
              :baseData="baseData"
              @change="prodChange"
            ></sgu-prod-city>
            <sgu-prod-multi
              v-else
              ref="prodList"
              :sgu="formData"
              :entity="formData"
              :baseData="baseData"
              @change="prodChange"
            ></sgu-prod-multi>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="margin-top:8px;">
            <el-col :span="5">
              <el-form-item label="销售名称" prop="prefixName">
                <el-input
                  v-model.trim="formData.prefixName"
                  placeholder="请输入前缀"
                  @change="updateSguName"
                  :disabled="!baseData.canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-left:10px">
              <el-form-item label prop="sguName" label-width="40">
                <el-input v-model.trim="formData.sguName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="3" v-if="specList && specList.length > 1">
              <span style="font-size: 13px;">(多规格可选)</span>
            </el-col>
            <el-col style="margin-left:10px" :span="8">
              <el-tag
                type="info"
                style="margin:3px;"
                v-for="(item, index) in specList"
                :key="index"
              >{{ item }}</el-tag>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" style="margin-bottom:10px;">
        <sgu-img ref="sguImg" :entity="formData" :baseData="baseData" @change="imgChange"></sgu-img>
      </el-card>
      <p></p>
      <el-row>
        <!-- 直购 或 城市上架 -->
        <el-col :span="24" style="text-align:center;" v-if="isCityOrDirect">
          <span v-permission:sgu_manager_edit>
            <el-button type="primary" @click="exec('save')" v-if="baseData.modify">保存</el-button>
            <el-button type="primary" @click="exec('submit')" v-if="baseData.canEdit">提交</el-button>
          </span>
          <el-button style="margin-left:10px;" @click="exec('exit')">退出</el-button>
        </el-col>
        <!-- 商城 -->
        <el-col :span="24" style="text-align:center;" v-else>
          <span v-permission:sgu_manager_edit>
            <el-button type="primary" @click="exec('save')" v-if="baseData.modify">保存</el-button>
          </span>
          <el-button style="margin-left:10px;" @click="exec('next')">下一步</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
/**
 * 1、分账供应商对应的销售价是不允许调整的，直接读取供应商审核通过的价格
 */
import sguProdCity from "./sgu-prodlist/sgu-prodlist-city.vue";
import sguProdCityView from "./sgu-prodlist/sgu-prodlist-city-view.vue";
import sguProdMulti from "./sgu-prodlist/sgu-prodlist-multi.vue";
import sguProdMultiView from "./sgu-prodlist/sgu-prodlist-multi-view.vue";
import sguImg from "./sgu-img";
import sguBaseinfoMixin from "./sgu-baseinfo-mixin";
import sguBaseInfoCityEdit from "./sgu-baseinfo-cityedit";
import moment from "moment";
import SxhCheckboxGroup from "../../shixh/form/sxh-checkbox-group";
export default {
  name: "SguBaseInfo",
  mixins: [sguBaseinfoMixin, sguBaseInfoCityEdit],
  components: {
    SxhCheckboxGroup,
    "sgu-prod-city": sguProdCity,
    "sgu-prod-city-view": sguProdCityView,
    "sgu-prod-multi": sguProdMulti,
    "sgu-prod-multi-view": sguProdMultiView,
    sguImg
  },
  props: {
    entity: {
      postMethod: 0,
      postCost: 0
    },
    baseData: {}
  },
  computed: {
    //查看或审核模式
    isView() {
      return this.baseData.mode == "view" || this.baseData.mode == "audit";
    },
    //城市或直购上架
    isCityOrDirect() {
      return (
        this.formData.distributionType ==
          this.baseData.distributionMode.direct || this.baseData.cityEdit
      );
    }
  },
  created() {
    this.getTemplateList();
  },
  watch: {
    /**
     * 监听属性改变(初始化列表)
     */
    isCityOrDirect(val) {
      var self = this;
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
  },
  //方法列表
  methods: {
    /**
     * 初始化数据
     */
    initData(entity, added) {
      var self = this;
      this.formData = {
        ...this.formData,
        ...entity
      };
      this.resetSaleTypes();
      this.$nextTick(() => {
        //当prodList组件加载完成后，做接下来的操作
        if (added) {
          //新增一条数据
          self.formData.sguProdInfoList.push(
            self.$refs.prodList.wrapProdInfo(added)
          );
        }
        self.$refs.sguImg.initData(entity);
        // 编辑模式 处理直购及城市上架数据
        if (self.baseData.directEdit) {
          self.$refs.prodList.initData(self.formData.direct);
        } else if (self.baseData.cityEdit) {
          //城市取实物库存
          self.baseData.getRealStock(self.formData, self.baseData, stocks => {
            self.$refs.prodList.initData(
              self.baseData.processStatus == 3
                ? self.formData.direct
                : self.formData
            );
          });
        } else {
          self.$refs.prodList.initData(self.formData);
        }
      });
    },
    getData() {
      var self = this;
      var prodList = self.$refs["prodList"].getProdList();
      self.formData.hasChange = prodList.hasChange;
      if (self.isCityOrDirect && self.entity.processStatus == 3) {
        //审核通过后的城市级别的数据赋值到direct属性上
        self.formData.direct.sguProdInfoList = prodList.sguProdInfoList;
      } else {
        self.formData.sguProdInfoList = prodList.sguProdInfoList;
      }
      //获取图片信息
      var imgData = self.$refs.sguImg.getImgData();
      self.formData = {
        ...self.formData,
        ...imgData
      };
    },
    imgChange(data) {
      this.$emit("imgChange", data);
    },
    exec(cmd) {
      this.getData();
      //delete this.formData.sguImgs;
      this.$emit(cmd, this.formData);
    }
  }
};
</script>

<style lang="less" scoped>
.form-input {
  float: left;
  margin-bottom: 0;
  padding-right: 10px;
}

.address-info {
  margin-right: 10px;
}
</style><style>
.distribution .el-form-item__content {
  line-height: 20px !important;
}
</style>
