<template>
<span @click="cropImg">
    <slot>
        <a href="javascript:void(0)" title="编辑上传">编辑上传</a>
    </slot>
</span>
</template>

<script>
import baseMixin from "@/common/mixins/baseMixin";
import sxhCropperPanel from "./sxh-cropper-panel";
export default {
    name: "SxhCropper",
    mixins: [baseMixin],
    components: {
        sxhCropperPanel
    },
    props: {
        //默认参数
        option: {
            type: Object,
            require: false,
            default: () => {
                return {
                    img: null
                };
            }
        },
        save: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            info: {}
        };
    },
    methods: {
        /**
         * 查询当前审核节点
         */
        cropImg() {
            this.$layerUtil.openWin(this, {
                title: `${this.option.winName ?? "剪切图片"}`,
                area: ["1000px", "600px"],
                data: {
                    option: this.option,
                    saveImg: this.saveImg
                },
                component: sxhCropperPanel
            });
        },
        /**
         * 保存图片
         */
        saveImg(blobData, callback) {
            var files = [{
                blob: blobData,
                fileName: "截图" + Math.random() + ".png"
            }];
            var self = this;
            if (this.save) {
                this.save(files, data => {
                    self.info = data;
                    if (callback) {
                        callback(self.info);
                    }
                });
                //this.$layerUtil.closeWin(this);
                return;
            }
            var self = this;
            this.$httpUtil.post({
                url: "/file/upload.json",
                data: {
                    files: files
                },
                contentType: "multipart", //
                succ: function (res) {
                    self.$emit("success", res.data);
                    self.$layerUtil.closeWin(self);
                }
            });
        }
    }
};
</script>
