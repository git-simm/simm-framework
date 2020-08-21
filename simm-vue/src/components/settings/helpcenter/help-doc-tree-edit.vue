<template>
    <section class="content-section layer-container">
        <el-form :model="helpDocTree" :rules="rules" label-width="100px" ref="helpDocTree">
            <el-form-item label="当前层级ID:" v-if="helpDocTree.id">
                <span>{{helpDocTree.id}}</span>
            </el-form-item>
            <el-form-item label="层级名称" prop="name">
                <el-input placeholder="请输入层级名称" v-model.trim="helpDocTree.name"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="code">
                <el-input placeholder="请输入编码" v-model.trim="helpDocTree.code"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <sxh-input-number
                  placeholder="请输入排序码"
                  v-model.trim="helpDocTree.sort"
                  :precision="0"
                  :controls="false">
                </sxh-input-number>
            </el-form-item>
            <el-form-item label="父级ID" prop="parentId" v-if="helpDocTree.id">
                <sxh-input-number
                  placeholder="请输入新父级ID"
                  v-model.trim="helpDocTree.parentId"
                  :precision="0"
                  :controls="false">
                </sxh-input-number>
            </el-form-item>
        </el-form>
        <div class="layer-footer" style="text-align:center;">
            <el-button type="primary" @click="save">确 定</el-button>
            <el-button @click="closeWin">取 消</el-button>
        </div>
    </section>
</template>

<script>
    export default {
        name: "helpTreeEdit",
        data() {
            return {
                helpDocTree: {},
                invoke:null,
                rules: {
                    name: [
                        {
                            required: true,
                            message: "请输入层级名称",
                            tirgger: "blur"
                        }
                    ],
                    code: [
                        {
                            required: true,
                            message: "请输入层级编码",
                            tirgger: "blur"
                        }
                    ]
                }
            }
        },
        created() {
            this.helpDocTree = this.$options.propsData.helpDocTree || {};
            this.invoke = this.$options.propsData.invoke;
        },
        methods: {
            //TODO 校验sort
            save: function () {
                if (this.helpDocTree.name == "") {
                    this.$commonUtil.message.alert(`请输入新的分层名称`);
                    return;
                }
                if (this.helpDocTree.code == "") {
                    this.$commonUtil.message.alert(`请输入新的分层的编码`);
                    return;
                }
                if(this.helpDocTree.id && this.helpDocTree.parentId===""){
                     this.$commonUtil.message.alert(`请输入新的父级ID`);
                    return;
                }
                this.invoke(this.helpDocTree, this.closeWin);
            },
            closeWin: function () {
                this.$layerUtil.closeWin(this);
            },
        }
    }
</script>

<style scoped>

</style>