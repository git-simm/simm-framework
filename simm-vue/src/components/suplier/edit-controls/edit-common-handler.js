export default {
  name: "EditCommonHandler",
  methods: {
    /**
     * 基础数据初始化
     * @param {*} entity
     * @param {*} compProp
     */
    baseInitData(entity, compProp) {
      if (this.baseData.mode == "add") {
        //新增时
        entity[compProp] = this.formData;
      } else {
        //修改时
        if (!entity[compProp]) {
          this.$set(entity, compProp, {});
        }
        for (var p in this.formData) {
          this.$set(entity[compProp], p, entity[p]);
        }
        this.formData = entity[compProp];
      }
    },
    /**
     * 获取所有城市数据
     */
    getAllCityList(callback) {
      this.$httpUtil.post({
        url: "/supplyUserLevel/getCityList.json",
        contentType: "form",
        data: {},
        succ: function (data) {
          data.data = data.data.filter(a => a.is_agent === 0 && a.status === 1)
          //关联省级
          if (callback) {
            callback(data.data);
          }
        }
      });
    },
    /**
     * 获取城市数据
     */
    getCityList(callback) {
      this.$httpUtil.post({
        url: "/supplyUserLevel/list2.json",
        contentType: "form",
        data: {
          page: 0,
          pagesize: 9999,
          status: 1
        },
        succ: function (data) {
          data.data = data.data.filter(a => a.is_agent === 0 && a.status === 1)
          //关联省级
          if (callback) {
            callback(data.data);
          }
        }
      });
    },
    /**
     * 获取省级数据
     * @param {*} citys
     */
    getProviceList(citys, callback) {
      var siteList = [];
      this.$httpUtil.post({
        url: "/groupprod/list.json",
        succ: function (data) {
          //对省级数据进行过滤
          var list = Array.from(new Set(citys.map(a => a.supply_site_id)));
          siteList = data.data.filter(a => list.includes(a.id));
          siteList.forEach(site => {
            site.cityList = citys.filter(
              city => city.supply_site_id == site.id
            );
          });
          if (callback) {
            callback(siteList);
          }
        }
      });
    },
    uniqueId() {
      var a = Math.random,
        b = parseInt;
      return (
        Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a())
      );
    }
  }
};
