<template>
  <section class="content-section img-detail">
    <el-row>
      <h4>价格设置</h4>
      <el-col :span="18" v-if="formData.prodInfo.is_sub_account == 1">
        <sxh-view-container :item-span="12" :label-width="120" style="padding:10px;">
          <sxh-view-item
            title="销售单价"
          >{{formData.prodInfo.sub_account_prod_price}}元/{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item
            title="平台服务费"
          >{{formData.prodInfo.platform_service_fee}}元/{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item
            title="分账比例"
          >{{formData.prodInfo.isAgent==0?formData.prodInfo.sub_account_proportion:formData.prodInfo.platformRatio}}%</sxh-view-item>
          <sxh-view-item title="起订量">{{formData.prodInfo.qdl}}{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item
            v-if="formData.prodInfo.creator_role == 2 || formData.prodInfo.creator_role == 3"
            title="允许订货"
          >
            <template slot="title">
              <span>允许订货</span>
              <sxh-popover tooltip="允许订货以后<br/>1、允许下采购订单；2、允许商品上架售卖；"></sxh-popover>
            </template>
            <el-switch
              v-model="formData.prodInfo.isOnSale"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="formData.prodInfo.isOnSale ? `允许` : `不允许`"
              disabled
            ></el-switch>
          </sxh-view-item>
          <sxh-view-item title="可余额支付" v-if="baseData.cityIsPayByBalance">
            <el-switch
              v-model="formData.prodInfo.isPayByBalance"
              :width="50"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :active-text="formData.prodInfo.isPayByBalance==1 ? `是` : `否`"
              disabled
            ></el-switch>
          </sxh-view-item>
        </sxh-view-container>
      </el-col>
      <el-col :span="18" v-else>
        <sxh-view-container :item-span="12" :label-width="120" style="padding:10px;">
          <sxh-view-item
            title="订货成本价"
          >{{formData.prodInfo.prod_price}}元/{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item title="起订量">{{formData.prodInfo.qdl}}{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item
            title="允许订货"
            v-if="formData.prodInfo.creator_role == 2 || formData.prodInfo.creator_role == 3"
          >
            <template slot="title">
              <span>允许订货</span>
              <sxh-popover tooltip="允许订货以后<br/>1、允许下采购订单；2、允许商品上架售卖；"></sxh-popover>
            </template>
            <el-switch
              v-model="formData.prodInfo.isOnSale"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="formData.prodInfo.isOnSale ? `允许` : `不允许`"
              disabled
            ></el-switch>
          </sxh-view-item>
          <sxh-view-item title="可余额支付" v-if="baseData.cityIsPayByBalance">
            <el-switch
              v-model="formData.prodInfo.isPayByBalance"
              :width="50"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :active-text="formData.prodInfo.isPayByBalance==1 ? `是` : `否`"
              disabled
            ></el-switch>
          </sxh-view-item>
        </sxh-view-container>
      </el-col>
      <el-col
        :span="24"
        v-show="!(formData.prodInfo.creator_role == 2 || formData.prodInfo.creator_role == 3)"
      >
        <prodPriceSetting
          ref="prodPrice"
          :entity="formData.prodInfo"
          :baseData="{checkedstatus:checkedstatus,disabled:true}"
        ></prodPriceSetting>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <h4>图片信息</h4>
      <el-col :span="24">
        <p>主图</p>
      </el-col>
      <el-col :span="24">
        <sxh-uploader ref="mainImg" :controlDisabled="true" :fileList="formData.main_pic_list"></sxh-uploader>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <p>详情图</p>
      </el-col>
      <el-col :span="24">
        <sxh-uploader ref="detailImg" :controlDisabled="true" :fileList="formData.detail_pic_list"></sxh-uploader>
      </el-col>
    </el-row>
    <el-row v-if="showReal && (baseData.isAudit || (formData.realPicList||[]).length>0)">
      <el-col :span="24">
        <p>商品实物图</p>
      </el-col>
      <el-col :span="24">
        <sxh-uploader ref="realImg" :controlDisabled="true" :fileList="formData.realPicList"></sxh-uploader>
      </el-col>
    </el-row>
    <el-row v-show="false">
      <el-col :span="24">
        <p>商品视频</p>
      </el-col>
      <el-col :span="24">
        <sxh-video-uploader
          ref="mainVideo"
          :controlDisabled="true"
          :fileList="formData.main_video_list"
        ></sxh-video-uploader>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import moment from "moment";
import prodPriceSetting from "./prod_price_setting";
import SxhViewItem from "../../../shixh/container/sxh-view-item";
import SxhViewContainer from "../../../shixh/container/sxh-view-container";
export default {
  components: {
    SxhViewContainer,
    SxhViewItem,
    prodPriceSetting
  },
  props: {
    baseData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    showReal: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      checkedstatus: [],
      statusData: [],
      formData: {
        prodInfo: { roleType: null },
        produserlevelprice: []
      }
    };
  },
  methods: {
    initData(data) {
      this.formData = {
        ...this.formData,
        ...data
      };
      this.formData.prodInfo.produserlevelprice = data.produserlevelprice;
      this.formData.prodInfo.roleType = this.formData.prodInfo.creator_role;
      this.$refs.mainImg.updatePicList(
        this.formData,
        this.formData.main_pic_list
      );
      this.$refs.detailImg.updatePicList(
        this.formData,
        this.formData.detail_pic_list
      );
      this.$refs.mainVideo.updateVideoList(
        this.formData,
        this.formData.main_video_list,
        true
      );
      if (this.$refs.realImg) {
        this.$refs.realImg.updatePicList(
          this.formData,
          this.formData.realPicList
        );
      }
      //this.getRoleData();
      //控件刷新
      this.$refs.prodPrice.initData(this.formData.prodInfo, "view");
    }
  }
};
</script>
