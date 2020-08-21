<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" ref="editor" :init="config" :disabled="disabled" @onClick="onClick"></editor>
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/modern/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
//import "tinymce/plugins/wordcount"; //字数统计
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/paste";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/textcolor";
//import "tinymce/plugins/ax_wordlimit"; //字数限制

export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        "lists image media textcolor table contextmenu autoresize paste searchreplace textcolor"
    },
    toolbar: {
      type: [String, Array],
      default:
        "undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image | table | removeformat | autoresize | searchreplace | forecolor | fontselect | fontsizeselect | backcolor "
    },
    accept: {
      default: "image/jpeg, image/png,image/gif",
      type: String
    },
    maxSize: {
      default: 2097152,
      type: Number
    }
  },
  data() {
    return {
      //初始化配置
      config: {
        language_url: "/static/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: "/static/tinymce/skins/lightgray",
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false, //隐藏tinymce右下角水印
        menubar: false, //自定义菜单
        resize: true, //禁止拉伸图片
        image_title: false, //启用标题输入
        convert_urls: false,
        autoresize_min_height: 400, //最小高度
        autoresize_bottom_margin: 10, //底边距
        //images_upload_url: this.$store.state.serverURI + "/file/upload.json", //第二种上传方式
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片
        images_upload_handler: this.images_upload_handler,
        paste_data_images: true // 粘贴的同时能把内容里的图片自动上传
      },
      myValue: this.value
    };
  },
  mounted() {
    this.init({});
  },
  methods: {
    init() {
      const self = this;
      window.tinymce.init(this.config);
    },
    /**
     * 文件上传
     */
    images_upload_handler(blobInfo, success, failure) {
      var self = this;
      if (blobInfo.blob().size > self.maxSize) {
        failure("文件体积过大");
      }
      if (self.accept.indexOf(blobInfo.blob().type) >= 0) {
        self.uploadPic(blobInfo, success);
      } else {
        failure("图片格式错误");
      }
    },
    uploadPic(blobInfo, success) {
      this.$httpUtil.post({
        url: "/file/upload.json",
        data: {
          files: [
            {
              blob: blobInfo.blob(),
              fileName: blobInfo.filename()
            }
          ]
        },
        contentType: "multipart", //
        succ: function(res) {
          // 返回图片的地址
          success(res.data);
        }
      });
    },
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    //清空
    clear() {
      this.myValue = "";
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>

<style scoped></style>
