export default {
  data() {
    return {
      isBatchAdd: false,
      isClearImg: false
    };
  },
  methods: {
    /**
     * 清空图片、视频
     */
    clearImg() {
      this.formDate.main_pic_list = [];
      this.formDate.detail_pic_list = [];
      this.formDate.main_video_list = [];
      this.$refs.mainImg.updatePicList(
        this.formDate,
        this.formDate.main_pic_list
      );
      this.$refs.detailImg.updatePicList(
        this.formDate,
        this.formDate.detail_pic_list
      );
      this.$refs.mainVideo.updateVideoList(
        this.formDate,
        this.formDate.main_video_list,
      );
    },
    /**
     * 是否重复保存
     * @param {*} yes
     * @param {*} no
     */
    isRepeatSave(yes, no) {
      if (this.isBatchAdd) {
        //清空sku信息
        this.formDate.specification = "";
        this.formDate.prod_number = "";
        this.formDate.prod_name = "";
        this.formDate.tax = "";
        this.formDate.category_name = "";
        this.formDate.two_category_name = "";
        this.formDate.unit_name = "";
        this.formDate.prodType = "";
        this.formDate.afterTime = "";
        //复制时，自动清理掉图片
        if (this.isClearImg) {
          this.clearImg();
        }
        if (yes) {
          yes();
        }
      } else {
        if (no) {
          no();
        }
      }
    },
    getSkuInfo: function (skuNumber, callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/base/prod/info/get.json",
        data: {
          prod_number: skuNumber
        },
        contentType: "form", //json,form,multipart
        loading: false,
        succ: function (data) {
          callback(data.data);
        }
      });
    },
    /**
     * 复制商品，取售后时效
     * @param {*} prodId 
     * @param {*} callback 
     */
    getThreeCategoryAfterTime: function (prodId, callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/base/prod/category/threeCategory.json",
        data: {
          id: prodId
        },
        contentType: "form", //json,form,multipart
        succ: function (data) {
          if (callback) {
            callback(data.data.afterTime);
          }
        }
      });
    },
    /**
     * 获取复制的商品信息
     */
    getProInfo: function (prodId, callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/prodInfo/view.json",
        data: {
          id: prodId
        },
        contentType: "form", //json,form,multipart
        succ: function (data) {
          var prodInfo = data.data.prodInfo;
          self.formDate.isPayByBalance = 1;
          self.formDate.is_sub_account = prodInfo.is_sub_account;
          self.formDate.isAgent = prodInfo.isAgent;
          self.formDate.platformRatio = prodInfo.platformRatio;
          self.formDate.sub_account_proportion =
            prodInfo.sub_account_proportion;
          self.formDate.sub_account_prod_price =
            prodInfo.sub_account_prod_price;
          self.formDate.prod_price = prodInfo.prod_price;
          self.formDate.platform_service_fee = prodInfo.platform_service_fee;
          self.formDate.qdl = prodInfo.qdl;
          self.formDate.afterTime = prodInfo.afterTime;
          self.formDate.rrp = prodInfo.rrp || "";
          self.formDate.purchase_price = prodInfo.purchase_price || "";
          self.formDate.prod_name = prodInfo.prod_name;
          self.formDate.prod_number = prodInfo.prod_number;
          self.formDate.specification = prodInfo.specification;
          self.formDate.unit_name = prodInfo.unit_name;
          self.formDate.note = prodInfo.note;
          self.formDate.tax = prodInfo.tax;
          self.formDate.box_gauge = prodInfo.box_gauge;
          self.$set(self.formDate, "category_name", data.data.category_name);
          self.$set(self.formDate, "two_category_name", data.data.two_category_name);
          self.$set(self.formDate, "three_category_name", data.data.three_category_name);
          self.$set(self.formDate, "storage_method", data.data.storage_method);
          self.$set(self.formDate, "quaranteePeriodCode", data.data.quaranteePeriodCode);
          self.$set(self.formDate, "spuId", data.data.spuId);
          self.$set(self.formDate, "spuNumber", data.data.spuNumber);
          self.formDate.unit = prodInfo.unit;
          self.formDate.merchant_model = prodInfo.merchant_model;
          self.formDate.detail_pic = data.data.detail_pic;
          self.formDate.main_pic = data.data.main_pic;
          self.formDate.main_pic_list = data.data.main_pic_list;
          self.formDate.detail_pic_list = data.data.detail_pic_list;
          // 视频信息
          self.formDate.main_video_list = data.data.main_video_list;

          self.$refs.mainImg.updatePicList(
            self.formDate,
            self.formDate.main_pic_list
          );
          self.$refs.detailImg.updatePicList(
            self.formDate,
            self.formDate.detail_pic_list
          );
          // TODO 处理视频数据
          self.$refs.mainVideo.updateVideoList(
            self.formDate,
            self.formDate.main_video_list
          );
          if (callback) {
            callback();
          }
        }
      });
    }
  }
};
