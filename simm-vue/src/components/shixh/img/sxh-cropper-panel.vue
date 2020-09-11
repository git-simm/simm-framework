<template>
    <div class="sxh-cropper">
        <div class="test-button">
            <!-- <el-button @click="changeImg">changeImg</el-button> -->
            <label class="el-button" for="uploads">
                <i class="el-icon-upload2"></i>本地图片
            </label>
            <input
                    type="file"
                    id="uploads"
                    style="position:absolute; clip:rect(0 0 0 0);"
                    accept="image/png, image/jpeg, image/gif, image/jpg"
                    @change="uploadImg($event, 1)"
            />
            <el-button @click="refreshCrop" title="刷新">
                <i class="el-icon-refresh"></i>
            </el-button>
            <el-button @click="changeScale(1)" title="放大">
                <i class="el-icon-plus"></i>
            </el-button>
            <el-button @click="changeScale(-1)" title="缩小">
                <i class="el-icon-minus"></i>
            </el-button>
            <el-button @click="rotateLeft" title="向左翻转">
                <i class="el-icon-top-left"></i>
            </el-button>
            <el-button @click="rotateRight" title="向右翻转">
                <i class="el-icon-top-right"></i>
            </el-button>
            <!-- <el-button @click="finish('base64')">
        <i class="el-icon-view"></i>preview(base64)
            </el-button>-->
            <!-- <el-button @click="finish('blob')">
        <i class="el-icon-view"></i>预览
            </el-button>-->
            <el-button @click="down('blob')" title="下载剪切后的图片">
                <i class="el-icon-download"></i>下载图片
            </el-button>
            <span style="padding-left:10px" v-if="option.demo>''">
                <el-popover trigger="click">
                    <img :src="option.demo" style="max-height:500px" />
                    <el-button slot="reference">图片剪切标准示例</el-button>
                </el-popover>
            </span>
        </div>
        <el-row>
            <el-col :span="14">
                <div class="cut">
                    <vue-cropper
                            ref="cropper"
                            :img="option.img"
                            :output-size="option.size"
                            :output-type="option.outputType"
                            :info="option.info"
                            :info-true="option.infoTrue"
                            :full="option.full"
                            :fixed="option.fixed"
                            :fixed-number="option.fixedNumber"
                            :can-move="option.canMove"
                            :can-move-box="option.canMoveBox"
                            :fixed-box="option.fixedBox"
                            :original="option.original"
                            :auto-crop="option.autoCrop"
                            :auto-crop-width="option.autoCropWidth"
                            :auto-crop-height="option.autoCropHeight"
                            :center-box="option.centerBox"
                            @real-time="realTime"
                            :high="option.high"
                            mode="cover"
                            :maxImgSize="option.maxImgSize"
                    ></vue-cropper>
                </div>
                <div v-if="option.fixedList" class="test-button">
                    <div style="margin: 0 auto;">
                        <el-button
                                type="primary"
                                :key="item.name"
                                @click="()=>switchType(item)"
                                v-for="item in option.fixedList"
                        >{{item.name}}</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="10" class="preview">
                <div style="overflow:auto;max-height: 224px;" v-viewer>
                    <div v-if="previews.url>''" :style="previewStyle">
                        <div :style="previews.div">
                            <img :src="previews.url" :style="previews.img" />
                        </div>
                    </div>
                    <img v-else :src="option.demo" style="max-height:240px;" />
                </div>
                <p style="text-align:center;padding-top:10px;">
                    {{(fixedItem||{}).name}}预览图
                    <el-tag
                            size="mini"
                            effect="plain"
                            v-if="(option.fixedNumber||[]).length>=2"
                    >长宽比 {{option.fixedNumber[0]}}:{{option.fixedNumber[1]}}</el-tag>
                    <el-tag
                            size="mini"
                            effect="plain"
                            v-if="previews!=null"
                    >分辨率 {{cropInfo.width}} * {{cropInfo.height}}</el-tag>
                </p>
                <div
                        v-html="info.show"
                        style="overflow:auto;max-height: 170px;padding:2px;background:ghostwhite;"
                ></div>
            </el-col>
        </el-row>
        <div class="layer-footer" style="text-align:center;">
            <el-button type="primary" @click="save">{{option.okText>''?option.okText:'确 定'}}</el-button>
            <el-button @click="closeWin">{{option.cancelText>''?option.cancelText:'取 消'}}</el-button>
        </div>
    </div>
</template>

