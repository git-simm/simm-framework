<template>
  <section class="content-section supplier-cj-content">
    <el-row>
      <el-form :model="data" :rules="rules" ref="data" label-width="200px" class="demo-ruleForm">
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input placeholder="请输入标题" v-model.trim="data.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="内容" prop="content">
              <tinymce-editor v-model="data.content" ref="editor"></tinymce-editor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="类型" prop="noticeType">
                <el-select
                  v-model.number="data.noticeType"
                  clearable
                  placeholder="请选择"
                  type="number"
                >
                  <el-option label="公告" :value="1"></el-option>
                  <el-option v-permission:systemNotice label="系统消息" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="发布时间" prop="releaseTime">
                <el-date-picker
                  :editable="false"
                  :clearable="false"
                  v-model="data.releaseTime"
                  type="datetime"
                  placeholder="请填写发布时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="附件" prop="file">
                <file-uploader ref="annex" :fileList="data.annexList" @change="annexChange"></file-uploader>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button @click="$back">取消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
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
import FileUploader from "./controls/file-uploader";
import $ from "jquery";
export default {
  name: "notice-add",
  components: { FileUploader, TinymceEditor },
  data: function() {
    return {
      data: {
        content: "",
        title: "",
        noticeType: null,
        releaseTime: "",
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
  created() {},
  computed: {
    isSupplyManager() {
      return (this.$store.state.userInfo.roles || []).some(
        a => a.adminRoleNo == "supplymanager"
      );
    }
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < new Date().getTime() - 8.64e7;
    },

    annexChange(list) {
      this.data.annexList = list;
    },

    save: function() {
      var self = this;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      emptyValid(self.data.title, "标题不能为空，请输入");
      emptyValid(self.data.noticeType, "请选择公告类型");
      if (self.data.title.length > 60) {
        this.$commonUtil.valid.throwEx(
          "标题最多能输入60个字符，您已超出限制，请重新输入"
        );
      }
      if (self.data.content.length > 20000) {
        this.$commonUtil.valid.throwEx("输入内容超出限制，请重新输入");
      }
      self.data.status = 0;
      self.handleAnnex();
      this.$httpUtil.post({
        url: "/supplyBulletin/save.json",
        data: self.data,
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
    handleAnnex() {
      var self = this;
      let temp = self.data.annexList;
      self.data.annexList = [];
      temp.forEach(item => {
        self.data.annexList.push({
          annexName: item.name,
          annexUrl: item.url
        });
      });
    },

    submit: function() {
      var self = this;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      emptyValid(self.data.title, "标题不能为空，请输入");
      emptyValid(self.data.noticeType, "请选择公告类型");
      emptyValid(self.data.content, "内容不能为空");
      if (self.data.title.length > 60) {
        this.$commonUtil.valid.throwEx(
          "标题最多能输入60个字符，您已超出限制，请重新输入"
        );
      }
      if (self.data.content.length > 20000) {
        this.$commonUtil.valid.throwEx("输入内容超出限制，请重新输入");
      }
      self.handleAnnex();
      this.$httpUtil.post({
        url: "/supplyBulletin/confirm.json",
        data: self.data,
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
