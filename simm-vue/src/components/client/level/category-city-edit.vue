<template>
    <section class="content-section layer-container">
        <el-form :model="category" :rules="rules" label-width="120px" label-heigh="120px" ref="category">
            <el-form-item label="类目名称">
                <span>{{category.categoryName}}</span>
            </el-form-item>
            <el-form-item label="当前毛利率">
                <span>{{category.oldGrossProfitRate}}%</span>
            </el-form-item>
            <el-form-item label="修改后的毛利率" prop="grossProfitRate">
                <sxh-input-number
                        :precision="2"
                        :step="0.1"
                        :min="0"
                        :controls="false"
                        v-model="category.grossProfitRate"
                        placeholder="请输入毛利率"
                        auto-complete="off">
                    <template slot="append">%</template>
                </sxh-input-number>
            </el-form-item>
        </el-form>
        <span class="text-theme">
               注意：如毛利率发生变更，正在售卖、已下架、待上架与等待审核的SGU不受影响
        </span>
        <div class="layer-footer" style="text-align:center;">
            <el-button type="primary" @click="save">确 定</el-button>
            <el-button @click="closeWin">取 消</el-button>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                category: {},
                invoke: null,
                rules: {
                    categoryName: [
                        {required: true, message: "请输入毛利率", trigger: "blur"}
                    ]
                },
                grossProfitRate: [
                    {
                        type: "number",
                        required: true,
                        trigger: "blur",
                        label: "毛利率",
                        validator: this.checkGrossProfitRate
                    }
                ],
            };
        },
        created() {
            this.category = this.$options.propsData.category || {};
            this.category.oldGrossProfitRate = this.category.grossProfitRate;
        },
        methods: {
            save() {
                if (
                    this.category.grossProfitRate < 0
                ) {
                    this.$commonUtil.message.alert(`毛利率不能小于零`);
                    return;
                }
                var self = this;
                var jsondata = {}
                jsondata = this.category
                this.$httpUtil.post({
                    url: "/base/prod/categoryCity/updateCategory.json",
                    data: jsondata,
                    contentType: "form",
                    loading: true,//不显示遮罩层
                    succ: function (data) {
                        self.$options.parent.searchFun();
                        self.closeWin();
                    }
                });
            },

            closeWin: function () {
                this.$layerUtil.closeWin(this);
            }
        },
        /**
         * 毛利率校验
         */
        checkGrossProfitRate(rule, value, callback) {
            if (value < 0 ) {
                return callback(
                    new Error(
                        `${rule.label}必须大于或等于0,请正确填写${rule.label}`
                    )
                );
            } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
                return callback(new Error(`${rule.label}最多2位小数`));
            } else {
                callback();
            }
        }
    };
</script>
