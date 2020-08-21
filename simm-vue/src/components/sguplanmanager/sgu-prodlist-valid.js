let math = require("mathjs");
import moment from "moment";

/**
 * 商品验证
 */
let formatter = "YYYY-MM-DD 00:00:00";
export default {
    methods: {
        arrivalDateChange(val, row) {
            if (val == null || val === "") {
                row.arrivalDate = "";
            } else {
                row.arrivalDate = moment(val).format(formatter);
            }
        },
        /**
         * 不可用的预计到货时间控制
         * @param {*} time
         */
        disableArrivalDate(time) {
            var getTime = date => {
                return new Date(moment(date).format(formatter)).getTime();
            };
            try {

                if (this.sgu.onSaleTime > '') {
                    return time.getTime() < getTime(new Date(this.sgu.onSaleTime));
                }
                return time.getTime() < getTime(new Date());
            } catch (e) {
                return time.getTime() < getTime(new Date());
            }
        },
    }
};
