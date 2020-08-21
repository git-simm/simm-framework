import viewBaseInfo from "./controls/view-base-info";
import viewImg from "./controls/view-img";
import prodPriceList from "./controls/prod-price-list";
import priceAuditList from "./controls/price-audit-list";
import sguList from "../../sgumanager/sgu-list";
import baseMixin from "@/common/mixins/baseMixin";
import requestMixin from "@/common/mixins/requestMixin";
import prodCommonHandler from "@/components/prod/prodmanage/prod-common-handler";
import prodAnalysis from "@/components/prod/analysis/prod-analysis";
export default {
    mixins: [baseMixin, requestMixin, prodCommonHandler],
    components: {
        viewBaseInfo,
        viewImg,
        prodPriceList,
        priceAuditList,
        sguList,
        prodAnalysis
    },
    props: {
        //查看参数
        viewParam: {
            type: Object,
            required: false,
            default: null
        }
    },
    data: function () {
        return {
            id: this.viewParam ? this.viewParam.id : Number(this.$route.params.id),
            activeName: "first",
            formData: {},
            baseData: {
                isAudit: false,
                prodCity: null,
                cityIsPayByBalance: false
            },
        };
    },
    mounted() {
        //获取明细信息
        var self = this;
        this.getProInfo(data => {
            //获取城市开关
            if (data.prodInfo.creator_role === 2) {
                self.getProdCityInfo(data.prodInfo.city_id, () => {
                    self.baseData.isAudit = self.isAudit;
                    self.baseData.prodCity = self.prodCity;
                    self.baseData.cityIsPayByBalance = Boolean(self.prodCity.isPayByBalance);
                });
            }
            self.$refs.detailBase.initData(data);
            self.$refs.imgList.initData(data);
            //审批界面使用
            if (self.$refs.realImg) {
                self.$refs.realImg.updatePicList(data, data.realPicList);
            }
        });
    },
    computed: {
        year: function () {
            var y = new Date();
            return y.getFullYear();
        },
        isZb: function () {
            //是否为总部人员
            return this.$store.state.userInfo.roleType === 0;
        }
    },
    methods: {
        getProInfo: function (callback) {
            var self = this;
            this.$httpUtil.post({
                url: "/prodInfo/view.json",
                data: {
                    id: self.id
                },
                contentType: "form", //json,form,multipart
                succ: function (data) {
                    self.formData = data.data;
                    self.formData.prodInfo.audits = self.formData.audits;
                    //价格是否允许编辑
                    //self.calcPriceCanEdit();
                    data.data.prodInfo.purchase_supply_id &&
                        (self.formData.purchase_supply_id =
                            data.data.prodInfo.purchase_supply_id);
                    // self.formData.selectTags = data.data.prodLablelist;
                    self.formData.is_pay_on_delivery = Boolean(
                        data.data.prodInfo.is_pay_on_delivery
                    );
                    self.produserlevelprice = data.data.produserlevelprice;
                    self.formData.produserlevelprice = data.data.produserlevelprice;
                    if (
                        (self.produserlevelprice || []).length > 0 &&
                        (data.data.prodInfo.creator_role == 2 ||
                            data.data.prodInfo.creator_role == 3)
                    ) {
                        var cityLevel = self.produserlevelprice.find(
                            a => a.admin_shop_id == 1
                        );
                        if (!cityLevel) {
                            cityLevel = data.data.produserlevelprice[0];
                        }
                        //判断数据归属是否为城市维度(城市维度，主表数据展示最后有效的城市价格信息)
                        self.formData.prodInfo.sub_account_prod_price =
                            cityLevel.sub_account_prod_price;
                        self.formData.prodInfo.sub_account_proportion =
                            cityLevel.sub_account_proportion;
                        self.formData.prodInfo.platform_service_fee =
                            cityLevel.platform_service_fee;
                        self.formData.prod_price = cityLevel.prod_price;
                        self.formData.prodInfo.isOnSale = cityLevel.status == 1;
                        self.formData.prodInfo.valid = cityLevel.valid == 1;
                    }
                    //回调处理
                    if (callback) {
                        callback(self.formData);
                    }
                }
            });
        },
        getLableData: function () {
            var self = this;
            this.$httpUtil.post({
                url: "/labelinfo/list.json",
                data: {},
                contentType: "form", //json,form,multipart
                succ: function (data) {
                    self.formData.dynamicTags = data.data;
                }
            });
        }
    }
};