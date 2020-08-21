<template>
  <section class="content-section product-add-edit" id="proadd">
    <prod-steps v-if="isAudit" :prod-info="prodInfo"></prod-steps>
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
          <el-form-item label="SKU编码" prop="prod_number" label-width="100px">
            <span>{{formDate.prod_number}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="供应商"
            prop="purchase_supply_id"
            label-width="100px"
            v-if="formDate.isJgSupply == 1"
          >
            <span>{{ formDate.supplyName }}</span>
          </el-form-item>
          <el-form-item label="供应商" prop="purchase_supply_id" label-width="100px" v-else>
            <el-select
              :disabled="
                    $route.params.auditFlag == 1 ||
                      $route.params.auditFlag == 3 ||
                      formDate.prod_number.includes('ZZ')
                  "
              v-model="formDate.purchase_supply_id"
              clearable
              filterable
              placeholder="请选择"
              @change="SupplyDataChange"
            >
              <el-option
                v-for="(item, key) in (supplyData || []).filter(
                      a =>
                        (formDate.create_role == 3 &&
                          a.is_direct_purchasing == 1) ||
                        (formDate.create_role != 3 &&
                          a.is_direct_purchasing == 0)
                    )"
                :key="key"
                :label="item.supply_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="noMargin">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品名称：" prop="prod_name" label-width="100px">
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
              label="平台服务费"
              v-if="formDate.is_sub_account == 1"
              prop="platform_service_fee"
              label-width="100px"
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
          <el-col :span="12">
            <el-form-item
              label="订货单价"
              v-if="formDate.is_sub_account != 1"
              prop="prod_price"
              label-width="100px"
            >
              <el-input
                :disabled="!priceCanEdit || $route.params.auditFlag == 3"
                v-model="formDate.prod_price"
                type="number"
              >
                <template slot="append">
                  <span style="font-size: 16px; color: red;">元/{{ formDate.unit_name }}</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起订量" prop="qdl" label-width="100px">
              <el-input
                :disabled="
                    formDate.prodType == 3 ||
                      $route.params.auditFlag == 3 ||
                      !priceCanEdit
                  "
                v-model.number="formDate.qdl"
                type="number"
              >
                <template slot="append">
                  <span style="font-size: 16px; color: red;">{{ formDate.unit_name }}</span>
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
                :disabled="$route.params.auditFlag == 3 || !priceCanEdit"
                @change="recalculate()"
              >
                <template slot="append">
                  <span style="font-size: 16px; color: red;">元/{{ formDate.unit_name }}</span>
                </template>
              </el-input>
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
              <el-input v-model.number="formDate.platformRatio" type="number" :step="0.01" disabled>
                <template slot="append">
                  <span style="font-size: 16px; color: red;">%</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-show="formDate.create_role == 2 || formDate.create_role == 3"
              label-width="120px"
              label="允许订货"
            >
              <template>
                <el-switch
                  :width="50"
                  v-model="formDate.isOnSale"
                  :disabled="$route.params.auditFlag == 3"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-text="formDate.isOnSale ? `允许` : `不允许`"
                  @change="onSaleChange"
                ></el-switch>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-show="formDate.create_role > 1 && $route.params.auditFlag == 3"
              label-width="140px"
              label="绑定供应商"
            >
              <template>
                <el-switch
                  :width="50"
                  v-model="formDate.valid"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-text="formDate.valid ? `绑定` : `解绑`"
                ></el-switch>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="cityIsPayByBalance">
            <el-form-item label-width="120px" label="可余额支付">
              <template>
                <el-switch
                  v-model="formDate.isPayByBalance"
                  disabled
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
        <el-col
          :span="24"
          style="color:red;"
          v-if="formDate.is_sub_account == 1 && formDate.isAgent==0"
        >
          <p>平台比例 = 平台服务费/销售价*100%</p>
          <p v-if="formDate.create_role == 2 || formDate.create_role == 3">销售单价、平台比例显示的是供应商审核通过的最新价格</p>
        </el-col>
        <div v-show="!(formDate.create_role == 2 || formDate.create_role == 3)">
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
        <el-col :span="24" style="padding-left:20px;padding-right:20px;">
          <sxh-uploader ref="mainImg" :fileList="formDate.main_pic_list" @change="mainImgChange"></sxh-uploader>
          <p class="text-theme" style="margin-top:10px;">* 主图在小程序主页显示，长宽比 5:4</p>
        </el-col>
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
        <el-col :span="24" style="padding-left:20px;padding-right:20px;">
          <sxh-uploader
            ref="detailImg"
            :fileList="formDate.detail_pic_list"
            @change="detailImgChange"
          ></sxh-uploader>
        </el-col>
      </el-row>
      <el-row v-if="(formDate.realPicList||[]).length>0 || isAudit">
        <el-col :span="24">
          <h4>
            商品实物图（不少于2张）
            <sxh-img-store
              v-if="canUpdateRealImg"
              :skuList="[formDate.prod_number]"
              :spuList="[formDate.spuNumber]"
              @change="realChangeHandler"
            ></sxh-img-store>
          </h4>
        </el-col>
        <el-col :span="24" style="padding-left:20px;padding-right:20px;padding-bottom:10px;">
          <sxh-uploader
            ref="realImg"
            :limit="-1"
            :fileList="formDate.realPicList"
            :controlDisabled="!canUpdateRealImg"
            @change="realImgChange"
          ></sxh-uploader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p style="color:dimgrey">备注:1.图片支持拖拽排序; 2.每张图片不超过2M; 3.最多上传10张照片;</p>
        </el-col>
      </el-row>
      <!-- TODO 视频组件验证 -->
      <div class="col-sm-12" v-show="false">
        <h4>
          商品介绍视频
          <el-button
            v-if="(formDate.main_video_list || []).length > 0"
            @click="deleteVideo"
            icon="el-icon-delete"
            circle
            title="删除视频"
          >删除视频</el-button>
        </h4>
        <div style="padding-left:20px;padding-right:20px;">
          <sxh-video-uploader
            ref="mainVideo"
            :fileList="formDate.main_video_list"
            @change="mainVideoChange"
          ></sxh-video-uploader>
        </div>
        <div>
          <p class="text-theme">提示:商品视频仅限上传单个文件,宽高比4:5,时长不超过3分钟,文件大小不超过50M</p>
        </div>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate', 1)">保存</el-button>
            <el-button
              v-if="$route.params.auditFlag == 0"
              type="primary"
              @click="submitForm('formDate', 2)"
            >提交</el-button>
            <router-link to="/prod/prodmanage/list" class="ml-10">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import prodPriceSetting from "./prod_price_setting";
