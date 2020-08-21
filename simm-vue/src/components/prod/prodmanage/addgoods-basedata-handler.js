export default {
  methods: {
    getProdImages: function (prodNumber) {
      let self = this;
      this.$httpUtil.post({
        contentType: "form",
        url: "/prodimage/getLastImages.json",
        data: {
          productNumber: prodNumber
        },
        succ: function (data) {
          let list = data.data;
          list.forEach(item => {
            // if (item.image_type == 1) {
            //   self.formDate.thumbnailsuo_url = item.image_url;
            // }
            if (item.image_type == 2) {
              if (
                !self.formDate.main_pic_list.some(a => a.url == item.image_url)
              ) {
                self.formDate.main_pic_list.push({
                  name: item.id,
                  url: item.image_url
                });
              }
            }
            if (item.image_type == 3) {
              if (
                !self.formDate.detail_pic_list.some(
                  a => a.url == item.image_url
                )
              ) {
                self.formDate.detail_pic_list.push({
                  name: item.id,
                  url: item.image_url
                });
              }
            }
          });
          self.$refs.mainImg.updatePicList(
            self.formDate,
            self.formDate.main_pic_list
          );
          self.$refs.detailImg.updatePicList(
            self.formDate,
            self.formDate.detail_pic_list
          );
        }
      });
    },
    getSupplyData: function (callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/addlistBySku.json",
        contentType: "form",
        data: { prod_number: self.formDate.prod_number },
        succ: function (data) {
          self.supplyData = data.data;
          self.getJgSupply(callback);
        }
      });
    },
    /**
     * 获取加工供应商
     */
    getJgSupply(callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/prodInfo/getJgSupply.json",
        succ: function (data) {
          self.jgSupply = data.data;
          self.jgSupply.is_agent = self.jgSupply.isAgent;
          if (callback) {
            callback();
          }
        }
      });
    }
  }
};
