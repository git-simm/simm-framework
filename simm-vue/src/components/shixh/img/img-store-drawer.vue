<template>
  <el-drawer
    :title="canChoose?`选择商品图`:`商品图库`"
    ref="drawer"
    :visible.sync="drawer"
    :direction="direction"
    :modal-append-to-body="false"
    :destroy-on-close="true"
    size="90%"
    @visibleChange="val => (drawer = val)"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :label="store.label"
        :name="store.name"
        v-for="store in picArr"
        :key="store.name"
      >
        <div v-viewer class="images">
          <template v-for="img in store.imgs">
            <div style="float:left;position:relative;" :key="`div_${store.name}_${img.url}`">
              <img :src="img.url" class="img-border" :key="`img_${store.name}_${img.url}`" />
              <el-checkbox
                v-model="img.checked"
                v-if="canChoose"
                label
                style="position:absolute;top:10px;left:0;"
                @change="val=>chooseHandler(val,img)"
              ></el-checkbox>
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-row style="margin-bottom: 20px;text-align:center;">
      <el-col :span="24">
        <el-button v-if="canChoose" @click="reset">清 空</el-button>
        <el-button v-if="canChoose" type="primary" @click="confirm" title="点击确定将选中的图片引用到商品中">确 定</el-button>
        <el-button @click="close">关 闭</el-button>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script>
import baseMixin from "@/common/mixins/baseMixin";
import selectSku from "@/components/base/prod/info/list";
export default {
  name: "imgStoreDrawer",
  props: {
    direction: {
      type: String,
      default: "rtl"
    },
    canChoose: {
      type: Boolean,
      required: false,
      default: true
    },
    limit: {
      type: Number,
      required: false,
      default: -1
    },
    searchParam: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: { selectSku },
  mixins: [baseMixin],
  data: function(router) {
    return {
      activeName: "2",
      choosedList: new Set(),
      choosedImgList: [],
      picArr: [
        { label: "主图库", name: "2", imgs: [] },
        { label: "详情图库", name: "3", imgs: [] },
        { label: "实物图库", name: "5", imgs: [] }
      ]
    };
  },
  created() {
    if (this.searchParam.sguImageFlag) {
      this.picArr.push(
        { label: "SGU主图-小图", name: "11", imgs: [] },
        { label: "SGU主图-大图", name: "12", imgs: [] }
      );
    }
    if (this.canChoose) {
      this.picArr.push({
        label: "已选列表",
        name: "99",
        imgs: this.choosedImgList
      });
    }
  },
  methods: {
    handleClick(tab, event) {},
    /**
     * 重置选中项
     */
    reset() {
      this.picArr.forEach(a => {
        a.imgs.forEach(img => (img.checked = false));
      });
      this.choosedList.clear();
      this.choosedImgList.length = 0;
    },
    /**
     * 确认
     */
    confirm() {
      if (
        this.choosedList != null &&
        this.limit > -1 &&
        this.choosedList.size > this.limit
      ) {
        this.$commonUtil.valid.throwEx(`只允许选择 ${this.limit} 张图片`);
      }
      this.$emit("change", this.choosedList);
      this.$refs.drawer.closeDrawer();
    },
    close() {
      this.$refs.drawer.closeDrawer();
    },
    /**
     * 选中事件
     */
    chooseHandler(state, img) {
      if (state) {
        this.choosedList.add(img.url);
      } else {
        this.choosedList.delete(img.url);
      }
      var self = this;
      this.choosedImgList.length = 0;
      this.picArr
        .filter(a => a.name < 99)
        .forEach(a => {
          a.imgs
            .filter(img => img.checked)
            .forEach(img => {
              self.choosedImgList.push(img);
            });
        });
    },
    /**
     * 查询(spu列表，sku列表)对应的图片
     */
    getStoreImgs(spuList, skuList, supplyList, sguImageFlag) {
      this.choosedList.clear();
      this.choosedImgList.length = 0;
      var self = this;
      var setImgs = (imgList, tab) => {
        var mainImgs = new Set(
          imgList.filter(a => a.image_type == tab.name).map(a => a.image_url)
        );
        tab.imgs = [];
        mainImgs.forEach(a => {
          tab.imgs.push({
            url: a,
            checked: false
          });
        });
      };
      this.$httpUtil.post({
        url: "/prodimage/getList.json",
        data: {
          spuList: spuList,
          skuList: skuList,
          supplyList: supplyList,
          sguImageFlag: sguImageFlag
        },
        contentType: "form",
        succ: function(data) {
          self.picArr
            .filter(a => a.name < 99)
            .forEach(a => {
              setImgs(data.data, a);
            });
        }
      });
    }
  }
};
</script>