<script>
    import { VueCropper } from 'vue-cropper'
    export default {
        name: 'SxhCropperPanel',
        components: {
            VueCropper
        },
        props: {
            //示例图
            demo: {
                type: String,
                default: null
            },
            //外部传入图片
            imgurl: {
                type: String,
                default: null
            },
            fixedNumber: {
                type: Array,
                required: false,
                default: () => {
                    return [5, 4]
                }
            }
        },
        data() {
            return {
                fixedItem: {},
                info: {},
                model: false,
                modelSrc: '',
                crap: false,
                previews: {},
                cropInfo: {},
                previewStyle: {},
                param: {},
                saveImg: null,
                option: {
                    img: '',
                    size: 1,
                    autoCrop: true,
                    outputType: 'png',
                    fixed: true, //是否开启截图框宽高固定比例
                    demo: '', //示例图
                    fixedNumber: this.fixedNumber,
                    full: true, //是否输出原图比例的截图
                    info: true,
                    infoTrue: true, //true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                    canMove: true,
                    fixedBox: false,
                    original: false, //上传图片按照原始比例渲染
                    canMoveBox: true, //截图框能否拖动
                    // 只有自动截图开启 宽度高度才生效
                    // autoCropWidth: 300,
                    // autoCropHeight: 240,
                    centerBox: true, //截图框是否被限制在图片里面
                    high: true, //是否按照设备的dpr 输出等比例图片
                    maxImgSize: 2000 //限制图片最大宽度和高度
                }
            }
        },
        created() {
            this.param = this.$options.propsData.option || {}
            this.option = {
                ...this.option,
                ...this.param
            }

            this.saveImg = this.$options.propsData.saveImg
        },
        mounted() {
            if (this.option.imgurl > '') {
                this.getBase64ByImgUrl(this.option.imgurl)
            }
            //默认使用第一种截图框
            if (this.option.fixedList) {
                this.switchType(this.option.fixedList[0])
            }
        },
        methods: {
            switchType(item) {
                this.option.fixedNumber = item.fixedNumber
                this.fixedItem = item
                this.refreshCrop()
            },
            /**
             * 刷新截图区域
             */
            refreshCrop() {
                // clear
                this.$refs.cropper.refresh()
            },
            changeScale(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            rotateLeft() {
                this.$refs.cropper.rotateLeft()
            },
            rotateRight() {
                this.$refs.cropper.rotateRight()
            },
            finish(type) {
                // 输出
                // var test = window.open('about:blank')
                // test.document.body.innerHTML = '图片生成中..'
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob(data => {
                        var img = window.URL.createObjectURL(data)
                        this.model = true
                        this.modelSrc = img
                    })
                } else {
                    this.$refs.cropper.getCropData(data => {
                        this.model = true
                        this.modelSrc = data
                    })
                }
            },
            // 实时预览函数
            realTime(data) {
                this.previews = data
                var cropper = this.$refs.cropper
                if (cropper) {
                    this.cropInfo = cropper.cropInfo
                }
                this.previewStyle = {
                    width: this.previews.w + 'px',
                    height: this.previews.h + 'px',
                    overflow: 'hidden',
                    zoom: 350 / this.previews.w
                }
            },

            // finish2(type) {
            //   this.$refs.cropper2.getCropData(data => {
            //     this.model = true;
            //     this.modelSrc = data;
            //   });
            // },
            // finish3(type) {
            //   this.$refs.cropper3.getCropData(data => {
            //     this.model = true;
            //     this.modelSrc = data;
            //   });
            // },
            down(type) {
                // event.preventDefault()
                var aLink = document.createElement('a')
                aLink.download = '剪切图片'
                // 输出
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob(data => {
                        this.downImg = window.URL.createObjectURL(data)
                        aLink.href = window.URL.createObjectURL(data)
                        aLink.click()
                    })
                } else {
                    this.$refs.cropper.getCropData(data => {
                        this.downImg = data
                        aLink.href = data
                        aLink.click()
                    })
                }
            },

            uploadImg(e, num) {
                //上传图片
                // this.option.img
                var file = e.target.files[0]
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                    return false
                }
                var reader = new FileReader()
                reader.onload = e => {
                    let data
                    if (typeof e.target.result === 'object') {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(
                            new Blob([e.target.result])
                        )
                    } else {
                        data = e.target.result
                    }
                    this.option.img = data
                }
                // 转化为base64
                // reader.readAsDataURL(file)
                // 转化为blob
                reader.readAsArrayBuffer(file)
            },
            /**
             * 加载图片
             */
            getBase64ByImgUrl(url) {
                var self = this
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    img = new Image()
                img.crossOrigin = 'Anonymous'
                img.onload = function() {
                    canvas.height = img.height
                    canvas.width = img.width
                    ctx.drawImage(img, 0, 0)
                    var dataURL = canvas.toDataURL('image/png')
                    // console.log('base64-dataUrl: ', dataURL)
                    // callback(dataURL)
                    self.option.img = dataURL
                    canvas = null
                }
                img.src = url
            },
            /**
             * 图片保存
             */
            save() {
                var self = this
                var param = { type: (this.fixedItem || {}).type }
                this.$refs.cropper.getCropBlob(data => {
                    self.$emit('saveImg', { blobData: data, param })
                    self.saveImg({ blobData: data, param }, info => {
                        self.info = info
                    })
                })
            },
            closeWin: function() {
                this.$layerUtil.closeWin(this)
            }
        }
    }
</script>

<style lang="scss">
    .sxh-cropper {
        margin: 0;
        padding: 5px;
        width: 100%;

        .cut {
            width: 500px;
            height: 400px;
            margin: 20px auto;
        }

        .preview {
            margin: 20px auto;
        }

        .test-button {
            display: flex;
            flex-wrap: wrap;
            padding-left: 20px;

            label {
                border-radius: 4px;
                margin: 0 10px;
            }

            .el-button {
                min-width: 40px;
                padding: 5px;
            }
        }

        @keyframes slide {
            0% {
                background-position: 0 0;
            }

            100% {
                background-position: -100% 0;
            }
        }
    }
</style>
