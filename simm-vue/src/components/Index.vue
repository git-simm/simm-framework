<template>
<section class="content-section" style="position:relative;">
    <div>我的测试程序</div>
    <sxh-cropper :option="{fixedNumber:[673, 425],winName:'身份证识别'}" :save="saveIdCard">
        <el-button type="primary">身份证识别</el-button>
    </sxh-cropper>
    <sxh-cropper :option="{fixedNumber:[1640, 1040],winName:'营业执照识别'}" :save="saveBizCard">
        <el-button type="primary">营业执照识别</el-button>
    </sxh-cropper>
</section>
</template>

<script>
// import summaryHandler from "./summary-handler";
export default {
    name: "Index",
    methods: {
        saveBizCard(files, callback) {
            this.$httpUtil.post({
                url: "/biz/upload",
                data: {
                    files: files
                },
                contentType: "multipart", //
                succ: function (res) {
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
        },
        /**
         * 保证身份证信息
         */
        saveIdCard(files, callback) {
            this.$httpUtil.post({
                url: "/ocr/upload",
                data: {
                    files: files
                },
                contentType: "multipart", //
                succ: function (res) {
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
