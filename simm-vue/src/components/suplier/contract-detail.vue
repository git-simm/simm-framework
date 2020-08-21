<template>
<section class="content-section contract-detail">
    <div :style="{width:`100%`,height:`calc(100% - ${isAuditShow()?130:50}px)`,overflow:`auto`,padding:`5px`}">
        <h5 style="color: #fe3b91">基本信息</h5>
        <el-row>
            <el-col :span="24">
                <sxh-view-container :item-span="8" :label-width="100" style="padding:10px;">
                    <sxh-view-item :span="16" title="供应商名称">{{supplyDetail.supply_name}}</sxh-view-item>
                    <sxh-view-item :span="8" title="供应商编码">{{supplyDetail.supply_number}}</sxh-view-item>
                    <sxh-view-item :span="8" title="申请人">{{contractInfo.creatorName}}&nbsp;&nbsp;{{contractInfo.creatorMobile}}
                    </sxh-view-item>
                    <sxh-view-item :span="8" title="申请人归属">{{contractInfo.creatorBelongs}}</sxh-view-item>
                    <sxh-view-item :span="8" title="申请时间">{{contractInfo.createTime}}</sxh-view-item>
                    <sxh-view-item :span="24" title="申请理由">{{contractInfo.description}}</sxh-view-item>
                </sxh-view-container>
            </el-col>
        </el-row>
        <h5 v-if="isViewShow() || isAuditShow()" style="color: #fe3b91">原合同内容:</h5>
        <el-row v-if="isViewShow() || isAuditShow()">
            <el-col :span="24">
                <sxh-view-container :item-span="8" :label-width="100" style="padding:10px;">
                    <sxh-view-item title="保证金/元">{{supplyDetail.deposit_price}}</sxh-view-item>
                    <sxh-view-item title="合同有效期">
                        {{supplyDetail.contract_validity_begin}}至{{supplyDetail.contract_validity_end}}
                    </sxh-view-item>
                    <sxh-view-item title="账期/天">{{supplyDetail.settle_day}}</sxh-view-item>
                </sxh-view-container>
            </el-col>
            <el-col :span="24">
                <h6>原合同影像:</h6>
                <div v-viewer class="images">
                    <template v-for="contractImg in supplyDetail.contractPics">
                        <img :src="contractImg.url" class="image" :key="contractImg.name" />
                    </template>
                </div>
            </el-col>
        </el-row>

        <h5 style="color: #fe3b91">续签合同内容:</h5>
        <el-row>
            <el-col :span="24">
                <sxh-view-container :item-span="8" :label-width="100" style="padding:10px;">
                    <sxh-view-item title="保证金/元">{{contractInfo.depositPrice}}</sxh-view-item>
                    <sxh-view-item title="合同有效期">
                        {{contractInfo.contractValidityBegin}}至{{contractInfo.contractValidityEnd}}
                    </sxh-view-item>
                    <sxh-view-item title="账期/天">{{contractInfo.settleDay}}</sxh-view-item>
                </sxh-view-container>
            </el-col>
            <el-col :span="24">
                <h6>合同影像:</h6>
                <div v-viewer class="images">
                    <template v-for="contractImg in contractInfo.contractPics">
                        <img :src="contractImg.url" class="image" :key="contractImg.name" />
                    </template>
                </div>
            </el-col>
        </el-row>
    </div>
    <div class="layer-footer" v-if="isAuditShow()" style="height: 140px;text-align:left;">
        <el-row>
            <el-col :span="24">
                <!--审核 意见-->
                <div>
                    <h5 style="color: #fe3b91">审核意见：</h5>
                    <el-input type="textarea" placeholder="请输入审核意见,限50字内" v-model="comment">
                    </el-input>
                </div>
                <div style="text-align:center;padding-top:5px;">
                    <el-button type="primary" icon="el-icon-check" @click="audit('pass')">审核通过</el-button>
                    <el-button type="primary" icon="el-icon-close" @click="audit('reject')">审核驳回</el-button>
                    <el-button @click="closeWin()">关闭</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
    <div v-else>
        <div style="text-align:center;padding-top:5px;">
            <el-button type="primary" @click="closeWin()">关闭</el-button>
        </div>
    </div>
</section>
</template>

<script>
/**
 * 场景:
 *  1.合同列表->查看
 *  2.续签审核列表->查看/审核
 * 数据：
 * 1.供应商明细（图片信息）
 * 2.续签合同明细
 * 权限：
 * 1.审核通过/驳回按钮
 * 2.返回按钮
 *
 */
