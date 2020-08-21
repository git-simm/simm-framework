<template>
  <section class="content-section supplier-cj-content">
    <el-row>
      <el-form :model="formData" ref="formData" label-width="200px" class="demo-ruleForm">
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input v-model.trim="formData.title" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="内容:" prop="content">
              <p
                v-html="formData.content"
                style="word-wrap: break-word;border:1px solid #f4f4f4;"
              >{{formData.content}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="noticeType">
              <el-select
                v-model.number="formData.noticeType"
                clearable
                placeholder="请选择"
                type="number"
                :disabled="true"
              >
                <el-option label="公告" :value="1"></el-option>
                <el-option label="系统消息" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <div>
              <el-form-item label="发布时间" prop="releaseTime">
                <el-date-picker
                  :editable="false"
                  :disabled="true"
                  :clearable="true"
                  v-model="formData.releaseTime"
                  type="datetime"
                  placeholder="请填写发布时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-table border size="mini" :data="formData.annexList" style="width: 100%">
          <el-table-column label="文件名" prop="annexName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" class="btn-default" @click="download(scope.row.annexUrl)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button @click="$back">返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </section>
</template>

<script>
import TinymceEditor from "./tinymce-editor";
import VueClipboard from "vue-clipboard2";
import Vue from "vue";
Vue.use(VueClipboard);
export default {
  name: "notice-view",
  components: { TinymceEditor },
  data: function() {
    return {
      formData: {
        content: "",
        title: "",
        noticeType: null,
        releaseTime: ""
      }
    };
  },
  created: function() {
    this.showNotice();
  },
  mounted() {},
  methods: {
    showNotice: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyBulletin/view.json",
        data: {
          id: self.$route.params.id
        },
        contentType: "form",
        succ: function(data) {
          self.formData = data.data;
        }
      });
    },
    download(url) {
      window.open(url);
    }
  }
};
</script>

<style scoped>
</style>
