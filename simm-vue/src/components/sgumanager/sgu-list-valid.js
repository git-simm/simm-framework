let disabledArr = [];
export default {
    name: "sgu-list-handler",
    methods: {
        /**
         * 页面校验
         */
        modeValid(mode) {
            return this.pageMode === Number(mode);
        },
        /**
         * 数据权限验证，兼容新旧数据(角色归属细化)
         */
        dataAuth(item) {
            var userInfo = this.$store.state.userInfo;
            if (userInfo.id === item.creatorId) {
                //创建人可以直接控制自己的数据
                return true;
            }
            //角色是否匹配，管理权分配
            return item.creatorRole === userInfo.roleType;
        },

        checkEdit: function (item) {
            //状态等于3的时候，有编辑权限则允许编辑 || (总部人员编辑总部数据、省级人员编辑省级数据)
            var userInfo = this.$store.state.userInfo;
            return (
                ((0 === item.processStatus || -2 === item.processStatus) &&
                    item.creatorId === userInfo.id) ||
                (3 == item.processStatus && this.dataAuth(item))
            );
        },
        auditAuth: function (item) {
            return 3 === item.processStatus && this.dataAuth(item);
        },
        canOnSale(sgu) {
            //上架或待上架状态则不必处理
            if (sgu.onSale == 1 || sgu.onSale == 2) {
                return true;
            }
            var dateCreate = new Date(sgu.createAt);
            var dateEnd = new Date("2019-12-08 00:00:00");
            //团购 2019-12-08 00:00:00 以前的数据不允许再编辑
            if (sgu.distributionType === 0 && dateCreate < dateEnd) {
                return false;
            }
            return !disabledArr.includes(sgu.id);
        }
    }
}