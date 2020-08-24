<template>
  <section class="content-section" style="position:relative;">
    <div>我的测试程序</div>
    <sxh-cropper :option="{fixedNumber:[673, 425]}" :save="saveIdCard">
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
    saveIdCard(files, callback) {
      this.$httpUtil.post({
        url: "/ocr/upload",
        data: { files: files },
        contentType: "multipart", //
        succ: function(res) {
          if (callback) {
            var data = {
              show: `<p><span>姓名：</span><span>${res.data.name}</span></p>
              <p><span>性别：</span><span>${res.data.sex}</span></p>
              <p><span>民族：</span><span>${res.data.nation}</span></p>
              <p><span>地址：</span><span>${res.data.address}</span></p>
              <p><span>身份证号：</span><span>${res.data.idNumber}</span></p>`
            };
            callback(data);
          }
          console.log(res);
        }
      });
    }
  }
};
</script>
<style scoped>
</style>