import baseinfoMixin from "./prod-baseinfo-mixin";
import baseMixin from "@/common/mixins/baseMixin";
import SxhVideoUploader from "../../../shixh/video/sxh-video-uploader";
import prodSteps from "@/components/prod/prodmanage/controls/prod-steps";
import requestMixin from "@/common/mixins/requestMixin";
import prodCommonHandler from "@/components/prod/prodmanage/prod-common-handler";
export default {
  name: "prodBaseInfo",
  mixins: [baseMixin, baseinfoMixin, requestMixin, prodCommonHandler],
  components: {
    SxhVideoUploader,
    prodPriceSetting,
    prodSteps
  },
  watch: {
    "formDate.valid": {
      handler: function(val, oldVal) {
        if (!val && this.$store.state.userInfo.roleType == 2) {
          this.formDate.isOnSale = val;
        }
      }
    }
  },
  created: function() {
    this.roleType = this.$store.state.userInfo.roleType;
  },
  mounted() {
    this.getProInfo();
    this.getThreeCategoryAfterTime();
    this.getUnitBoxData();
  },
  computed: {
    year: function() {
      var y = new Date();
      return y.getFullYear();
    },
    isZb: function() {
      //是否为总部人员
      return this.$store.state.userInfo.roleType == 0;
    },
    canUpdateRealImg: function() {
      return (
        this.formDate.processStatus === 3 &&
        this.$permission.hasPermission("prod_update_realimg")
      );
    }
  },
  methods: {
    // 触发校验
    onSaleChange(val) {
      var self = this;
      var cityEdit =
        self.formDate.create_role > 1 && self.$route.params.auditFlag == 1;
      if (cityEdit && val) {
        self.formDate.isOnSale = val;
        self.formDate.valid = val;
      }
    },
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
      //this.wrapSguImgs();
    },
    detailImgChange(list) {
      this.formDate.detail_pic_list = list;
      //this.wrapSguImgs();
    },
    realImgChange(list) {
      this.formDate.realPicList = list;
    },
    /**
     * 添加主图
     */
    realChangeHandler(list) {
      list = Array.from(list);
      if ((list || []).length == 0) {
        return;
      }
      var self = this;
      for (var i = 0; i < list.length; i++) {
        var url = list[i];
        if (!self.formDate.realPicList.some(a => a.url == url)) {
          self.formDate.realPicList.push({
            url: url
          });
        }
      }
      self.$refs.realImg.updatePicList(
        self.formDate,
        self.formDate.realPicList
      );
    },
    mainVideoChange(list) {
      this.formDate.main_video_list = list;
    },
    calcPriceCanEdit() {
      //未审核通过 或 审核通过总部人员
      this.priceCanEdit =
        this.formDate.processStatus == 0 ||
        this.formDate.processStatus == -2 ||
        // (this.formDate.processStatus == 3 && this.isZb)||
        this.roleType == this.formDate.create_role ||
        this.$store.state.userInfo.id == this.formDate.admin_user_id;
    },
    checkPrice(rule, value, callback) {
      if (!Number(value)) {
        return callback(new Error("请正确填写订货价"));
      } else {
        callback();
      }
    },
    checkNum(rule, value, callback) {
      if (!Number(value) || Number(value) < 1) {
        return callback(new Error("请正确填写起订量"));
      } else {
        callback();
      }
    },
    checkStatus(item, index) {
      this.$refs.formDate.validateField("tableData." + index + ".prod_price");
      if (this.supply_type == 3) {
        this.$refs.formDate.validateField("tableData." + index + ".cost_price");
      }
      this.$refs.formDate.validateField("tableData." + index + ".min_amount");
    },
    SupplyDataChange: function() {
      if (this.formDate.purchase_supply_id) {
        /*供应商选中时才请求采购商品列表*/
        this.supplyNumberChange();
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

    supplyNumberChange: function() {
      /*采购商品远程搜索*/
      var self = this;
      var supply = self.supplyData.find(
        item => item.id == self.formDate.purchase_supply_id
      );
      if (supply) {
        self.formDate.merchant_model = supply.merchant_model;
        self.formDate.is_sub_account = supply.is_sub_account;
        self.formDate.isAgent = supply.is_agent;
        self.formDate.platformRatio = supply.platform_ratio;
        /*  self.formDate.sub_account_prod_price="";
                self.formDate.platform_service_fee="";*/
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
        }
      });
    }
  }
};
</script>
