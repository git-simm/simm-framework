<template>
    <section class="content-section contract-edit">
        <div :style="{width:`100%`,height:`calc(100% - 50px)`,overflow:`auto`,padding:`5px`}">
            <el-form
                    :model="formData"
                    :rules="rules"
                    ref="contractFormData"
                    label-width="140px"
                    class="contract-ruleForm"
            >
                <el-row>
                    <el-col :span="24">
                        <el-form-item
                                label="合同有效期"
                                :class="formData.isSubAccount == 1 ? 'is-required' : ''"
                                prop="contractValidityBegin"
                        >
                            <sxh-date
                                    v-model="contractTimeArr"
                                    controlType="daterange"
                                    @change="arr => {
                  formData.contractValidityBegin = arr[0];
                  formData.contractValidityEnd = arr[1];
                }
              "
                            ></sxh-date>
                        </el-form-item>
                        <el-form-item label="供应商账期" prop="settleDay">
                            <el-input v-model.number="formData.settleDay">
                                <template slot="append">天</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item v-if="supplyInfo.deposit_price === 0" label="保证金" prop="depositPrice">
                            <el-input v-model.number="formData.depositPrice">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 上传新合同 -->
                    <el-col :span="24" class="uploader-cj-size">
                        <el-form-item label="上传新合同" prop="supplyContractImgList">
                            <sxh-uploader
                                    ref="contractImgs"
                                    :limit="50"
                                    :maxSize="5"
                                    :fileList="formData.supplyContractImgList"
                                    @change="list=>{formData.supplyContractImgList = list}"
                            >
                            </sxh-uploader>
                        </el-form-item>
                        <el-form-item label="合同续签说明" prop="description">
                            <el-input type="textarea" v-model.trim="formData.description"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </div>
        <div class="layer-footer" style="height:39px;text-align:left;">
            <el-row>
                <el-col :span="24" style="text-align:center;">
                    <el-button  type="primary" @click="submit()">提交</el-button>
                    <el-button  type="primary" @click="closeWin()">关闭</el-button>
                </el-col>
            </el-row>
        </div>

    </section>
</template>

<script>
    import moment from "moment";
    import SxhInputNumber from "../../shixh/form/sxh-input-number";
    export default {
        name: "contract-editor",
        components: {SxhInputNumber},
        props:{
            supplyInfo:Object,
            callback:Function
        },
        data(){
            return {
                contractTimeArr:[],
                formData:{
                    contractValidityBegin:null,
                    contractValidityEnd:null,
                    settleDay:null,
                    depositPrice:null,
                    supplyContractImgList:[],
                    description:null,
                    supplyId:null,
                },
                rules:{
                    contractValidityBegin: [
                        {
                            required: true,
                            message: "请输入合同有效期",
                            trigger: "change"
                        }
                    ],
                    settleDay: [
                        {
                            required: true,
                            validator: this.$commonUtil.formValid.checkInt,
                            message: "账期必须为整数",
                            trigger: "blur"
                        }
                    ],
                    supplyContractImgList: [
                        {
                            required: true,
                            validator: this.checkContractImgs,
                            trigger: "change"
                        }
                    ],
                    description: [
                        {
                            max: 500,
                            message: "说明字数不得超过500个汉字",
                            trigger: "change"
                        }
                    ]
                }
            }
        },
        created() {
            this.formData.supplyId = this.supplyInfo.id;
        },
        mounted(){
            this.wrapEditData();
        },
        methods:{
            /**
             * 关闭当前窗口
             */
            closeWin: function() {
                this.$layerUtil.closeWin(this);
            },
            /**
             * 提交
             */
            submit(){
                var self = this;
                self.submitValid();

                self
                    .$confirm("确认提交该供应商新的合同信息?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        this.$httpUtil.post({
                            url: "/supplyContract/save.json",
                            contentType: "json",
                            data: self.formData,
                            succ: function () {
                                self.closeWin();
                                if(self.callback){
                                    self.callback();
                                }
                            }
                        });
                    }).catch()
            },
            /**
             * 必填校验
             */
            submitValid(){
                var self = this;
                let baseValid = this.$commonUtil.formValid.baseValid;
                let isInt = this.$commonUtil.formValid.isInt;
                baseValid(() => (self.contractTimeArr || []).length < 2, "请选择合同有效期!");
                baseValid(()=>(moment(self.formData.contractValidityEnd).format("YYYY-MM-DD") <=
                    moment(new Date()).format("YYYY-MM-DD")),"合同截至日期必须大于当前日期");
                baseValid(() => (self.formData.settleDay == null || self.formData.settleDay == ""), "供应商账期必填!");
                isInt(self.formData.settleDay, "供应商账期必须为整数");

                if(self.formData.depositPrice){
                    isInt(self.formData.depositPrice,"保证金必须为整数");
                }
                baseValid(() => (self.formData.supplyContractImgList || []).length < 1, "请上传新的合同图片!");
                baseValid(() => (self.formData.description || "").length > 52, "特殊说明最长不超过50个字!");
            },
            /**
             * 校验合同图片必输
             */
            checkContractImgs(rule, value, callback) {
                let len = this.formData.supplyContractImgList.length;
                if (len != 0) {
                    callback();
                } else {
                    callback(new Error("请上传合同"));
                }
            },
            /**
             * 编辑数据初始化
             */
            wrapEditData(){
                var self = this;
                if(self.supplyInfo.biz_status !== 10){
                    return;
                }
                if(self.supplyInfo.last_contract_info_id){
                    this.$httpUtil.post({
                        url: "/supplyContract/detail.json",
                        data: {
                            id: self.supplyInfo.last_contract_info_id
                        },
                        contentType: "form",
                        succ : function(data){
                            if(data.data.valid ==1 || data.data.deletFlag ==1){
                                return;
                            }
                            self.contractTimeArr = [data.data.contractValidityBegin,data.data.contractValidityEnd];
                            self.formData.contractValidityBegin = data.data.contractValidityBegin;
                            self.formData.contractValidityEnd = data.data.contractValidityEnd;
                            self.formData.settleDay = data.data.settleDay;
                            self.formData.depositPrice = self.supplyInfo.deposit_price === 0 ? data.data.depositPrice : null;
                            self.formData.description = data.data.description;
                            // 初始化 图片信息
                            var supplyContractImgList = [];
                            (data.data.supplyContractImgList || []).forEach(el =>{
                                supplyContractImgList.push({
                                    name: el.id,
                                    url: el.url
                                });
                            });
                            self.$set(self.formData,"supplyContractImgList",supplyContractImgList);
                            // 触发绑定
                            self.$refs.contractImgs.syncFileList(self.formData.supplyContractImgList);
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .contract-edit{
        width: 100%;
    }
</style>