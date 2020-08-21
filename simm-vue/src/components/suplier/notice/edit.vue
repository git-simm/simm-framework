<template>
  <section class="content-section supplier-cj-content">
    <el-row>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input v-model.trim="formData.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="内容" prop="content">
              <tinymce-editor v-model="formData.content" ref="editor"></tinymce-editor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="noticeType">
              <el-select
                v-model.number="formData.noticeType"
                clearable
                placeholder="请选择"
                type="number"
              >
                <el-option label="公告" :value="1"></el-option>
                <el-option v-permission:systemNotice label="系统消息" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <div>
              <el-form-item label="发布时间" prop="releaseTime">
                <el-date-picker
                  :editable="false"
                  :clearable="true"
                  v-model="formData.releaseTime"
                  type="datetime"
                  placeholder="请填写发布时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="附件" prop="file">
                <file-uploader ref="annex" :fileList="formData.annexList" @change="annexChange"></file-uploader>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button @click="$back">取消</el-button>
            <el-button v-if="this.$route.params.status==0" type="primary" @click="save()">保存</el-button>
            <el-button type="primary" @click="submit()">确认</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </section>
</template>

<script>
import TinymceEditor from "./tinymce-editor";
import moment from "moment";
export default {
  name: "notice-edit",
  components: { TinymceEditor },
  data: function() {
    return {
      formData: {
        content: "",
        title: "",
        noticeType: null,
        releaseTime: "",
        status: this.$route.params.statu,
        annexList: []
      },
      pickerOptions: {
        disabledDate: this.disabledDate
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
            message: "标题最多能输入60个字符，您已超出限制，请重新输入",
            trigger: "change"
          }
        ],
        noticeType: [
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
  created: function() {
    this.editShow();
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < new Date().getTime() - 8.64e7;
    },
    editShow: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyBulletin/view.json",
        data: {
          id: self.$route.params.id
        },
        contentType: "form",
        succ: function(data) {
          self.formData = data.data;
          if (
            self.$route.params.status == 0 ||
            self.$route.params.status == 1
          ) {
            if (self.$route.params.status != self.formData.status) {
              self.$message({
                message: "当前公告已更改！正在为您刷新，请重新进入",
                type: "success"
              });
              self.$back();
            }
          }
          if (null != data.data.annexList) {
            let list = [];
            data.data.annexList.forEach(item => {
              list.push({
                name: item.annexName,
                url: item.annexUrl
              });
            });
            self.$refs.annex.updateFileList(this.formData, list);
          }
        }
      });
    },

    handleAnnex() {
      var self = this;
      let temp = self.formData.annexList;

      self.formData.annexList = [];
      temp.forEach(item => {
        self.formData.annexList.push({
          annexName: item.name == null ? item.annexName : item.name,
          annexUrl: item.url == null ? item.annexUrl : item.url
        });
      });
    },

    save: function() {
      var self = this;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      emptyValid(self.formData.title, "标题不能为空，请输入");
      emptyValid(self.formData.noticeType, "请选择公告类型");
      if (self.formData.title.length > 60) {
        this.$commonUtil.valid.throwEx(
          "标题最多能输入60个字符，您已超出限制，请重新输入"
        );
      }
      if (self.formData.content.length > 20000) {
        this.$commonUtil.valid.throwEx("输入内容超出限制，请重新输入");
      }
      self.formData.status = 0;
      self.handleAnnex();
      this.$httpUtil.post({
        url: "/supplyBulletin/save.json",
        data: self.formData,
        contentType: "json",
        succ: function(data) {
          self.$message({
            message: "保存成功!" + (data.data == null ? "" : data.data),
            type: "success"
          });
          setTimeout(function() {
            self.$router.push({
              path: "/suplier/notice/notice"
            });
          }, 1500);
        }
      });
    },
    annexChange(list) {
      this.formData.annexList = list;
    },
    submit: function() {
      var self = this;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      emptyValid(self.formData.title, "标题不能为空，请输入");
      emptyValid(self.formData.noticeType, "请选择公告类型");
      emptyValid(self.formData.content, "内容不能为空");
      if (self.formData.title.length > 60) {
        this.$commonUtil.valid.throwEx(
          "标题最多能输入60个字符，您已超出限制，请重新输入"
        );
      }
      if (self.formData.content.length > 20000) {
        this.$commonUtil.valid.throwEx("输入内容超出限制，请重新输入");
      }
      self.handleAnnex();
      this.$httpUtil.post({
        url: "/supplyBulletin/confirm.json",
        data: self.formData,
        contentType: "json",
        succ: function(data) {
          self.$message({
            message: "确认成功!" + (data.data == null ? "" : data.data),
            type: "success"
          });
          setTimeout(function() {
            self.$router.push({
              path: "/suplier/notice/notice"
            });
          }, 1500);
        }
      });
    }
  }
};
</script>
<style scoped>
</style>
