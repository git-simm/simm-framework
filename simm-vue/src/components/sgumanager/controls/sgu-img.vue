<template>
  <section>
    <el-row>
      <el-col :span="8" style="margin-left: 15px">
        <h4 class="text-theme">
          <span style="color:red;">*</span>SGU主图(小图)
          <sxh-img-store
            v-if="!uploaderDisabled"
            :spuList="[formData.spuNumber]"
            :supplyList="[formData.supplyNumber]"
            :sguImageFlag="true"
            :limit="1"
            title="请选择尺寸符合要求的图片"
            @change="mainChangeHandler"
          ></sxh-img-store>
        </h4>
        <ImgUploader
          ref="mainImg"
          :controlDisabled="uploaderDisabled"
          :fileList="formData.mainPicList"
          :multiple="false"
          @change="mainImgChange"
        ></ImgUploader>
        <p></p>
        <el-popover placement="top" trigger="click">
          <img src="/static/img/sguSmall.png" width="900px" />
          <el-button slot="reference">
            <i class="el-icon-view"></i>
            <span>查看示例</span>
          </el-button>
        </el-popover>
        <p class="text-theme" style="margin-top:10px;">提示：图片尺寸为750*600px,背景禁止使用高纯度背景</p>
      </el-col>
      <el-col :span="8" style="margin-left: 18px">
        <h4 class="text-theme">
          SGU主图(大图)
          <sxh-img-store
            v-if="!uploaderDisabled"
            :spuList="[formData.spuNumber]"
            :supplyList="[formData.supplyNumber]"
            :sguImageFlag="true"
            :limit="1"
            title="请选择尺寸符合要求的图片"
            @change="detailChangeHandler"
          ></sxh-img-store>
        </h4>
        <ImgUploader
          ref="detailImg"
          :controlDisabled="uploaderDisabled"
          :fileList="formData.detailPicList"
          :multiple="false"
          @change="detailImgChange"
        ></ImgUploader>
        <p></p>
        <el-popover placement="top" trigger="click">
          <img src="/static/img/sguBig.png" width="900px" />
          <el-button slot="reference">
            <i class="el-icon-view"></i>
            <span>查看示例</span>
          </el-button>
        </el-popover>
        <p class="text-theme" style="margin-top:10px;">提示：图片尺寸为702*384px,选择诱惑力高，突出商品的图片，禁止使用白底</p>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import imgUploader from "./img-uploader";

export default {
  name: "SpuImg",
  components: {
    ImgUploader: imgUploader
  },
  props: {
    baseData: {},
    entity: {}
  },
  data() {
    return {
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      serverURI: this.$store.state.serverURI,
      isStore: false,
      formData: {
        mainPicList: [],
        detailPicList: []
      }
    };
  },
  computed: {
    uploaderDisabled() {
      //草稿状态或者审核通过 都允许修改主图(图片需要推送ES)
      return (
        this.baseData.mode == "view" ||
        this.baseData.mode == "audit" ||
        !this.baseData.modify
      );
    }
  },
  created() {
    this.initData(this.entity);
  },
  //方法列表
  methods: {
    initData(entity) {
      this.formData = {
        ...this.formData,
        ...entity
      };
      this.isStore =
        this.formData.distributionType === this.baseData.distributionMode.store;
      //把图片拆分成主图&详情图
      (this.formData.sguImgs || []).forEach(img => {
        img.url = img.imageUrl;
      });
      //图片初始化一次即可
      if (this.$refs.mainImg && this.formData.mainPicList.length == 0) {
        this.formData.mainPicList = (this.formData.sguImgs || []).filter(
          a => a.imageType == 1
        );
        //先把edit界面的主图数据源赋上值
        entity.mainPicList = this.formData.mainPicList;
        this.$refs.mainImg.updatePicList(
          this.formData,
          this.formData.mainPicList
        );
      }
      if (this.$refs.detailImg && this.formData.detailPicList.length == 0) {
        this.formData.detailPicList = (this.formData.sguImgs || []).filter(
          a => a.imageType == 3
        );
        this.$refs.detailImg.updatePicList(
          this.formData,
          this.formData.detailPicList
        );
      }
    },
    /**
     * 主图选择
     */
    mainChangeHandler(set) {
      this.mainImgChange(
        (Array.from(set) || []).map((url, index) => {
          return {
            url: url,
            sort: index
          };
        })
      );
      this.$refs.mainImg.updatePicList(
        this.formData,
        this.formData.mainPicList
      );
    },
    /**
     * 大图选择
     */
    detailChangeHandler(set) {
      this.detailImgChange(
        (Array.from(set) || []).map((url, index) => {
          return {
            url: url,
            sort: index
          };
        })
      );
      this.$refs.detailImg.updatePicList(
        this.formData,
        this.formData.detailPicList
      );
    },
    mainImgChange(list) {
      this.formData.mainPicList = list;
      this.wrapSguImgs();
      //提交图片
      this.exec("change");
    },
    detailImgChange(list) {
      this.formData.detailPicList = list;
      this.wrapSguImgs();
      //提交图片
      this.exec("change");
    },
    /**
     * sgu图片组装
     */
    wrapSguImgs() {
      var self = this;
      this.formData.sguImgs = [];
      this.formData.mainPicList.forEach(a => {
        self.formData.sguImgs.push({
          imageUrl: a.url,
          sort: a.sort,
          imageType: 1,
          isMainImage: 1
        });
      });
      this.formData.detailPicList.forEach(a => {
        self.formData.sguImgs.push({
          imageUrl: a.url,
          sort: a.sort,
          imageType: 3,
          isMainImage: 1
        });
      });
    },
    getImgData() {
      return {
        sguImgs: this.formData.sguImgs,
        mainPicList: this.formData.mainPicList,
        detailPicList: this.formData.detailPicList
      };
    },
    exec(cmd) {
      //只提交图片信息
      this.$emit(cmd, this.getImgData());
    }
  }
};
</script>

