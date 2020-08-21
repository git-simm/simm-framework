<template>
  <section class="content-section product-view">
    <view-base-info ref="detailBase" :base-data="baseData"></view-base-info>
    <view-img ref="imgList" :base-data="baseData" :show-real="false"></view-img>
    <el-divider></el-divider>
    <h4>商品管理员审核</h4>
    <el-row>
      <el-col :span="24">
        <p>
          <i class="text-theme" style="padding:5px;">*</i>商品实物图（不少于2张）
          <sxh-img-store
            :skuList="[formData.prod_number]"
            :spuList="[formData.spuNumber]"
            @change="realChangeHandler"
          ></sxh-img-store>
        </p>
      </el-col>
      <el-col :span="24" style="padding-left:20px;padding-right:20px;padding-bottom:10px;">
        <sxh-uploader
          ref="realImg"
          :limit="-1"
          :fileList="formData.realPicList"
          @change="realImgChange"
        ></sxh-uploader>
      </el-col>
      <el-col :span="24">
        <span>审批意见：</span>
        <el-input v-model="auditRemark" placeholder="请输入审批意见"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <el-button type="primary" icon="el-icon-check" @click="approve(1)">审批通过</el-button>
      <el-button type="primary" icon="el-icon-close" @click="approve(2)">审批不通过</el-button>
      <a href="javascript:;" @click="$back" class="ml-10">
        <el-button>取消</el-button>
      </a>
    </el-row>
  </section>
</template>

<script>
import viewHandler from "@/components/prod/prodmanage/view-handler";
export default {
  name: "auditProd",
  mixins: [viewHandler],
  data() {
    return {
      auditRemark: ""
    };
  },
  methods: {
    realImgChange(list) {
      this.formData.realPicList = list;
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
        if (!self.formData.realPicList.some(a => a.url == url)) {
          self.formData.realPicList.push({
            url: url
          });
        }
      }
      self.$refs.realImg.updatePicList(
        self.formData.prodInfo,
        self.formData.realPicList
      );
    },
    getImgs(type) {
      var self = this;
      let realPic = [];
      for (var d of self.formData.realPicList) {
        if (d.url && d.url.includes("blob")) {
          self.$commonUtil.valid.throwEx("商品实物图还未上传完毕，请稍等...");
        }
        realPic.push(d.url);
      }
      if (type === 1 && realPic.length < 2) {
        self.$commonUtil.valid.throwEx("商品实物图不能少于2张");
      }
      return realPic;
    },
    /**
     * 审批方法
     */
    approve(type) {
      var self = this;
      var request = {};
      request.id = self.$route.params.auditId;
      request.auditRemark = self.auditRemark;
      request.realPic = this.getImgs(type).toString();
      var url = "";
      if (1 == type) {
        url = "/prodInfo/approveSuccess.json";
      }
      if (2 == type) {
        url = "/prodInfo/approveFailBack.json";
      }
      if (3 == type) {
        url = "/prodInfo/approveFail.json";
      }
      this.$httpUtil.post({
        url: url,
        data: request,
        contentType: "form", //json,form,multipart
        succ: function(data) {
          self.$message({
            message: "操作成功!",
            type: "success"
          });
          setTimeout(function() {
            self.$back();
          }, 1500);
        }
      });
    }
  }
};
</script>
