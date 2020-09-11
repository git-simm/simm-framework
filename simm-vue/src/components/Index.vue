<template>
<section class="content-section" style="position:relative;">
    <div>我的测试程序</div>
    <sxh-cropper
            :option="{fixedNumber:[807, 510],winName:'身份证识别',okText:'识 别',cancelText:'退 出'
            ,imgurl:'https://branchsxhimg.shixiangyiwei.com/upload/adv/2020/2/27/d9630329-dbda-43af-8cd8-764f46af0f01.png'
            ,demo:'https://branchsxhimg.shixiangyiwei.com/upload/adv/2020/2/27/d9630329-dbda-43af-8cd8-764f46af0f01.png'}"
            :save="saveIdCard"
    >
        <el-button type="primary">身份证识别</el-button>
    </sxh-cropper>
    <sxh-cropper
            :option="{fixedList:[{ name:`横版`, fixedNumber:[1640, 1040],type:1 },{ name:`竖版`, fixedNumber:[1566, 2256],type:2 }]
            ,winName:'营业执照识别',okText:'识 别',cancelText:'退 出'}"
            :save="saveBizCard"
    >
        <el-button type="primary">营业执照识别</el-button>
    </sxh-cropper>
</section>
</template>

<script>
// import summaryHandler from "./summary-handler";
export default {
    name: "Index",
    methods: {
        saveBizCard({ files, param }, callback) {
            var type = param.type //1.横屏; 2.竖屏;
            this.$httpUtil.post({
                url: `/biz/upload?type=${type}`,
                data: {
                    files: files
                },
                contentType: "multipart", //
                succ: function (res) {
                    if (callback) {
                        var data = {
                            show: `<p><span>统一社会信用代码：</span><span>${res.data.creditCode}</span></p>
                            <p><span>名称：</span><span>${res.data.name}</span></p>
                            <p><span>类型：</span><span>${res.data.bizType}</span></p>
                            <p><span>法定代表人：</span><span>${res.data.juridical}</span></p>
                            <p><span>注册资本：</span><span>${res.data.capital}</span></p>
                            <p><span>成立日期：</span><span>${res.data.buildOn}</span></p>
                            <p><span>营业期限：</span><span>${res.data.bizLimit}</span></p>
                            <p><span>住所：</span><span>${res.data.address}</span></p>
                            <p><span>经营范围：</span><span>${res.data.bizScope}</span></p>`
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
        saveIdCard({ files, param }, callback) {
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
