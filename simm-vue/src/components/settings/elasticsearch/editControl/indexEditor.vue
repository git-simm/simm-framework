<template>
    <section class="content-section index-editor">
        <template>
            <div>
                <el-form
                        :model="formData"
                        ref="formDate"
                        label-width="10px"
                        class="index-form"
                >
                    <el-row>
                        <el-form-item>
                            <v-jsoneditor
                                    v-model="formData.esMappingsJson"
                                    :options="getVJsonOptions()"
                                    :plus="false"
                                    height="400px">

                            </v-jsoneditor>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col style="text-align:center;">
                            <el-form-item>
                                <el-button type="primary" @click="submit()">维护索引</el-button>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </div>
        </template>
    </section>
</template>

<script>

    export default {
        name: "indexEditor",

        data(){
            return {
                formData:{
                    esMappingsJson:{}
                }
            }
        },
        created() {
            this.queryIndexMapping();
        },
        methods:{
            /**
             * 获取索引JSON配置
             */
            queryIndexMapping(){
                var self = this;
                this.$httpUtil.post({
                    url: "/skuES/queryMapping.json",
                    data: null,
                    contentType: "json", //json,form,multipart
                    succ: function(data) {
                        var dic = data.data || {};
                        if(dic && dic.description){
                            var mapping = JSON.parse(dic.description);
                            self.$set(self.formData,"esMappingsJson",mapping);
                        }

                    }
                });
            },
            /**
             * 提交
             */
            submit(){
                var self = this;
                self
                    .$confirm("索引维护操作将会删除现有索引配置后重建,确认维护索引?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        this.$httpUtil.post({
                            url: "/skuES/createIndex.json",
                            data: {
                                mapping: JSON.stringify(self.formData.esMappingsJson),
                            },
                            contentType: "json", //json,form,multipart
                            succ: function() {
                                self.$message({
                                    message: "操作成功",
                                    type: "success"
                                });

                            }
                        });
                    })
                    .catch(() => {});
            },
            getVJsonOptions(){
                return {mode: 'code'}
            },
        }
    }
</script>

<style scoped>

</style>