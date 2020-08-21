<template>
  <div>
    <div v-if="!controlDisabled">
      <!-- 多图上传 -->
      <!-- :disabled="disabled" -->
      <el-upload
        v-if="multiple"
        ref="uploader"
        :action="serverURI+'/file/upload.json'"
        list-type="picture-card"
        multiple
        :disabled="controlDisabled"
        :limit="limit<0?1000:limit"
        :file-list="showPicList"
        :data="tokendata"
        :before-upload="beforeupload"
        :with-credentials="true"
        :on-success="handleSuccess"
        :on-remove="handleRemoveMainPic"
        :on-preview="handlePictureCardPreview"
      >
        <i slot="default" class="el-icon-plus" :title=" limit>0 ? `只允许上传 ${limit}张图片!`:''"></i>
      </el-upload>
      <!-- 单图上传 -->
      <el-upload
        ref="uploader"
        list-type="picture-card"
        v-else
        :disabled="controlDisabled"
        :action="serverURI+'/file/upload.json'"
        :show-file-list="false"
        :data="tokendata"
        :before-upload="beforeupload"
        :with-credentials="true"
        :on-success="handleSuccess"
      >
        <ul v-if="singleImgUrl" class="el-upload-list el-upload-list--picture-card">
          <li class="el-upload-list__item is-success">
            <img
              :src="singleImgUrl"
              alt
              style="margin:0!important;border-radius: 5px;"
              class="img-border"
              title="点击上传图片"
            />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click.stop="handlePreview">
                <i class="el-icon-zoom-in" style="color:white;" title="预览图片"></i>
              </span>
              <span class="el-upload-list__item-preview">
                <i class="el-icon-upload" style="color:white;" title="重传图片"></i>
              </span>
            </span>
          </li>
        </ul>
        <i v-else slot="default" class="el-icon-plus"></i>
      </el-upload>
      <p v-if="limit>0 && multiple" class="text-theme">提示：只允许上传 {{limit}} 张图片</p>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
    <div v-viewer class="images" v-else>
      <template v-for="image in showPicList">
        <img :src="image.url" class="img-border" :key="image.id" />
      </template>
    </div>
  </div>
</template>

<script>
import Sortable from "../../draggable/src/util/Sortable";
export default {
  name: "sxh-uploader",
  props: {
    multiple: {
      type: Boolean,
      default: true,
      required: false
    },
    drag: {
      type: Boolean,
      default: true,
      required: false
    },
    limit: {
      type: Number,
      default: 10,
      required: false
    },
    maxSize: {
      type: Number,
      default: 2,
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
      dialogImageUrl: "",
      dialogVisible: false,
      serverURI: this.$store.state.serverURI,
      picList: [],
      showPicList: [],
      imgCount: Number,
      msg: "",
      singleImgUrl: ""
    };
  },
  created() {
    var list = this.fileList || [];
    this.showPicList = JSON.parse(JSON.stringify(list));
    this.picList = list;
    this.imgCount = list.length;
  },
  mounted() {
    if (this.drag) {
      this.initSortable();
    }
  },
  watch: {
    picList: {
      handler: function(list) {
        //列表计算新的排序码
        list.forEach((a, index) => {
          a.sort = index;
        });
        this.imgCount = this.picList.length;
        if (!this.multiple) {
          if ((list || []).length == 0) {
            this.singleImgUrl = null;
          } else {
            this.singleImgUrl = list[0].url;
          }
        }
        this.$emit("change", list);
      },
      deep: true
    }
  },
  //方法列表
  methods: {
    syncFileList(picsList){
      this.updatePicList(null,picsList);
    },
    updatePicList(formData, list) {
      list = list || [];
      //深拷贝，避免双向联动
      this.showPicList = JSON.parse(JSON.stringify(list));
      this.picList = list;
    },
    beforeupload(file) {
      if (this.imgCount < this.picList.length) {
        this.imgCount = this.picList.length;
      }
      if (this.limit > 0) {
        if (this.imgCount >= this.limit) {
          this.$message({
            message: `只允许上传!${this.limit}张图片`,
            type: "error"
          });
          this.showPicList = JSON.parse(JSON.stringify(this.picList));
          this.imgCount = this.picList.length;
          return false;
        }
      }
      if (file.size > this.maxSize * 1024 * 1024) {
        this.$message({
          message: `图片大小不能超过${this.maxSize}M!`,
          type: "error"
        });
        this.showPicList = JSON.parse(JSON.stringify(this.picList));
        this.imgCount = this.picList.length;
        return false;
      }
      this.imgCount++;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePreview() {
      this.dialogImageUrl = this.singleImgUrl;
      this.dialogVisible = true;
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
        if (!this.multiple) {
          //上传成功
          this.picList = [];
        }
        //上传成功
        this.picList.push({
          name: file.name,
          url: response.data
        });
        if (!this.multiple) {
          this.singleImgUrl = (this.picList || [])[0].url;
        }
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
          var item = self.picList.splice(oldIndex, 1);
          self.picList.splice(newIndex, 0, item[0]);
          // 下一个tick就会走patch更新
        },
        animation: 150
      });
    },
    /**
     * 删除图片
     */
    handleRemoveMainPic(file, list) {
      this.imgCount--;
      if (file == null) return false;
      (list || []).forEach(a => {
        if (a.response) {
          a.url = a.response.data;
        }
      });
      this.picList = (list || []).filter(a => a.url != file.url);
    },
    getFileList() {
      return this.picList;
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