import moment from "moment";
export default {
    name: "contract-detail",
    props: {
        // 供应商信息
        supplyInfo: Object,
        viewModel: {
            type: String,
            require: false,
            default: "log_view"
        },
        callback: Function
    },
    data() {
        return {
            contractInfo: {
                contractPics: []
            },
            comment: null,
            formData: {

            },
            supplyDetail: {
                contractPics: []
            },
            modelEnum: {
                LOG_VIEW: "log_view", // 续签日志查看 只展示 提交内容
                VIEW: "view", // 续签预览 展示新/老内容
                AUDIT: "audit" // 审核 展示全部内容
            }
        }
    },
    created() {
        this.initData();
    },
    methods: {
        isLogViewShow() {
            return this.viewModel == this.modelEnum.LOG_VIEW;
        },
        isViewShow() {
            return this.viewModel == this.modelEnum.VIEW;
        },

        isAuditShow() {
            return this.viewModel == this.modelEnum.AUDIT;
        },
        /**
         * 数据组装
         */
        async initData() {
            var self = this;
            await self.getSupplyDetail();
            await self.getContractInfo(self.supplyDetail.last_contract_info_id);
            return;
        },
        /**
         * 获取供应商明细
         * @returns {Promise<*>}
         */
        async getSupplyDetail() {
            var self = this;
            var data = await this.$httpUtil.post({
                url: "/supplyInfo/groupSelect.json",
                data: {
                    id: self.supplyInfo.id
                },
                contentType: "form" //json,form,multipart
            });
            self.supplyDetail = data.data.data.supplyInfo;
            var imgs = (data.data.data.certifications || []).filter(el => el.certification_type === 1);
            var contractPics = [];
            (imgs || []).forEach(pic => {
                contractPics.push({
                    name: pic.id,
                    url: pic.certification_img_url
                });
            })
            self.$set(self.supplyDetail, "contractPics", contractPics);
            self.supplyDetail.contract_validity_begin = self.$commonUtil.valid.isEmpty(
                    self.supplyDetail.contract_validity_begin
                ) ?
                null :
                moment(self.supplyDetail.contract_validity_begin).format(
                    "YYYY-MM-DD"
                );
            self.supplyDetail.contract_validity_end = self.$commonUtil.valid.isEmpty(
                    self.supplyDetail.contract_validity_end
                ) ?
                null :
                moment(self.supplyDetail.contract_validity_end).format(
                    "YYYY-MM-DD"
                );
            return;
        },
        /**
         * 获取合同续签信息
         * @param contractId
         * @returns {Promise<*>}
         */
        async getContractInfo(contractId) {
            var self = this;
            var data = await this.$httpUtil.post({
                url: "/supplyContract/detail.json",
                data: {
                    id: contractId
                },
                contentType: "form" //json,form,multipart
            });
            self.contractInfo = data.data.data;
            var contractPics = [];
            (data.data.data.supplyContractImgList || []).forEach(el => {
                contractPics.push({
                    name: el.id,
                    url: el.url
                });
            });
            self.$set(self.contractInfo, "contractPics", contractPics);

            self.contractInfo.contractValidityBegin = self.$commonUtil.valid.isEmpty(
                    self.contractInfo.contractValidityBegin
                ) ?
                null :
                moment(self.contractInfo.contractValidityBegin).format(
                    "YYYY-MM-DD"
                );
            self.contractInfo.contractValidityEnd = self.$commonUtil.valid.isEmpty(
                    self.contractInfo.contractValidityEnd
                ) ?
                null :
                moment(self.contractInfo.contractValidityEnd).format(
                    "YYYY-MM-DD"
                );
            return;
        },
        /**
         *  审核  model: "pass"-审核通过  "reject"-审核驳回
         */
        audit(model) {
            var self = this;
            var requestUrl;
            let baseValid = this.$commonUtil.formValid.baseValid;
            baseValid(() => (self.comment || "").length > 52, "审核意见不超过50个字!");
            if (model == "pass") {
                requestUrl = "/supplyContract/auditPass.json"
            } else if (model == "reject") {
                baseValid(() => (self.comment || "").length === 0, "审核驳回时,须填写审核意见!");
                requestUrl = "/supplyContract/auditReject.json"
            }
            this.$httpUtil.post({
                url: requestUrl,
                data: {
                    id: self.contractInfo.id,
                    comment: self.comment
                },
                contentType: "form",
                succ: function () {
                    self.closeWin();
                    if (self.callback) {
                        self.callback();
                    }
                }
            });
        },
        /**
         * 关闭当前窗口
         */
        closeWin: function () {
            this.$layerUtil.closeWin(this);
        },
    }
}
</script>

<style scoped>
.contract-detail .images .image {
    height: 100px;
    width: 100px;
    cursor: pointer;
    margin: 5px;
    display: inline-block;
}
</style>
