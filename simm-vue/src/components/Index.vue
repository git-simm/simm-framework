<template>
  <section class="content-section" style="position:relative;">
    <div>我的测试程序</div>
    <sxh-cropper :save="saveIdCard">
      <el-button type="primary">身份证上传</el-button>
    </sxh-cropper>
  </section>
</template>
<script>
// import summaryHandler from "./summary-handler";
export default {
  name: "Index",
  methods: {
    /**
     * 保证身份证信息
     */
    saveIdCard(files) {
      this.$httpUtil.post({
        url: "/ocr/upload.json",
        data: { files: files },
        contentType: "multipart", //
        succ: function(res) {
          console.log(res);
        }
      });
    }
  }
};
</script>
<style scoped>
</style>