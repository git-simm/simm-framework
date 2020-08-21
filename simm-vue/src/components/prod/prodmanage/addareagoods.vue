<template>
  <section class="content-section product-add-edit" id="proadd">
    <div class="row">
      <addgoods-sku-choose ref="skuChoose" :search-param="formDate" @use="useSku"></addgoods-sku-choose>
      <div style="margin:0 40px" v-if="roleType===2 && isAudit">
        <el-steps :active="0" finish-status="success" v-if="formDate.is_sub_account===1">
          <el-step title="创建"></el-step>
          <el-step title="商品管理员审批"></el-step>
          <el-step title="供应商审批"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-steps :active="0" finish-status="success" v-if="formDate.is_sub_account===0">
          <el-step title="创建"></el-step>
          <el-step title="商品管理员审批"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <el-form
        :model="formDate"
        :rules="rules"
        ref="formDate"
        label-width="50px"
        class="demo-ruleForm"
      >
        <el-row>
          <h4>基本信息</h4>
          <el-col :span="8">
            <el-row>
              <el-col :span="18">
                <el-form-item label="SKU编码" prop="prod_number" label-width="100px">
                  <el-input v-model="formDate.prod_number" :disabled="skuFlag"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button
                  type="primary"
                  class="btn-default"
                  @click="$refs.skuChoose.showDrawer()"
                >查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="purchase_supply_id" label-width="100px">
              <el-select
                :disabled="formDate.prod_number.includes('ZZ')"
                v-model="formDate.purchase_supply_id"
                clearable
                filterable
                placeholder="请选择"
                @change="SupplyDataChange"
              >
                <el-option
                  v-for="(item, key) in (supplyData || []).filter(
                        a =>
                          (roleType == 3 && a.is_direct_purchasing == 1) ||
                          (roleType != 3 && a.is_direct_purchasing == 0)
                      )"
                  :key="key"
                  :label="item.supply_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="noMargin" v-if="formDate.prod_number>''">
            <el-row>
              <el-col :span="6">
                <el-form-item label="商品名称：" label-width="100px">
                  <span>{{formDate.prod_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="销售模式：" label-width="100px">
                  <span>
                    {{
                    $cacheUtil.getVal("settltType", formDate.merchant_model, "")
                    }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否分账：" label-width="100px">
                  <span>
                    {{
                    $cacheUtil.getVal(
                    "is_sub_account",
                    formDate.is_sub_account,
                    " "
                    )
                    }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商编码：" label-width="100px">
                  <!-- <span>{{formDate.supplyNumber}}</span> -->
                  <sxh-detail-view
                    title="供应商编码"
                    comp="supplyView"
                    v-if="formDate.purchase_supply_id"
                    :view-param="{
                      id: formDate.purchase_supply_id,
                      number: formDate.supplyNumber,
                      isLink: true,
                      label: formDate.supplyNumber
                    }"
                  ></sxh-detail-view>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="类目：" label-width="100px">
                  <span>{{`${formDate.category_name} / ${formDate.two_category_name} / ${formDate.three_category_name}`}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品属性：" label-width="100px">
                  <span>{{ $cacheUtil.getVal('storage_method',formDate.storage_method )}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单位：" label-width="100px">
                  <span>{{formDate.unit_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="保质期：" prop="purchase-number" label-width="100px">
                  <span>{{formDate.quaranteePeriodCode}}天</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规格：" prop="specification" label-width="100px">
                  <span>{{formDate.specification}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="售后时效" prop="afterTime" label-width="100px">
              <el-input placeholder="请输入商品售后时效" v-model.number="formDate.afterTime">
                <template slot="append">
                  <span style="font-size: 16px; color: red;">天</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label-width="20px">
              <span
                class="text-theme"
              >售后时效：顾客收货后，可发起售后的期限，默认时间由【总部商品中心】提供，修改时不得大于商品中心设置的售后时效，如有异议请联系【总部商品中心】</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="箱规" label-width="100px">
              <el-col :span="11">
                <el-col :span="2" align="center">1</el-col>
                <el-col :span="21">
                  <el-form-item prop="unit_box_name">
                    <el-select
                      v-model="formDate.unit_box_name"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, key) in unitBoxData"
                        :key="key"
                        :label="item.unitName"
                        :value="item.unitName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="2" align="center">=</el-col>
              <el-col :span="11">
                <el-col :span="20">
                  <el-form-item prop="unit_box_number">
                    <el-input placeholder="请输入" v-model.number="formDate.unit_box_number"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" align="center">{{formDate.unit_name}}</el-col>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="20px">
              <span class="text-theme">箱规：为仓库分拣时提供依据，请核实清楚后填写</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <h4>价格设置</h4>
          <el-col :span="16">
            <el-col :span="12">
              <el-form-item
                v-if="formDate.is_sub_account == 1"
                label="平台服务费"
                prop="platform_service_fee"
                label-width="100px"
                :disabled="formDate.isAgent==1"
              >
                <el-input
                  v-model="formDate.platform_service_fee"
                  type="number"
                  :step="0.01"
                  @change="recalculate()"
                  :disabled="formDate.isAgent==1"
                >
                  <template slot="append">
                    <span style="font-size: 16px; color: red;">元/{{ formDate.unit_name }}</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formDate.is_sub_account != 1">
              <el-form-item label="订货单价(成本价)" prop="prod_price" label-width="150px">
                <el-input v-model="formDate.prod_price">
                  <template slot="append">
                    <span style="font-size: 16px; color: red;">元/{{ formDate.unit_name }}</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="起订量" prop="qdl" label-width="100px">
                <el-input v-model.number="formDate.qdl">
                  <template slot="append">
                    <span style="font-size: 16px; color: red;">
                      {{
                      formDate.unit_name
                      }}
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formDate.is_sub_account == 1">
              <el-form-item label="销售单价" prop="sub_account_prod_price" label-width="100px">
                <el-input
                  v-model="formDate.sub_account_prod_price"
                  type="number"
                  :step="0.01"
                  @change="recalculate()"
                >
                  <template slot="append">
                    <span style="font-size: 16px; color: red;">元/{{ formDate.unit_name }}</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="roleType == 2 || roleType == 3">
              <el-form-item label-width="120px" label="是否可订货">
                <template>
                  <el-switch
                    v-model="formDate.isOnSale"
                    :width="50"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-text="formDate.isOnSale ? `允许` : `不允许`"
                  ></el-switch>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formDate.is_sub_account == 1">
              <el-form-item
                label="平台比例"
                prop="sub_account_proportion"
                label-width="100px"
                v-if="formDate.isAgent==0"
              >
                <el-input
                  v-model.number="formDate.sub_account_proportion"
                  type="number"
                  :step="0.01"
                  disabled
                >
                  <template slot="append">
                    <span style="font-size: 16px; color: red;">%</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formDate.is_sub_account == 1">
              <el-form-item
                label="平台比例"
                prop="sub_account_proportion"
                label-width="100px"
                v-if="formDate.isAgent==1"
              >
                <el-input
                  v-model.number="formDate.platformRatio"
                  type="number"
                  :step="0.01"
                  disabled
                >
                  <template slot="append">
                    <span style="font-size: 16px; color: red;">%</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="cityIsPayByBalance">
              <el-form-item label-width="120px" label="可余额支付">
                <template>
                  <el-switch
                    disabled
                    v-model="formDate.isPayByBalance"
                    :width="50"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="formDate.isPayByBalance==1 ? `是` : `否`"
                  ></el-switch>
                  <span class="text-theme" style="margin-left:20px;">（如需关闭，请联系负责人处理）</span>
                </template>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" v-if="formDate.isAgent==0">
            <p style="color: red;">平台比例 = 平台服务费/销售价*100%</p>
          </el-col>
          <div v-show="!(roleType == 2 || roleType == 3)">
            <prodPriceSetting ref="prodPrice" :entity="formDate" :baseData="{ checkedstatus }"></prodPriceSetting>
          </div>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <h4>
            商品主图
            <sxh-img-store
              v-if="(formDate.main_pic_list||[]).length < 10"
              :skuList="[formDate.prod_number]"
              :spuList="[formDate.spuNumber]"
              @change="mainChangeHandler"
            ></sxh-img-store>
          </h4>
          <div style="padding-left:20px;padding-right:20px;">
            <sxh-uploader ref="mainImg" :fileList="formDate.main_pic_list" @change="mainImgChange"></sxh-uploader>
            <p class="text-theme" style="margin-top:10px;">* 主图在小程序主页显示，长宽比 5:4</p>
          </div>
        </el-row>
        <el-row>
          <h4>
            商品详情图
            <sxh-img-store
              v-if="(formDate.detail_pic_list||[]).length < 10"
              :skuList="[formDate.prod_number]"
              :spuList="[formDate.spuNumber]"
              @change="detailChangeHandler"
            ></sxh-img-store>
          </h4>
          <div style="padding-left:20px;padding-right:20px;">
            <sxh-uploader
              ref="detailImg"
              :fileList="formDate.detail_pic_list"
              @change="detailImgChange"
            ></sxh-uploader>
          </div>
        </el-row>
        <el-row>
          <p style="color:dimgrey">备注:1.图片支持拖拽排序; 2.每张图片不超过2M; 3.最多上传10张照片;</p>
        </el-row>
        <el-row v-show="false">
          <h4>
            商品介绍视频
            <el-button
              v-if="(formDate.main_video_list || []).length > 0"
              @click="deleteVideo"
              icon="el-icon-delete"
              title="删除视频"
            >删除视频</el-button>
          </h4>
          <div style="padding-left:20px;padding-right:20px;">
            <sxh-video-uploader
              ref="mainVideo"
              :fileList="formDate.main_video_list"
              @change="mainVideoChange"
            ></sxh-video-uploader>
            <p class="text-theme">提示:商品视频仅限上传单个文件,宽高比4:5,时长不超过3分钟,文件大小不超过50M</p>
          </div>
        </el-row>

        <el-row style="margin-top:10px;">
          <p>
            <el-checkbox v-model="isBatchAdd" label="复制商品 继续创建" title="勾选后页面不关闭，可重复创建商品" />
            <span
              style="margin-left:10px;color:#999999"
            >勾选【复制商品】点击【保存】或【提交】按钮后,创建商品成功后界面不会关闭，可以继续创建下一个商品</span>
          </p>
          <p v-if="isBatchAdd">
            <el-checkbox v-model="isClearImg" label="清空图片" title="勾选后创建下个商品时，将清理掉页面上的图片" />
            <span style="margin-left:10px;color:#999999">勾选后，复制商品需要重新上传图片</span>
          </p>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate', 1)">保存</el-button>
            <el-button type="primary" @click="submitForm('formDate', 2)">提交</el-button>
            <el-button @click="resetForm('formDate')">重置</el-button>
            <a href="javascript:;" @click="$back" class="ml-10">
              <el-button>取消</el-button>
            </a>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </section>
</template>

<style lang="less">
@import url("add.less");
</style>

<script>
import prodPriceSetting from "./controls/prod_price_setting";
import addgoodsAddHandler from "./addgoods-add-handler";
import addgoodsBaseDataHandler from "./addgoods-basedata-handler";
import addgoodsCopyHandler from "./addgoods-copy-handler";
import addgoodsSkuChoose from "./controls/addgoods-sku-choose";
import requestMixin from "@/common/mixins/requestMixin";
import prodCommonHandler from "@/components/prod/prodmanage/prod-common-handler";
export default {
  name: "ProdAddArea",
  components: {
    prodPriceSetting,
    addgoodsSkuChoose
  },
  mixins: [
    addgoodsAddHandler,
    addgoodsBaseDataHandler,
    addgoodsCopyHandler,
    requestMixin,
    prodCommonHandler
  ],
  created: function() {
    var self = this;
    this.getUnitBoxData();
    if (this.roleType === 2) {
      self.getProdCityInfo(this.$store.state.userInfo.cityId, city => {});
    }
    if (this.$route.path.includes("/copy")) {
      //进入复制逻辑，准备数据
      this.getProInfo(this.$route.params.id, () => {
        //获取商品对应的三级类目售后时效
        self.getThreeCategoryAfterTime(self.$route.params.id, afterTime => {
          self.prodAfterTime = afterTime;
        });
        self.getSupplyDataHandler(self.formDate.prod_number);
        //控件刷新
        self.$refs.prodPrice.initData(self.formDate, "add");
      });
    }
  },
  mounted() {
    if (!this.$route.path.includes("/copy")) {
      this.$refs.prodPrice.initData(this.formDate, "add");
    }
  },
  methods: {
    /**
     * 删除视频
     */
    deleteVideo() {
      var self = this;
      self.formDate.main_video_list = [];
      self.$refs.mainVideo.updateVideoList(
        self.formDate,
        self.formDate.main_video_list
      );
    },
    /**
     * 获取sku
     */
    useSku(sku) {
      let prodNumber = sku.prodNumber;
      var self = this;
      this.paramsFlag = false;
      this.skuFlag = true;
      this.specFlag = true;
      if (this.formDate.prod_number) {
        //如果只是纯粹的切换sku,则需要清空图片
        this.clearImg();
      }
      this.$set(this.formDate, "spuId", sku.spuId);
      this.$set(this.formDate, "spuNumber", sku.spuNumber);
      this.formDate.specification = String(sku.specification);
      this.formDate.prod_number = prodNumber;
      this.formDate.prod_name = sku.productName;
      this.formDate.tax = sku.tax;
      this.formDate.category_name = sku.categoryName;
      this.formDate.two_category_name = sku.twoCategoryName;
      this.formDate.three_category_name = sku.threeCategoryName;
      this.formDate.storage_method = sku.storageMethod;
      this.formDate.quaranteePeriodCode = sku.quaranteePeriodCode;
      this.formDate.unit_name = sku.unit;
      this.formDate.prodType = sku.prodType;
      this.formDate.afterTime = sku.afterTime;
      this.prodAfterTime = sku.afterTime;
      this.getSupplyDataHandler(prodNumber);
      //获取相关商品信息
      this.getProdImages(prodNumber);
    },
    /**
     * 添加主图
     */
    mainChangeHandler(list) {
      list = Array.from(list);
      if ((list || []).length == 0) {
        return;
      }
      var self = this;
      for (var i = 0; i < list.length; i++) {
        var url = list[i];
        if (!self.formDate.main_pic_list.some(a => a.url == url)) {
          self.formDate.main_pic_list.push({
            url: url
          });
        }
        //超过10张图片不允许继续添加
        if (self.formDate.main_pic_list.length >= 10) {
          this.$message({
            message: "主图已经达到10张上限",
            type: "warning"
          });
          break;
        }
      }
      self.$refs.mainImg.updatePicList(
        self.formDate,
        self.formDate.main_pic_list
      );
      // self.$refs.mainVideo.
    },
    /**
     * 添加详情图
     */
    detailChangeHandler(list) {
      list = Array.from(list);
      if ((list || []).length == 0) {
        return;
      }
      var self = this;
      for (var i = 0; i < list.length; i++) {
        var url = list[i];
        if (!self.formDate.detail_pic_list.some(a => a.url == url)) {
          self.formDate.detail_pic_list.push({
            url: url
          });
        }
        //超过10张图片不允许继续添加
        if (self.formDate.detail_pic_list.length >= 10) {
          this.$message({
            message: "详情图已经达到10张上限",
            type: "warning"
          });
          break;
        }
      }
      self.$refs.detailImg.updatePicList(
        self.formDate,
        self.formDate.detail_pic_list
      );
    },
    mainImgChange(list) {
      this.formDate.main_pic_list = list;
    },
    mainVideoChange(list) {
      this.formDate.main_video_list = list;
    },
    detailImgChange(list) {
      this.formDate.detail_pic_list = list;
    },
    /**
     * 获取供应商数据处理
     */
    getSupplyDataHandler(prodNumber) {
      var self = this;
      this.getSupplyData(() => {
        if (prodNumber.includes("ZZ")) {
          //组装码，直接管理关联加工供应商
          self.jgSupply.merchant_model = self.jgSupply.merchantModel;
          self.jgSupply.is_sub_account = self.jgSupply.isSubAccount;
          self.supplyData.push(self.jgSupply);
          self.formDate.purchase_supply_id = self.jgSupply.id;
          self.formDate.supplyNumber = self.jgSupply.supply_number;
          self.SupplyDataChange();
        } else if (self.formDate.purchase_supply_id) {
          //已有的供应商信息在数据源中不存在
          var supplyData = self.supplyData.find(
            item => item.id == self.formDate.purchase_supply_id
          );
          if (!supplyData) {
            self.formDate.purchase_supply_id = null;
            self.formDate.supplyNumber = "";
            self.formDate.merchant_model = "";
            self.formDate.is_sub_account = "";
            self.formDate.is_direct_purchasing = "";
            self.formDate.isAgent = "";
            self.formDate.platformRatio = "";
            self.formDate.agent_city = "";
          }
        }
      });
    },
    SupplyDataChange: function() {
      this.supplyNumberChange();
    },
    supplyNumberChange: function(key_word) {
      var self = this;
      var supplyData = self.supplyData.find(
        item => item.id == self.formDate.purchase_supply_id
      );
      if (supplyData) {
        self.formDate.supplyNumber = supplyData.supply_number;
        self.formDate.merchant_model = supplyData.merchant_model;
        self.formDate.is_sub_account = supplyData.is_sub_account;
        self.formDate.is_direct_purchasing = supplyData.is_direct_purchasing;
        self.formDate.isAgent = supplyData.is_agent;
        self.formDate.platformRatio = supplyData.platform_ratio;
        self.formDate.agent_city = supplyData.agent_city;
      }
    },
    recalculate: function() {
      let self = this;
      if (self.formDate.is_sub_account == 1) {
        if (self.formDate.isAgent == 0) {
          self.formDate.prod_price =
            self.formDate.sub_account_prod_price -
            self.formDate.platform_service_fee;
          let tempVal =
            (self.formDate.platform_service_fee /
              self.formDate.sub_account_prod_price) *
            100;
          let realVal = parseFloat(tempVal).toFixed(2);
          self.formDate.sub_account_proportion = parseFloat(realVal);
        } else {
          self.formDate.platform_service_fee = parseFloat(
            self.formDate.sub_account_prod_price *
              (self.formDate.platformRatio / 100)
          ).toFixed(2);
          self.formDate.prod_price =
            self.formDate.sub_account_prod_price -
            self.formDate.platform_service_fee;
        }
      }
    },
    /**
     * 获取箱规单位
     */
    getUnitBoxData() {
      var self = this;
      this.$httpUtil.post({
        url: "/base/prod/unit/list.json",
        contentType: "form",
        loading: false,
        data: {
          parent_id: 0,
          level: 123,
          page: 1,
          pagesize: 100000
        },
        succ: function(data) {
          self.unitBoxData = data.data;
          self.formDate.unit_box_name = "箱";
        }
      });
    }
  }
};
</script>
<style lang="less">
.noMargin {
  background: ghostwhite;
  margin-bottom: 5px;
  .el-form-item {
    margin-bottom: 0px;
    .el-form-item__label {
      color: darkgoldenrod;
    }
    .el-form-item__content {
      span {
        display: table-cell;
      }
    }
  }
}
</style>