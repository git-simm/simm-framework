<template>
    <section  class="content-section layer-container">
        <el-form :model="formData" ref="formData" >
            <div style="text-align:center">
                <h2 class="text-theme">上传凭证</h2>
            </div>
            <el-row>
                <div  style="height:200px;">
                    <el-form-item>
                        <span style="color:red;">*</span>上传保证金凭证：
                        <sxh-uploader
                                ref="bailEvidenceImg"
                                :multiple="false"
                                :fileList="formData.item.bailEvidencePicList"
                                @change="list=>{
                      formData.item.bailEvidencePicList = list;
                    }"
                        ></sxh-uploader>
                    </el-form-item>
                </div>
            </el-row>
            <el-row>
                <div>
                <el-col :span="24">
                    <p class="upload-cj-txt" style="margin-left: 15px">
                        保证金凭证备注:
                    </p>
                    <el-input v-model.trim="formData.item.bailEvidenceRemarks"></el-input>
                </el-col>
                </div>
            </el-row>
            <el-row>
                <div class="layer-footer" style="text-align:center;">
                    <el-button type="primary" @click="submit()">提交</el-button>
                    <el-button @click="closeWin">取 消</el-button>
                </div>
            </el-row>
        </el-form>
    </section>
</template>

<script>
    export default {
        name: "SuplierUploadBail",
        data:function () {
            return{
                filter: {},
                callback: null,
                formData:{},
                rules:{
                    bailEvidencePicList: [
                        {
                            required: true,
                            validator: this.checkBailEvidence,
                            trigger: "change"
                        }
                    ],
                    bailEvidenceRemarks: [
                        {
                            required: false,
                            message: "请输入备注",
                            trigger: "change"
                        }
                    ],
                }
            }
        },
        created(){
            this.callback = this.$options.propsData.callback;
            this.filter = this.$options.propsData.filter;
            this.formData = {
                ...this.formData,
                ...this.filter
            };
            this.searchSupplyInfo(this.formData.item);
        },
        methods:{
            closeWin: function() {
                this.$layerUtil.closeWin(this);
            },
            checkBailEvidence(rule, value, callback) {
                let len = this.bailEvidencePicList.length;
                if (len != 0) {
                    callback();
                } else {
                    callback(new Error("请上传证件信息"));
                }
            },
            searchSupplyInfo(item){
                var self = this;
                this.$httpUtil.post({
                    url: "/supplyInfo/preEditorSupply.json",
                    data: { supply_id:item.id },
                    contentType: "form", //
                    succ: function(data) {
                        (data.data.certifications || []).forEach(ele => {
                         if(ele.certification_type==7){
                                self.formData.item.bailEvidencePicList.push({
                                    name:ele.id,
                                    url:ele.certification_img_url
                                })
                            }
                        });
                        self.$set(
                            self.formData.item,
                            "bailEvidenceRemarks",
                            data.data.supplyInfo.bail_evidence_remarks
                        );
                    }
                });
            },
            submit(){
                var self = this;
                let baseValid = this.$commonUtil.valid.baseValid;
                baseValid(
                    () => self.formData.item.bailEvidencePicList.length === 0,
                    "请上传保证金凭证"
                );
                if ((self.formData.item.bailEvidenceRemarks||[]).length > 60) {
                    this.$commonUtil.valid.throwEx(
                        "备注最多能输入60个字符，您已超出限制，请重新输入"
                    );
                }
                var picListValid = (list, msg) => {
                    if ((list || []).some(img => img.url && img.url.includes("blob"))) {
                        self.$commonUtil.valid.throwEx(msg + "还未上传完毕，请稍等或重试...");
                    }
                };
                picListValid(self.formData.item.bailEvidencePicList, "保证金凭证");
                self.formData.item.bailEvidencePic=(
                    self.formData.item.bailEvidencePicList || []
                ).map(a=>a.url);
                // 6：待财务审核

                self.formData.item.bizStatus=6;
                if(self.callback){
                    self.callback(self.formData.item);
                }
            }
        }
    }
</script>

<style scoped>

</style>