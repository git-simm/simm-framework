export default {
  methods: {
    /**
     * 根据用户身份获取排序码的基础值
     */
    getInitSortVal() {
      var userInfo = this.$store.state.userInfo;
      var baseVal = 0;
      switch (userInfo.roleType) {
        case 0:
          //总部的数据排在最后面
          baseVal = 6000;
          break;
        case 1:
          //省级的数据排在中间
          baseVal = 3000;
          break;
        case 2:
          //城市的数据排在前面
          baseVal = 0;
          break;
        case 3:
          baseVal = 0;
          break;
      }
      return baseVal;
    },
    /**
     * 验证排序码有效性
     * @param {*} roleType
     * @param {*} sort
     */
    validSort(roleType, sort) {
      if (this.$commonUtil.valid.isEmpty(sort)) {
        this.$commonUtil.valid.throwEx(`排序码不能为空`);
      }
      switch (roleType) {
        case 0:
          //总部的数据排在最后面
          if (sort < 6000) {
            this.$commonUtil.valid.throwEx(`总部SGU的排序码不能小于 6000`);
          }
          break;
        case 1:
          //省级的数据排在中间
          if (sort < 3000 || sort >= 6000) {
            this.$commonUtil.valid.throwEx(
              `省级SGU的排序码取值必须在 3000 到 6000 之间`
            );
          }
          break;
        case 2:
          //城市的数据排在前面
          if (sort >= 3000) {
            this.$commonUtil.valid.throwEx(`城市SGU的排序码取值不能大于 3000`);
          }
          break;
      }
    }
  }
};
