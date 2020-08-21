<template>
    <section class="content-section video-uploader">
        <!-- 只支持单个视频上传 -->
        <div v-if="!controlDisabled">
            <el-upload
                    class="video-uploader"
                    ref="videoUploader"
                    :action="serverURI+'/file/upload.json'"
                    :disabled="disabled"
                    :limit="limit"
                    :data="tokendata"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :on-error="handleError"
            >
                <video v-if="singleVideoUrl"
                       :src="singleVideoUrl"
                       class="video-edit-border"
                       :id ="singleVideoUrl"
                       controls
                       />
                <span v-else-if="videoUploadStatus" slot="default" font="18px">视频文件正在上传服务器...</span>
                <i v-else slot="default" class="el-icon-plus"></i>
            </el-upload>
        </div>
        <div v-viewer v-else>
            <template v-for="video in showVideoList">
                <video class="video-view-style" :src="video.url" controls/>
            </template>
        </div>
    </section>
</template>

<script>
    export default {
        name: "sxh-video-uploader",
        props: {
            multiple: {
                type: Boolean,
                default: true,
                required: false
            },
            limit: {
                type: Number,
                default: 1,
                required: false
            },
            maxSize: {
                type: Number,
                default: 50,
                required: false
            },
            videoMaxDuration:{
                type: Number,
                default: 180,
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
                videoList: [],
                showVideoList: [],
                videoCount: Number,
                disabled: false,
                msg: "",
                singleVideoUrl: "",
                totalDuration:"",
                videoUploadStatus:false,
            };
        },
        watch: {
            videoList: {
                handler: function(list) {
                    this.videoCount = this.videoList.length;
                        if ((list || []).length == 0) {
                            this.singleVideoUrl = null;
                            this.disabled = false;
                        } else { // 当视频文件集合不为空时 禁止上传
                            this.singleVideoUrl = list[0].url;
                            this.disabled = true;
                        }
                    this.$emit("change", list);
                },
                deep: true
            },
            disabled:{
                handler:function(){
                    this.videoUploadStatus = this.getVideoUploadStatus();
                }
            }
        },
        created() {
            var list = this.fileList || [];
            this.showVideoList = JSON.parse(JSON.stringify(list));
            this.videoList = list;
            this.videoCount = list.length;
        },
        //方法列表
        methods: {
            updateVideoList(formData, list, isView) {
                list = list || [];
                //深拷贝，避免双向联动
                this.showVideoList = JSON.parse(JSON.stringify(list));
                this.videoList = list;
                if(list.length == 0 && !isView){
                    this.$refs.videoUploader.clearFiles();
                }
            },
            beforeUpload(file) {
                if (this.videoCount < this.videoList.length) {
                    this.videoCount = this.videoList.length;
                }
                // 校验视频格式
                if(['video/mp4'].indexOf(file.type) == -1){
                    this.$message({
                        message: `暂仅支持mp4视频格式!`,
                        type: "error"
                    });
                    return false;
                }
                if (this.limit > 0) {
                    if (this.videoCount >= this.limit) {
                        this.$message({
                            message: `只允许上传${this.limit}段视频!`,
                            type: "error"
                        });
                        this.showVideoList = JSON.parse(JSON.stringify(this.videoList));
                        this.videoCount = this.videoList.length;
                        return false;
                    }
                }
                if (file.size > this.maxSize * 1024 * 1024) {
                    this.$message({
                        message: `视频文件大小不能超过${this.maxSize}M!`,
                        type: "error"
                    });
                    this.showVideoList = JSON.parse(JSON.stringify(this.videoList));
                    this.videoCount = this.videoList.length;
                    return false;
                }
                this.videoCount++;
                this.disabled = true;
            },
            handleSuccess: function(response, file, fileList) {
                if (response.resultCode != 1000) {
                    //上传失败
                    // 后台上传失败 清理前端缓存文件
                    this.updateVideoList();
                    this.disabled = false; // 上传失败 可重新上传
                    this.$message({
                        showClose: true,
                        message: "视频上传失败:" + response.error + "。请重新上传!",
                        type: "error"
                    });
                    this.$refs.videoUploader.clearFiles();
                    return;
                } else {
                    if (!this.multiple) {
                        //上传成功
                        this.videoList = [];
                    }
                    //上传成功
                    this.videoList.push({
                        name: file.name,
                        url: response.data
                    });
                    this.singleVideoUrl = (this.videoList || [])[0].url;
                }
            },
            handleError:function(error,file, fileList){
                // 后台上传失败 清理前端缓存文件
                this.updateVideoList();
                this.disabled = false; // 上传失败 可重新上传
                this.$message({
                    showClose: true,
                    message: "视频文件上传服务器超时,请确认网络环境后重新上传!",
                    type: "error"
                });
                this.$refs.videoUploader.clearFiles();
                return
            },
            getVideoUploadStatus(){
                // 视频已开始上传但未上传成功
                if(this.disabled && (this.videoList || []).length === 0){
                    return true;
                }else{
                    return false;
                }
            },
            /**
             * 删除视频
             */
            handleRemove(file, list) {
                this.videoCount = 0;
                if (file == null) return false;
                (list || []).forEach(a => {
                    if (a.response) {
                        a.url = a.response.data;
                    }
                });
                this.videoList = (list || []).filter(a => a.url != file.url);
            }
        }
    }
</script>

<style scoped>
    .video-edit-border {
        width: 300px;
        height: 375px;
    }
    .video-view-style {
        width: 300px;
        height: 375px;
        border: 1px dashed #c0ccda;
    }
</style>