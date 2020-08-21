<template>
  <div class="col-sm-12">
    <p class="text-red" v-if="supply_type == 2">自营供应商的支付方式为账期支付，给食享会的大品商品价格不在此处维护</p>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="50px"
      class="demo-ruleForm prod_price"
    >
      <h4 class="text-theme">
        启用采购区域
        <span>
          <span style="margin-right:50px;">
            <el-switch
              :disabled="baseData.disabled || $route.params.auditFlag == 3"
              :width="40"
              v-model="allSale"
              @change="countryChange"
              active-color="#13ce66"
              inactive-color="#cccccc"
              :active-text="allSale ? `全部启用` : `全部禁用`"
            ></el-switch>
          </span>
        </span>
      </h4>
      <div style="max-height:350px;overflow:auto;">
        <el-collapse v-for="(item, index) in showSiteList" :key="'site' + index">
          <el-collapse-item :title="item.site_name" :name="item.id">
            <template slot="title">
              <span>{{ item.site_name }}</span>
              <span>
                <el-switch
                  @click.native.stop
                  :disabled="baseData.disabled || $route.params.auditFlag == 3"
                  :width="40"
                  v-model="item.allSale"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                  :active-text="item.allSale ? `启用订货` : `禁用订货`"
                  @change="siteChange(item)"
                ></el-switch>
              </span>
              <b style="margin-left:20px;" v-if="!isEmpty(item.onSaleList)">允许订货:</b>
              <b style="margin-left:10px;color:#13ce66">
                {{
                item.onSaleList
                }}
              </b>
            </template>
            <el-table
              border
              highlight-current-row
              ref="multipleTable"
              :data="item.cityList"
              style="width: 100%;margin-top:10px;"
            >
              <el-table-column prop="level_name" width="120" label="城市" :key="Math.random()"></el-table-column>
              <el-table-column
                :key="Math.random()"
                v-if="formData.is_sub_account !== 1"
                prop="prod_price"
                width="240"
                label="订货价(成本价)"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :key="`costprice-${scope.row.id}`"
                    :controls="false"
                    :min="0"
                    :debounce="700"
                    :disabled="
                      $route.params.auditFlag == 3 ||
                        baseData.disabled ||
                        !scope.row.status
                    "
                    v-model="scope.row.prod_price"
                  >
                    <template slot="append">元/{{ formData.unit_name }}</template>
                  </el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                :key="Math.random()"
                v-if="formData.is_sub_account === 1"
                prop="platform_service_fee"
                width="240"
                label="平台服务费"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :key="`platform_service_fee-${scope.row.id}`"
                    :controls="false"
                    :min="0"
                    :debounce="700"
                    :disabled="
                      $route.params.auditFlag == 3 ||
                        baseData.disabled ||
                        !scope.row.status ||  entity.isAgent==1
                    "
                    v-model="scope.row.platform_service_fee"
                    @change="recalculateServiceFee($event, scope.row)"
                  >
                    <template slot="append">元/{{ formData.unit_name }}</template>
                  </el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                :key="Math.random()"
                v-if="formData.is_sub_account === 1"
                prop="sub_account_prod_price"
                width="240"
                label="分账销售价"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :key="`saleprice-${scope.row.id}`"
                    :controls="false"
                    :min="0"
                    :debounce="700"
                    :disabled="
                      $route.params.auditFlag == 3 ||
                        baseData.disabled ||
                        !scope.row.status
                    "
                    v-model="scope.row.sub_account_prod_price"
                    @change="recalculateSubAccountProdPrice($event, scope.row)"
                  >
                    <template slot="append">元/{{ formData.unit_name }}</template>
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                :key="Math.random()"
                v-if="formData.is_sub_account === 1 && entity.isAgent===0"
                prop="sub_account_proportion"
                width="240"
                label="平台比例"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :key="`proportion-${scope.row.id}`"
                    :controls="false"
                    :debounce="700"
                    :disabled="true"
                    v-model="scope.row.sub_account_proportion"
                  >
                    <template slot="append">%</template>
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                :key="Math.random()"
                v-if="formData.is_sub_account === 1 && entity.isAgent===1"
                prop="platformRatio"
                width="240"
                label="平台比例"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :key="`proportion-${scope.row.id}`"
                    :controls="false"
                    :debounce="700"
                    :disabled="true"
                    v-model="entity.platformRatio"
                  >
                    <template slot="append">%</template>
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="min_amount" width="240" label="起订量" :key="Math.random()">
                <template slot-scope="scope">
                  <el-input-number
                    :key="`min-amount-${scope.row.id}`"
                    :controls="false"
                    :min="0"
                    :debounce="0"
                    :disabled="
                      $route.params.auditFlag == 3 ||
                        baseData.disabled ||
                        formData.prodType == 3 ||
                        !scope.row.status
                    "
                    v-model="scope.row.min_amount"
                  >
                    <template slot="append">{{ formData.unit_name }}</template>
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column width="120" label="允许订货" :key="Math.random()">
                <template slot="header">
                  <span>允许订货</span>
                  <sxh-popover tooltip="允许订货以后<br/>1、允许下采购订单；2、允许商品上架售卖；"></sxh-popover>
                </template>
                <template slot-scope="scope">
                  <el-switch
                    :disabled="
                      baseData.disabled || $route.params.auditFlag == 3
                    "
                    v-model="scope.row.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="change(item, scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <!-- 非直购供应商允许解绑 -->
              <el-table-column
                width="120"
                label="绑定供应商"
                :key="Math.random()"
                v-if="
                  $route.params.auditFlag == 3 &&
                    formData.is_direct_purchasing === 0
                "
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.valid"
                    :disabled="baseData.disabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="unbindChange(item, scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "prodPriceSetting",
  props: {
    baseData: {
      checkedstatus: [],
      disabled: {
        type: Boolean,
        default: false
      }
    },
    entity: {}
  },
  watch: {
    entity: {
      handler: function(val) {
        if (!this.baseData.disabled) {
          this.baseInfoChange(val);
        }
      },
      deep: true
    }
  },
  data() {
    return {
      roleType: this.$store.state.userInfo.roleType,
      allSale: false,
      supply_type: this.$store.state.userInfo.supply_type,
      rules: {
        prod_price: [
          {
            type: "number",
            required: true,
            message: "请输入正确的商品价格",
            trigger: "blur"
          }
        ],
        platform_service_fee: [
          {
            type: "number",
            required: true,
            message: "请输入正确的平台服务费",
            trigger: "blur"
          }
        ],
        sub_account_prod_price: [
          {
            type: "number",
            required: true,
            message: "请输入正确的商品分账销售价格",
            trigger: "blur"
          }
        ],
        sub_account_proportion: [
          {
            type: "number",
            required: true,
            message: "请输入正确的商品分账比例",
            trigger: "blur"
          }
        ],
        purchase_supply_prod_number: [
          {
            required: true,
            message: "请输入采购商品",
            trigger: "change"
          }
        ],
        min_amount: [
          {
            type: "integer",
            required: true,
            message: "请输入正确的起订量（整数，非空）",
            trigger: "blur"
          }
        ],
        specification: [
          {
            required: true,
            message: "请填写规格",
            trigger: "blur"
          }
        ],
        qdl: [
          {
            required: true,
            type: "number",
            message: "请输入起订量",
            trigger: "blur"
          },
          {
            validator: this.checkNum,
            trigger: "blur"
          }
        ]
      },
      siteList: [],
      showSiteList: [],
      choosedSite: [],
      formData: {
        prodId: "",
        produserlevelprice: [],
        tableData: [],
        is_sub_account: "",
        platform_service_fee: "",
        sub_account_prod_price: "",
        sub_account_proportion: "",
        status: "",
        valid: "",
        platformRatio: 0,
        payCommissionFee: 0 //支付手续费 （销售价*0.6%）
      }
    };
  },
  created() {
    this.formData = {
      ...this.formData,
      ...this.entity
    };
  },
  methods: {
    isEmpty(val) {
      return this.$commonUtil.valid.isEmpty(val);
    },
    /**
     * 输入值处理
     */
    changeCode(row, field) {
      this.$nextTick(() => {
        if (row[field] !== null) {
          var re = /[^\d.]/g;
          var content = row[field] + "";
          if (content.indexOf(".") > 0) {
            var arr = content.split(".");
            var len = arr.length;
            if (len > 1) {
              content = arr[0] + "." + arr[1];
            }
          }
          row[field] = content.replace(re, "");
        }
      });
    },
    /**
     * 基本信息发生改变
     */
    baseInfoChange(val) {
      var self = this;
      this.formData.unit_name = val.unit_name;
      this.formData.prodType = val.prodType;
      this.formData.is_sub_account = val.is_sub_account;
      this.formData.is_direct_purchasing = val.is_direct_purchasing;
      this.formData.prodId = val.id;
      //价格或起订量发生改变,触发刷新逻辑
      var changeValid = (changeFunc, callback, field) => {
        if (!changeFunc()) return;
        callback();
        // 未保存过订货价信息，则每次都刷新定价
        self.siteList.forEach(site => {
          site.cityList.forEach(city => {
            self.wrapCityData(city, field);
          });
        });
      };
      changeValid(
        () => this.formData.prod_price != val.prod_price,
        () => (this.formData.prod_price = val.prod_price),
        "prod_price"
      );
      changeValid(
        () => this.formData.platform_service_fee != val.platform_service_fee,
        () => (this.formData.platform_service_fee = val.platform_service_fee),
        "platform_service_fee"
      );
      changeValid(
        () => this.formData.qdl != val.qdl,
        () => (this.formData.qdl = val.qdl),
        "qdl"
      );
      changeValid(
        () =>
          this.formData.sub_account_prod_price != val.sub_account_prod_price,
        () =>
          (this.formData.sub_account_prod_price = val.sub_account_prod_price),
        "sub_account_prod_price"
      );
      changeValid(
        () =>
          this.formData.sub_account_proportion != val.sub_account_proportion,
        () =>
          (this.formData.sub_account_proportion = val.sub_account_proportion),
        "sub_account_proportion"
      );
      if (this.roleType == 2 || this.roleType == 3) {
        //城市 或 直购时，监听允许采购 或 绑定状态的变化
        changeValid(
          () => this.formData.status != val.isOnSale,
          () => (this.formData.status = val.isOnSale),
          "status"
        );
        // 监听 绑定状态
        changeValid(
          () => this.formData.valid != val.valid,
          () => (this.formData.valid = val.valid),
          "valid"
        );
      }
    },
    /**
     * 初始化组件数据
     */
    initData(entity, mode) {
      this.formData = {
        ...this.formData,
        ...entity
      };
      var self = this;
      this.getCityList(
        () => {
          self.siteList.forEach(site => {
            site.cityList.forEach(city => {
              //self.wrapCityData(city);
              self.initCityData(city);
              //change改变城市状态
              self.change(site, city);
            });
          });
        },
        this.formData.produserlevelprice,
        mode
      );
    },
    /**
     * 初始化数据
     */
    initCityData(city) {
      var self = this;
      if (self.supply_type == 3) {
        city.cost_price = "";
      }
      var levelPrice = self.formData.produserlevelprice.find(
        a => a.admin_shop_id == city.admin_shop_id
      );
      if (levelPrice) {
        city.levelInfo = levelPrice;
        city.status = Boolean(levelPrice.status);
        city.valid = Boolean(levelPrice.valid);
        city.oriValid = Boolean(levelPrice.valid);
      }
      // 城市 创建 || 编辑 时 城市绑定状态 = 是否订货
      // if (!this.$route.params.auditFlag || this.$route.params.auditFlag == 0) {
      //   city.valid = city.status;
      // }
      //加载启动采购的数据
      if (levelPrice && city.status) {
        city.prod_price = levelPrice.prod_price;
        city.platform_service_fee = levelPrice.platform_service_fee;
        city.min_amount = levelPrice.min_amount;
        city.sub_account_prod_price = levelPrice.sub_account_prod_price;
        city.sub_account_proportion = levelPrice.sub_account_proportion;
        if (self.supply_type == 3) {
          city.cost_price = levelPrice.cost_price;
        }
      } else {
        city.prod_price = self.formData.prod_price;
        city.platform_service_fee = self.formData.platform_service_fee;
        city.min_amount = self.formData.qdl;
        city.sub_account_prod_price = self.formData.sub_account_prod_price;
        city.sub_account_proportion = self.formData.sub_account_proportion;
      }
    },
    // 效验金额
    checkPrice(rule, value, callback) {
      if (rule.obj.status && !Number(value)) {
        return callback(new Error("请正确填写订货价"));
      } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,6})?$/.test(value)) {
        return callback(new Error("订货单价最多6位小数"));
      } else if (Number(this.formData.prod_price) < Number(value)) {
        return callback(new Error("不能高于采购价"));
      } else {
        callback();
      }
    },
    // 效验起订量
    checkNum(rule, value, callback) {
      if (this.formData.prodType != 3) {
        if (rule.obj.status && (!Number(value) || Number(value) < 1)) {
          return callback(new Error("请正确填写起订量"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    /**
     * 组装城市数据
     */
    wrapCityData(city, field) {
      var self = this;
      //其他数据取单据信息
      if (field) {
        switch (field) {
          case "prod_price":
            city.prod_price = self.formData.prod_price;
            break;
          case "platform_service_fee":
            city.platform_service_fee = self.formData.platform_service_fee;
            city.sub_account_prod_price = self.formData.sub_account_prod_price;
            break;
          case "qdl":
            city.min_amount = self.formData.qdl;
            break;
          case "sub_account_prod_price":
            city.sub_account_prod_price = self.formData.sub_account_prod_price;
            city.platform_service_fee = self.formData.platform_service_fee;
            break;
          case "sub_account_proportion":
            city.sub_account_proportion = self.formData.sub_account_proportion;
            break;
          case "status":
            city.status = self.formData.status;
            if (self.formData.processStatus == 3) {
              if (city.status) {
                city.valid = Boolean(self.formData.status);
              } else {
                if (!self.formData.valid) {
                  city.valid = Boolean(self.formData.status);
                }
              }
            }
            break;
          case "valid":
            city.valid = self.formData.valid;
            break;
        }
      } else {
        city.prod_price = self.formData.prod_price;
        city.min_amount = self.formData.qdl;
        city.sub_account_prod_price = self.formData.sub_account_prod_price;
        city.sub_account_proportion = self.formData.sub_account_proportion;
        city.platform_service_fee = self.formData.platform_service_fee;
      }
      if (
        !this.formData.tableData.some(
          a => a.admin_shop_id == city.admin_shop_id
        )
      ) {
        this.formData.tableData.push(city);
      }
    },
    /**
     * 获取省级数据
     */
    getProviceList(citys, callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/groupprod/list.json",
        succ: function(data) {
          //对省级数据进行过滤
          var list = Array.from(new Set(citys.map(a => a.supply_site_id)));
          if (list.includes(99)) {
            //直购则拼接全国数据
            data.data.push({
              id: 99,
              site_name: "全国",
              status: 0
            });
          }
          self.siteList = data.data.filter(a => list.includes(a.id));
          self.siteList.forEach(site => {
            self.$set(site, "allSale", false);
            site.cityList = citys.filter(
              city => city.supply_site_id == site.id
            );
            site.cityList.forEach(city => {
              self.$set(city, "status", false);
              self.$set(city, "valid", false);
              self.$set(city, "addressProvince", site.site_name);
              self.wrapCityData(city);
            });
            self.change(site, null);
          });
          //获取当前的城市信息
          self.showSiteList = self.siteList;
          if (callback) {
            callback();
          }
        }
      });
    },
    /**
     * 获取城市数据
     */
    getCityList(callback, userLevelPrices, mode) {
      var self = this;
      var prodId = self.$route.params.id || "";
      userLevelPrices = userLevelPrices || [];
      this.$httpUtil.post({
        url: "/supplyUserLevel/list2.json",
        contentType: "form",
        data: {
          page: 0,
          pagesize: 9999,
          prodId: prodId,
          status: 1
        },
        succ: function(data) {
          self.cityList = data.data || [];
          //过滤总部/直购账号的代理城市信息
          if (self.roleType == 0 || self.roleType == 3) {
            self.cityList = self.cityList.filter(city => city.is_agent == 0);
          }
          if (mode == "view") {
            //查看模式下，只加载数据库里保存了的数据
            self.cityList = (data.data || []).filter(c =>
              userLevelPrices.some(
                level => level.admin_shop_id == c.admin_shop_id
              )
            );
          } else {
            if (self.roleType == 3 && self.cityList.length > 0) {
              //拼接一条全国的城市数据
              var country = self.cityList.find(a => a.admin_shop_id == 1);
              //直购使用全国这个城市，为包邮模式
              country.supply_site_id = 99;
              country.deliveryType = 2;
              self.cityList = [country];
            }
          }
          //关联省级
          self.getProviceList(self.cityList, callback);
        }
      });
    },
    /**
     * 省级上下架
     */
    siteChange(site) {
      site.cityList.forEach(c => {
        c.status = site.allSale;
        if (site.allSale) {
          c.valid = site.allSale;
        }
      });
      this.change(site);
    },
    /**
     * 城市-商品绑定状态
     */
    unbindChange(site, city) {
      var self = this;
      if (city.valid == 0 && city.status == 1) {
        city.status = 0;
        this.change(site, city);
      }
    },

    /**
     * 全国上下架
     */
    countryChange(state) {
      this.siteList.forEach(s => {
        s.allSale = state;
        this.siteChange(s);
      });
    },
    /**
     * 上架状态改变
     */
    change(site, city) {
      //改变上架状态
      // if (this.$route.params.auditFlag == 1 && city && city.valid == 0 && city.status == 1) {
      //     return callback(new Error("商品在该城市已解绑供应商不允许订货!"));
      // }
      if (city) {
        if (this.formData.processStatus == 3) {
          if (city.status) {
            city.valid = Boolean(city.status);
          } else {
            if (!city.oriValid) {
              city.valid = Boolean(city.status);
            }
          }
        } else {
          city.valid = Boolean(city.status);
        }
      }
      var onSaleList = site.cityList
        .filter(a => a.status)
        .map(a => a.level_name);
      if (onSaleList && onSaleList.length > 0) {
        this.$set(site, "onSaleList", onSaleList.join("、"));
      } else {
        this.$set(site, "onSaleList", "");
      }
      this.calcOnSale();
    },
    /**
     * 计算上架状态
     */
    calcOnSale() {
      this.siteList.forEach(site => {
        if (site.cityList) {
          site.allSale = (site.cityList || []).every(a => a.status);
        }
      });
      this.allSale = this.siteList.every(a => a.allSale);
    },
    /**
     * 数据校验
     */
    priceValid(userLevelPrice) {
      if (
        Number(userLevelPrice.prod_price) > Number(this.formData.prod_price)
      ) {
        this.$commonUtil.valid.throwEx(
          `${userLevelPrice.cityName} 订货价不能高于订货单价`
        );
      }
    },

    /**
     * 分账比例校验
     */
    proportionValid(userLevelPrice) {
      let self = this;
      if (self.formData.is_sub_account == 1) {
        let value = userLevelPrice.sub_account_proportion;
        if (value < 0) {
          this.$commonUtil.valid.throwEx(
            `${userLevelPrice.cityName} 平台比例必须大于或等于0,请正确填写服务费和销售价`
          );
        } else if (value >= 99.4) {
          this.$commonUtil.valid.throwEx(
            `${userLevelPrice.cityName} 平台比例必须小于99.4%`
          );
        } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
          this.$commonUtil.valid.throwEx(
            `${userLevelPrice.cityName} 平台比例最多2位小数`
          );
        }
        self.formData.payCommissionFee =
          Math.round(userLevelPrice.sub_account_prod_price * 0.006 * 100) / 100;
        if (
          self.formData.payCommissionFee >=
          parseFloat(userLevelPrice.prod_price).toFixed(2)
        ) {
          self.$commonUtil.valid.throwEx(
            `${userLevelPrice.cityName} 平台服务费过高，供应商无法支付分账手续费，请重新设置`
          );
        }
      }
    },

    /**
     * 获取城市订价信息
     */
    getCityPriceData(callback) {
      var self = this;
      var userLevelPrice = [];
      var userLevelPriceItem = null;
      (self.showSiteList || []).forEach(site => {
        site.cityList.forEach(city => {
          userLevelPriceItem = {};
          userLevelPriceItem.min_amount = Number(city.min_amount) || 0;
          userLevelPriceItem.prod_price = Number(city.prod_price) || 0;
          userLevelPriceItem.platform_service_fee =
            Number(city.platform_service_fee) || 0;
          userLevelPriceItem.sub_account_prod_price =
            Number(city.sub_account_prod_price) || 0;
          userLevelPriceItem.sub_account_proportion =
            Number(city.sub_account_proportion) || 0;
          if (self.supply_type == 3) {
            userLevelPriceItem.cost_price = Number(city.cost_price) || 0;
          }
          userLevelPriceItem.status = Number(city.status);
          userLevelPriceItem.valid = Number(city.valid);
          userLevelPriceItem.supply_user_level_id = city.id;
          userLevelPriceItem.cityName = city.level_name;
          userLevelPrice.push(userLevelPriceItem);
          self.proportionValid(userLevelPriceItem);
          // if (userLevelPriceItem.status) {
          //   self.priceValid(userLevelPriceItem);
          // }
        });
      });
      var diffs = [];
      (userLevelPrice || []).forEach(a => {
        if (Number(a.prod_price) != Number(self.formData.prod_price)) {
          diffs.push(a.cityName);
        }
      });
      if (diffs.length > 0) {
        //验证价格不匹配，进行提示
        this.$commonUtil.message.confirm(
          `[${diffs.join(",")}] 订货价与商品订货单价不相等，是否继续提交?`,
          () => {
            if (callback) {
              callback(userLevelPrice);
            }
          }
        );
      } else {
        if (callback) {
          callback(userLevelPrice);
        }
      }
      //校验价格是否不一致
      return userLevelPrice;
    },

    //服务费变化重新计算分账比例
    recalculateServiceFee: function(data, row) {
      let self = this;
      if (self.formData.is_sub_account == 1) {
        row.prod_price = row.sub_account_prod_price - data;
        let tempVal = (data / row.sub_account_prod_price) * 100;
        let realVal = parseFloat(tempVal).toFixed(2);
        row.sub_account_proportion = parseFloat(realVal);
      }
    },
    //销售价变化重新计算分账比例
    recalculateSubAccountProdPrice: function(data, row) {
      if (this.entity.isAgent === 0) {
        row.prod_price = data - row.platform_service_fee;
        let tempVal = (row.platform_service_fee / data) * 100;
        let realVal = parseFloat(tempVal).toFixed(2);
        row.sub_account_proportion = parseFloat(realVal);
      } else {
        row.platform_service_fee = parseFloat(
          (data * this.entity.platformRatio) / 100
        ).toFixed(2);
        row.prod_price = data - row.platform_service_fee;
      }
    }
  }
};
</script>

<style>
.prod_price .el-input-number .el-input {
  display: inline-table !important;
  padding-top: 5px;
}
</style>
