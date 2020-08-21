<template>
  <div>
    <div v-if="!controlDisabled">
      <!-- 多文件上传 -->
      <el-upload
        :action="serverURI+'/file/uploadFile.json'"
        :disabled="disabled"
        multiple
        :file-list="showFileList"
        :with-credentials="true"
        :data="tokendata"
        :before-upload="beforeupload"
        :on-success="handleSuccess"
        :on-remove="handleRemoveMainFile"
        accept=".jpg, .jpeg, .png, .doc, .pdf, .xlsx, .docx"
      >
        <el-button size="small" type="primary">上传附件</el-button>
        <div slot="tip" class="el-upload__tip" style="color: red">最多上传5个文件，单个文件大小不超过10MB</div>
        <div
          slot="tip"
          class="el-upload__tip"
          style="color: red"
        >仅支持以下格式文件：.jpg .jpeg .png .doc .pdf .xlsx .docx</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import Sortable from "../../../draggable/src/util/Sortable";
export default {
  name: "file-uploader",
  props: {
    drag: {
      type: Boolean,
      default: true,
      required: false
    },
    limit: {
      type: Number,
      default: 5,
      required: false
    },
    maxSize: {
      type: Number,
      default: 10,
      required: false
    },
    fileList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    controlDisabled: false
  },
  data() {
    return {
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      serverURI: this.$store.state.serverURI,
      annexList: [],
      showFileList: [],
      annexCount: Number,
      disabled: this.controlDisabled,
      msg: ""
    };
  },
  created() {
    var list = this.fileList || [];
    this.showFileList = JSON.parse(JSON.stringify(list));
    this.annexList = list;
    this.annexCount = list.length;
  },
  mounted() {
    if (this.drag) {
      this.initSortable();
    }
  },
  watch: {
    annexList: {
      handler: function(list) {
        //列表计算新的排序码
        list.forEach((a, index) => {
          a.sort = index;
        });
        this.annexCount = this.annexList.length;
        if (this.limit <= 0) {
          this.disabled = false;
        } else {
          this.disabled = this.annexList.length > this.limit;
        }
        this.$emit("change", list);
      },
      deep: true
    }
  },
  //方法列表
  methods: {
    updateFileList(formData, list) {
      list = list || [];
      //深拷贝，避免双向联动
      this.showFileList = JSON.parse(JSON.stringify(list));
      this.annexList = list;
    },
    beforeupload(file) {
      if (this.annexCount < this.annexList.length) {
        this.annexCount = this.annexList.length;
      }
      if (this.limit > 0) {
        if (this.annexCount >= this.limit) {
          this.$message({
            message: `只允许上传${this.limit}个文件!`,
            type: "error"
          });
          this.showFileList = JSON.parse(JSON.stringify(this.annexList));
          this.annexCount = this.annexList.length;
          return false;
        }
      }
      if (file.size > this.maxSize * 1024 * 1024) {
        this.$message({
          message: `单个文件大小不能超过${this.maxSize}M!`,
          type: "error"
        });
        this.showFileList = JSON.parse(JSON.stringify(this.annexList));
        this.annexCount = this.annexList.length;
        return false;
      }
      this.annexCount++;
    },
    handleSuccess: function(response, file, fileList) {
      if (response.resultCode != 1000) {
        //上传失败
        this.$message({
          showClose: true,
          message: "上传失败:" + response.error,
          type: "error"
        });
        return;
      } else {
        //上传成功
        this.annexList.push({
          name: file.name,
          url: response.data
        });
      }
    },
    initSortable() {
      var self = this;
      //初始化拖拽控件
      var $ul = this.$el.querySelector(".el-upload-list");
      if (!$ul) return;
      new Sortable($ul, {
        onUpdate: function(event) {
          //修改items数据顺序
          var newIndex = event.newIndex,
            oldIndex = event.oldIndex;
          // 更新items数组
          var item = self.annexList.splice(oldIndex, 1);
          self.annexList.splice(newIndex, 0, item[0]);
          // 下一个tick就会走patch更新
        },
        animation: 150
      });
    },
    /**
     * 删除
     */
    handleRemoveMainFile(file, list) {
      this.annexCount--;
      if (file == null) return false;
      (list || []).forEach(a => {
        if (a.response) {
          a.url = a.response.data;
        }
      });
      this.annexList = (list || []).filter(a => a.url != file.url);
    },
    getFileList() {
      return this.annexList;
    }
  }
};
</script>

<style lang="less">
.el-upload__input {
  display: none !important;
}
.img-border {
  width: 146px;
  height: 145px;
  margin: 5px;
}
</style>
