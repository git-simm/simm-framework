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
          <span v-if="formData.id>0">【计划ID：{{formData.id}}】【编码：{{formData.sguNumber}}】</span>
        </h4>
        <el-col :span="8">
          <el-form-item size="mini" label="供应商：" prop="supplyName">
            <span>{{formData.supplyName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商编码" prop="supplyNumber">
            <el-input v-model="formData.supplyNumber" type="text" style="width:90%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="mini" label="配送方式：" prop="deliveryType">
            <span>{{$cacheUtil.getVal('delivery_type',formData.deliveryType)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-card class="box-card" style="margin-bottom:10px;">
        <el-row>
          <el-col :span="24">
            <h4 class="text-theme">上架设置</h4>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仅团长购买" label-width="150px" prop="onlyPartner">
              <el-radio-group v-model.number="formData.onlyPartner">
                <el-radio
                  :label="item.key"
                  :key="'onlyPartner' + index"
                  v-for="(item, index) in onlyPartners"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 自提品显示是否次日达 -->
          <el-col :span="8">
            <el-form-item label="是否次日达" prop="isNextDay" v-if="formData.deliveryType===2">
              <el-radio-group v-model.number="formData.isNextDay">
                <el-radio
                  :label="item.key"
                  :key="'isNextDay' + index"
                  v-for="(item, index) in $cacheUtil.getDic(`is_nextDay`)"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否为换购商品" label-width="150" prop="exchange">
              <el-radio-group v-model.number="formData.exchange">
                <el-radio
                  :label="item.key"
                  :key="'exchange' + index"
                  v-for="(item, index) in exchangeTypes"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input v-model.number="formData.sort" type="number" :min="0">
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

          <el-col :span="24" v-show="formData.isCycleOnSale !== 1">
            <el-col :span="8">
              <el-form-item label="上架时间" prop="onSaleTime">
                <template slot="label">
                  <span>上架时间</span>
                  <sxh-popover :tooltip-width="400"></sxh-popover>
                </template>
                <template>
                  <el-date-picker
                    v-model="formData.onSaleTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    @change="onSaleTimeChange"
                    :picker-options="formData.onSalePickerOptions"
                  ></el-date-picker>
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
                  :picker-options="formData.offSalePickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-col>
          <!-- 直购模式下设置配送范围 -->
          <el-col :span="24" v-if="formData.deliveryType===1">
            <h4 class="text-theme">配送范围</h4>
            <el-form-item
              label-width="20px"
              prop="distributionTemplateId"
              style="margin-bottom:10px;"
              class="distribution"
            >
              <el-radio-group v-model.number="formData.distributionTemplateId">
                <el-radio
                  :label="item.id"
                  :key="'template' + index"
                  v-for="(item, index) in templateList"
                >{{ item.templateName }}</el-radio>
              </el-radio-group>
              <p style="color:darkgoldenrod;max-height:80px;overflow:auto;">
                <span
                  v-for=" (item,index) in currentTemplate.distributionTemplateDetailList"
                  :key="index"
                  class="address-info"
                >{{ item.addressCity }}</span>
              </p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" style="margin-bottom:10px;">
        <el-row>
          <!-- 编辑 -->
          <el-col :span="24">
            <sgu-prod-multi ref="prodList" :sgu="formData" :entity="formData" :baseData="formData"></sgu-prod-multi>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="margin-top:8px;">
            <el-col :span="5">
              <el-form-item label="销售前缀" prop="prefixName">
                <el-input v-model.trim="formData.prefixName" placeholder="请输入前缀"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" style="text-align:center;">
            <span>
              <el-button type="primary" @click="submit()">保存</el-button>
            </span>
            <el-button style="margin-left:10px;" @click="$back">返回</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </section>
</template>

<script>
import sguPlanProd from "@/components/sguplanmanager/sgu-plan-prod";
import sguPlanBaseMixin from "./sgu-plan-base.js";
import sguProdMulti from "@/components/sguplanmanager/sgu-prod-multi";

export default {
  name: "SguPlanBase",
  mixins: [sguPlanBaseMixin],
  components: { sguPlanProd, sguProdMulti },
  created() {
    this.initData();
    this.getTemplateList();
  },
  //方法列表
  methods: {
    /**
     * 初始化数据
     */
    initData() {
      var self = this;
      this.$httpUtil.post({
        url: "/sguPlanBaseInfo/preEdit.json",
        data: {
          id: self.$route.params.id
        },
        contentType: "form", //json,form,multipart
        isShowLoading: false, //不显示遮罩
        succ: function(data) {
          self.formData = data.data;
          self.formData.supplyName = data.data.supplyInfo ===null?"":data.data.supplyInfo.supply_name;
          //等待第一次双向绑定完成执行子组件渲染
          self.$nextTick(() => {
            self.$refs.prodList.initData(self.formData);
          });
        }
      });
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
</style>
<style>
.distribution .el-form-item__content {
  line-height: 20px !important;
}
</style>
