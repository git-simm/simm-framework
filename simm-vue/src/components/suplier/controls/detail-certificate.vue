<template>
  <section class="content-section suplier-img-detail">
    <el-row>
      <el-col :span="24">
        <h5>证件信息</h5>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <p>营业执照</p>
      </el-col>
    </el-row>
    <div v-viewer class="images">
      <template v-for="image in images">
        <img
          :src="image.certification_img_url"
          class="image"
          :key="image.id"
          v-if="image.certification_type == 3"
        />
      </template>
    </div>
    <el-row>
      <el-col :span="24">
        <p>开户许可证</p>
      </el-col>
    </el-row>
    <div v-viewer class="images">
      <template v-for="image in images">
        <img
          :src="image.certification_img_url"
          class="image"
          :key="image.id"
          v-if="image.certification_type == 5"
        />
      </template>
    </div>
    <el-row>
      <el-col :span="24">
        <p>法人身份证</p>
      </el-col>
    </el-row>
    <div v-viewer class="images">
      <template v-for="image in images">
        <img
          :src="image.certification_img_url"
          class="image"
          :key="image.id"
          v-if="image.certification_type == 4"
        />
      </template>
    </div>
    <el-row>
      <el-col :span="24">
        <p>授权代理人（提款人）身份证照片</p>
      </el-col>
    </el-row>
    <div v-viewer class="images">
      <template v-for="image in images">
        <img
                :src="image.certification_img_url"
                class="image"
                :key="image.id"
                v-if="image.certification_type == 6"
        />
      </template>
    </div>
    <el-row>
      <el-col :span="24">
        <p>其他证照：食品经营许可证、免税证明、注册商标证书、其他经营许可证</p>
      </el-col>
    </el-row>

    <div v-viewer class="images">
      <template v-for="image in images">
        <img
          :src="image.certification_img_url"
          class="image"
          :key="image.id"
          v-if="image.certification_type == 2"
        />
      </template>
    </div>
    <el-row>
      <el-col :span="24">
        <p style="margin: 20px 0">合同信息</p>
      </el-col>
    </el-row>
    <div v-viewer class="images">
      <template v-for="image in images">
        <img
          :src="image.certification_img_url"
          class="image"
          :key="image.id"
          v-if="image.certification_type == 1"
        />
      </template>
    </div>
    <el-row>
      <el-col :span="24">
        <p style="margin: 20px 0">保证金凭证</p>
      </el-col>
      <el-col>
        备注：{{infoData.bail_evidence_remarks}}
      </el-col>
    </el-row>
    <div v-viewer class="images">
      <template v-for="image in images">
        <img
                :src="image.certification_img_url"
                class="image"
                :key="image.id"
                v-if="image.certification_type == 7"
        />
      </template>
    </div>
  </section>
</template>

<script>
import moment from "moment";
export default {
  data: function() {
    return {
      tableData: [],
      infoData: {}, // 基本信息
      soOptLogList: [], // 操作日志
      images: [], // 证件信息
      categoryList: [], // 基础类目
      supplySiteData: [] // 全部服务区域
    };
  },
  methods: {
    initData(data) {
      this.tableData = data.tableData;
      this.infoData = data.infoData;
      this.soOptLogList = data.soOptLogList;
      this.images = data.images;
      this.categoryList = data.categoryList;
      this.supplySiteData = data.supplySiteData;
    }
  }
};
</script>
<style>
.suplier-img-detail .images .image {
  height: 200px;
  cursor: pointer;
  margin: 5px;
  display: inline-block;
}
</style>