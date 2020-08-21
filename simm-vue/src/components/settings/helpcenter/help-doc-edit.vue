<template>
  <section class="content-section supplier-cj-content">
    <el-row>
      <el-col :span="20">
        <el-form
          :model="data"
          :rules="rules"
          ref="formData"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="标题" prop="title">
                <el-input placeholder="请输入标题" v-model.trim="data.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="编码" prop="code">
                <template slot="label">
                  <span>编码</span>
                  <sxh-help code="000000" mini></sxh-help>
                </template>
                <el-input placeholder="请输入编码" v-model.trim="data.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="排序码" prop="sort">
                <sxh-input-number
                  placeholder="请输入排序码"
                  v-model.trim="data.sort"
                  :precision="0"
                  :controls="false"
                ></sxh-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="类型" prop="docType">
                  <el-select
                    v-model.number="data.docType"
                    clearable
                    placeholder="请选择"
                    type="number"
                  >
                    <el-option label="文档" :value="1"></el-option>
                    <el-option label="提示" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <el-form-item label="目录" prop="treeId">
                <sxh-input-number
                  placeholder="请输入文档目录"
                  v-model.trim="data.treeId"
                  :precision="0"
                  :controls="false"
                ></sxh-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内容" prop="content">
                <tinymce-editor v-model="data.content" ref="editor"></tinymce-editor>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center;">
              <el-button @click="$back">取消</el-button>
              <el-button type="primary" @click="save()">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import TinymceEditor from "@/components/suplier/notice/tinymce-editor";
import helpDocEditHandler from "@/components/settings/helpcenter/help-doc-edit-handler";
export default {
  name: "helpDocEdit",
  components: { TinymceEditor },
  mixins: [helpDocEditHandler],
  data: function() {
    return {
      data: {
        content: "",
        title: "",
        treeId: "",
        docType: 1,
        status: 1,
        sort: 1
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blue"
          },
          {
            max: 60,
            message: "标题最多能输入60个字符",
            trigger: "change"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blue"
          },
          {
            min: 6,
            max: 20,
            message: "编码长度在 6 到 20 个字符",
            trigger: "change"
          }
        ],
        docType: [
          {
            required: true,
            type: "number",
            message: "请选择类型",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    save: function() {
      var self = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          var url = "/helpdoc/add.json";
          if (self.data.id) {
            url = "/helpdoc/edit.json";
          }
          self.$httpUtil.post({
            url: url,
            data: self.data,
            contentType: "json",
            succ: function(data) {
              self.$message({
                message: "保存成功!",
                type: "success"
              });
              setTimeout(function() {
                self.$back();
              }, 1500);
            }
          });
        } else {
          //校验出错，返回到第一个页签
          this.$commonUtil.valid.throwEx(`信息填写有误，请核查`);
          return false;
        }
      });
    }
  }
};
</script>
