<template>
  <section class="content-section product-add-edit" id="proadd">
    <div class="row">
      <el-form
        :model="formDate"
        :rules="rules"
        ref="formDate"
        label-width="50px"
        class="demo-ruleForm"
      >
        <div class="col-sm-12">
          <h4>基本信息</h4>
          <div class="col-sm-8">
            <div class="el-form-btn-box">
              <div class="col-xs-12 col-sm-6">
                <el-form-item label="供应商" :prop="purchase_supply_id_let" label-width="100px">
                  <el-select
                    v-model="formDate.purchase_supply_id"
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="SupplyDataChange"
                  >
                    <el-option
                      v-for="item in supplyData"
                      :label="item.supply_name"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-xs-12 col-sm-6">
                <el-form-item
                  label="采购商品:"
                  :prop="purchase_supply_prod_number_let"
                  label-width="100px"
                >
                  <el-select
                    clearable
                    :disabled="!formDate.purchase_supply_id"
                    v-model="formDate.purchase_supply_prod_number"
                    filterable
                    remote
                    no-match-text="无数据"
                    placeholder="请选择"
                    :remote-method="supplyNumberChange"
                    :loading="selectloading"
                  >
                    <el-option
                      v-for="item in supplyNumberData"
                      :key="item.id"
                      :item="item"
                      :label="item.prod_name"
                      :value="item.prod_number"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="商品分类" prop="prod_category_id" label-width="100px">
                <el-select v-model="formDate.prod_category_id" placeholder="请选择商品分类">
                  <el-option
                    v-for="item in prodTypeData"
                    :key="item.id"
                    :label="item.prod_category_name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="商品名称" prop="prod_name" label-width="100px">
                <el-input v-model="formDate.prod_name" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="排序值:" prop="sort" label-width="100px">
                <el-input v-model.number="formDate.sort"></el-input>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="SKU编码:" prop="prod_number" label-width="100px">
                <el-input v-model="formDate.prod_number" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="截止订购时间:" label-width="100px" prop="onsale_end_at">
                <el-date-picker v-model="formDate.onsale_end_at" type="datetime" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="规格:" prop="specification" label-width="100px">
                <el-input v-model="formDate.specification" :disabled="supply_type==3"></el-input>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="单位:" prop="unit_name" label-width="100px">
                <el-input v-model="formDate.unit_name"></el-input>
              </el-form-item>
            </div>
            <!-- <div class="col-xs-12 col-sm-6">
              <el-form-item label="商品类型" label-width="100px">
                <el-input disabled :value="supply_type==3?'大品商品（由大品采购商直接发货）':'自采入仓商品'"></el-input>
              </el-form-item>
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6" v-if="supply_type==3">
              <el-form-item label="采购价格" label-width="100px">
                <el-input disabled :value="purchaseProdPrice"></el-input>
              </el-form-item>
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6">
              <el-form-item label="商品编码:" label-width="100px" prop="prod_number" >
                <el-input v-model="formDate.prod_number"></el-input>
              </el-form-item>
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6">
              <el-form-item label="建议零售价:" prop="rrp" label-width="100px">
                <el-input v-model="formDate.rrp"></el-input>
              </el-form-item>
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6">
              <el-form-item label="货到付款:" label-width="100px">
                <el-switch :disabled='supply_type==3'
                  v-model="formDate.is_pay_on_delivery"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </div>-->
            <div class="col-xs-12 col-sm-6">
              <el-form-item label="是否上架:" label-width="100px">
                <el-switch v-model="formDate.is_onsale" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-form-item>
            </div>
            <!-- <div class="col-xs-12 col-sm-6" v-if="userInfo&&userInfo.admin_user_type==2">
              <el-form-item label="所属分站" prop="supply_site_id" label-width="100px">
                <el-select v-model="formDate.supply_site_id" placeholder="请选择">
                  <el-option
                    v-for="item in siteData"
                    :label="item.site_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>-->
            <div class="col-xs-12 col-sm-12">
              <el-form-item label="推荐语:" label-width="100px" prop="recommend_content">
                <el-input type="textarea" :maxlength="500" v-model="formDate.recommend_content"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <!-- <div class="col-sm-12">
          <h4>商品标签</h4>
          <div class="col-sm-8">
            <el-form-item>
              <el-select
                v-model="formDate.selectTags"
                multiple
                filterable
                placeholder="请选择商品标签">
                <el-option
                  v-for="tag in formDate.dynamicTags"
                  :label="tag.label_name"
                  :value="tag.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>-->
        <div class="col-sm-12">
          <h4>缩略图</h4>
          <el-form-item>
            <el-upload
              class="avatar-uploader"
              :action="serverURI+'/file/upload.json'"
              :show-file-list="false"
              :with-credentials="true"
              :data="tokendata"
              :before-upload="beforeupload"
              :on-success="thumbPicSuccess"
            >
              <img v-if="formDate.thumbnailsuo_url" :src="formDate.thumbnailsuo_url" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="col-sm-12">
          <h4>商品主图</h4>
          <el-form-item>
            <el-upload
              :action="serverURI+'/file/upload.json'"
              list-type="picture-card"
              multiple
              :with-credentials="true"
              :data="tokendata"
              :before-upload="beforeupload"
              :on-success="mainPicSuccess"
              :on-remove="handleRemoveMainPic"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="col-sm-12">
          <h4>商品详情图</h4>
          <el-form-item>
            <el-upload
              :action="serverURI+'/file/upload.json'"
              list-type="picture-card"
              multiple
              :with-credentials="true"
              :data="tokendata"
              :before-upload="beforeupload"
              :on-success="detailPicSuccess"
              :on-remove="handleRemoveDetailPic"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="col-sm-12">
          <h4>价格设置</h4>
          <div class="col-sm-12">
            <el-form-item label="采购价:" prop="prod_price" class="col-sm-4" label-width="100px">
              <el-input v-model.number="formDate.prod_price"></el-input>
            </el-form-item>
            <el-form-item label="起订量:" prop="purchase_price" class="col-sm-4" label-width="100px">
              <el-input v-model.number="formDate.purchase_price"></el-input>
            </el-form-item>
          </div>
          <el-form-item required class="col-sm-8">
            <p class="text-red" v-if="supply_type==2">自营供应商的支付方式为账期支付，给食享会的大品商品价格不在此处维护</p>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <td>客户名称</td>
                    <td>订货价</td>
                    <td>起订量</td>
                    <td>允许订货</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in formDate.tableData" :key=""goods"+index">
                    <td>{{item.level_name}}</td>
                    <td>
                      <el-form-item
                        :key="item.key"
                        :prop="'tableData.' + index + '.prod_price'"
                        :rules="{
                         validator:checkPrice, obj: item, trigger: 'blur'
                      }"
                      >
                        <el-input v-model="item.prod_price"></el-input>
                      </el-form-item>
                    </td>
                    <td>
                      <el-form-item
                        :key="item.key"
                        :prop="'tableData.' + index + '.min_amount'"
                        :rules="{
                        validator:checkNum, obj: item, trigger: 'blur'
                      }"
                      >
                        <el-input v-model="item.min_amount"></el-input>
                      </el-form-item>
                    </td>
                    <td>
                      <el-form-item>
                        <el-switch
                          @change="checkStatus(item, index)"
                          v-model="item.status"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                        ></el-switch>
                      </el-form-item>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-form-item>
        </div>
        <div class="col-sm-12">
          <el-form-item>
            <div class="text-red" v-show="errorMsg" style="margin-bottom: 10px;">{{errorMsg}}</div>
            <el-button type="primary" @click="submitForm('formDate')">提交</el-button>
            <el-button @click="resetForm('formDate')">重置</el-button>
            <router-link to="/prod/prodmanage/listsite" class="ml-10">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </section>
</template>

<style lang="less" scope>
@import url("add.less");
</style>

<script>
import $$ from "jquery";
import moment from "moment";
export default {
  name: "ProdAddSite",
  data: function() {
    return {
      purchaseProdPrice: "",
      purchase_supply_id_let:
        this.$store.state.userInfo.supply_type == 3 ? "purchase_supply_id" : "",
      purchase_supply_prod_number_let:
        this.$store.state.userInfo.supply_type == 3
          ? "purchase_supply_prod_number"
          : "",
      purchaseProdList: {},
      supply_type: this.$store.state.userInfo.supply_type,
      value10: [],
      errorMsg: "",
      tableChecked: true,
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      selectloading: false,
      key_word: "",
      userInfo: this.$store.state.userInfo,
      serverURI: this.$store.state.serverURI,
      labelPosition: "right",
      inputVisible: false,
      inputValue: "",
      siteData: [],
      prodTypeData: [],
      supplyNumberData: [],
      supplyData: [],
      formDate: {
        prod_name: "", // string
        prod_price: "", // number
        prod_number: "",
        specification: "",
        unit_name: "",
        supply_site_id: "",
        prod_category_id: "",
        purchase_supply_id: "",
        purchase_supply_prod_number: "",
        recommend_content: "",
        bar_code: "", // stringrj
        onsale_end_at: null,
        rrp: "",
        purchase_price: "",
        dynamicTags: [
          {
            id: 1,
            label_name: "新品发版1"
          },
          {
            id: 2,
            label_name: "新品发版2"
          },
          {
            id: 3,
            label_name: "新品发版3"
          }
        ],
        selectTags: [],
        thumbnailsuo_url: "", // 缩略图
        main_pic: [], // 主图
        detail_pic: [], // 详情图
        sort: 0, // number
        is_pay_on_delivery: false, // 是否支持货到付款，0为不支持，1为支持,
        is_onsale: true,
        tableData: [
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄",
            tableChecked: true
          }
        ],
        formTableSort: {
          prop: "sort",
          order: "ascending"
        },
        multipleSelection: []
      },
      rules: {
        prod_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        unit_name: [
          {
            required: true,
            message: "请输入商品单位",
            trigger: "blur"
          },
          {
            min: 1,
            max: 4,
            message: "长度在 1 到 4个字符",
            trigger: "blur"
          }
        ],
        sort: [
          {
            type: "integer",
            required: true,
            message: "必须为整数",
            trigger: "blur"
          }
        ],
        prod_number: [
          {
            type: "string",
            required: true,
            message: "SKU编码必填",
            trigger: "blur"
          }
        ],
        bar_code: [
          {
            type: "string",
            required: false,
            message: "SKU编码必填",
            trigger: "blur"
          }
        ],
        prod_price: [
          {
            type: "number",
            required: true,
            message: "请输入正确的商品价格",
            trigger: "blur"
          }
        ],
        purchase_supply_id: [
          {
            type: "number",
            required: true,
            message: "请输入采购供应商",
            trigger: "change"
          }
        ],
        prod_category_id: [
          {
            type: "number",
            required: true,
            message: "请选择商品分类",
            trigger: "change"
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
            message: "请填写售卖规格",
            trigger: "blur"
          }
        ],
        supply_site_id: [
          {
            required: true,
            type: "number",
            message: "请填写所属分站",
            trigger: "change"
          }
        ]
      }
    };
  },
  created: function() {
    if (this.supply_type == 3) {
      this.$watch("formDate.purchase_supply_prod_number", function(val) {
        var purchase_prod_number = this.formDate.purchase_supply_prod_number;
        var purchaseProdItem = this.purchaseProdList[purchase_prod_number];
        if (purchaseProdItem) {
          (this.formDate.specification = purchaseProdItem.specification),
            (this.formDate.unit_name = purchaseProdItem.unit_name),
            (this.formDate.prod_name = purchaseProdItem.prod_name),
            (this.formDate.bar_code = purchaseProdItem.bar_code);
        }
        this.purchaseProdPrice =
          (purchaseProdItem && purchaseProdItem.prod_price) || "";
        var validateProp = [
          "purchase_supply_prod_number",
          "prod_name",
          "unit_name",
          "specification"
        ];
        for (var i in validateProp) {
          this.$refs.formDate &&
            this.$refs.formDate.validateField(validateProp[i]);
        }
      });
    }
    this.getLableData();
    this.getSiteData();
    this.getSupplyData();
    this.getSupplyUserLevel();
    this.getProdTypeData();
  },
  computed: {
    year: function() {
      var y = new Date();
      return y.getFullYear();
    }
  },
  methods: {
    checkPrice(rule, value, callback) {
      if (rule.obj.status && !Number(value)) {
        return callback(new Error("请正确填写价格"));
      } else {
        callback();
      }
    },
    checkNum(rule, value, callback) {
      if (rule.obj.status && (!Number(value) || Number(value) < 1)) {
        return callback(new Error("请正确填写起订量"));
      } else {
        callback();
      }
    },
    checkStatus(item, index) {
      this.$refs.formDate.validateField("tableData." + index + ".prod_price");
      if (this.supply_type == 3) {
        this.$refs.formDate.validateField("tableData." + index + ".cost_price");
      }
      this.$refs.formDate.validateField("tableData." + index + ".min_amount");
    },
    getProdTypeData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/prodCategory/listBySupply.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.prodTypeData = data.data;
        }
      );
    },
    getSiteData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/userinfo/get_supply_site_info.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.siteData = data.data;
        }
      );
    },
    getSupplyData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/supplyInfo/sitelist.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.supplyData = data.data;
        }
      );
    },
    SupplyDataChange: function() {
      this.supplyNumberChange();
      this.key_word = "";
      this.formDate.purchase_supply_prod_number = "";
    },
    supplyNumberChange: function(key_word) {
      var self = this;
      var store = this.$store;
      this.selectloading = true;
      this.$parent.callAPI2(
        "GET",
        "/prodInfo/purchaseprodlist.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          key_word: key_word,
          purchase_supply_id: self.formDate.purchase_supply_id
        },
        function(data) {
          if (data.resultCode === 1000) {
            self.supplyNumberData = data.data;
            self.purchaseProdList = {};
            for (let item of data.data) {
              self.purchaseProdList[item.prod_number] = item;
            }
          }
          self.selectloading = false;
        }
      );
    },
    beforeupload(file) {
      if (file.size > 500000) {
        this.$message({
          message: "图片大小不能超过500k!",
          type: "error"
        });
        return false;
      }
    },
    submitFun() {
      var self = this;
      var store = this.$store;
      var request = {};
      var userLevelPrice = [];
      var userLevelPriceItem = null;
      for (let item of self.formDate.tableData) {
        userLevelPriceItem = {};
        userLevelPriceItem.min_amount = Number(item.min_amount) || 0;
        userLevelPriceItem.prod_price = Number(item.prod_price) || 0;
        if (self.supply_type == 3) {
          userLevelPriceItem.cost_price = Number(item.cost_price) || 0;
        }
        userLevelPriceItem.status = Number(item.status);
        userLevelPriceItem.supply_user_level_id = item.id;
        userLevelPrice.push(userLevelPriceItem);
      }
      request.bar_code = self.formDate.bar_code;
      self.formDate.onsale_end_at &&
      moment(self.formDate.onsale_end_at)._isValid === true
        ? (request.onsale_end_at = moment(self.formDate.onsale_end_at).format(
            "YYYY-MM-DD HH:mm:ss"
          ))
        : (request.onsale_end_at = "");
      request.rrp = self.formDate.rrp;
      request.purchase_price = self.formDate.purchase_price;
      request.detail_pic = self.formDate.detail_pic.toString();
      request.thumbnailsuo_url = self.formDate.thumbnailsuo_url.toString();
      request.is_onsale = Number(self.formDate.is_onsale);
      request.is_pay_on_delivery = Number(self.formDate.is_pay_on_delivery);
      request.label_ids = self.formDate.selectTags.toString();
      request.main_pic = self.formDate.main_pic.toString();
      request.prod_name = self.formDate.prod_name;
      request.recommend_content = self.formDate.recommend_content;
      request.prod_number = self.formDate.prod_number;
      request.prod_price = self.formDate.prod_price;
      request.sort = self.formDate.sort;
      request.specification = self.formDate.specification;
      request.supply_site_id = self.formDate.supply_site_id;
      request.prod_category_id = self.formDate.prod_category_id;
      request.purchase_supply_id = self.formDate.purchase_supply_id;
      request.purchase_supply_prod_number =
        self.formDate.purchase_supply_prod_number || "";
      request.unit_name = self.formDate.unit_name;
      request.prod_user_level_price = JSON.stringify(userLevelPrice);
      var jsondata = Object.assign(request, {
        token: store.state.token,
        tokenid: store.state.tokenid
      });
      self.$parent.callAPI(
        "POST",
        "/prodInfo/doaddall.json",
        jsondata,
        function(data) {
          self.$message({
            message: "添加成功!",
            type: "success"
          });
          setTimeout(function() {
            self.$router.push({
              path: "/prod/prodmanage/listsite"
            });
          }, 1500);
        }
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.supply_type != 3) {
            this.$confirm(
              "商品资料提交后，【售卖规格】不能修改，确认提交？",
              "提示",
              {
                confirmButtonText: "继续提交",
                cancelButtonText: "再看看"
              }
            )
              .then(() => {
                this.submitFun();
              })
              .catch(() => {
                return false;
              });
          } else {
            this.submitFun();
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getSupplyUserLevel: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/supplyUserLevel/list.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          status: 1,
          pagesize: 9999
        },
        function(data) {
          $$.each(data.data, function(index, item) {
            item.status = true;
            item.prod_price = "";
            if (self.supply_type == 3) {
              item.cost_price = "";
            }
            item.min_amount = 1;
          });
          self.formDate.tableData = data.data;
        }
      );
    },
    getLableData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/labelinfo/list.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.formDate.dynamicTags = data.data;
        }
      );
    },
    mainPicSuccess(file) {
      this.formDate.main_pic.push(file.data);
    },
    thumbPicSuccess(file) {
      this.formDate.thumbnailsuo_url = file.data;
    },
    detailPicSuccess(file) {
      this.formDate.detail_pic.push(file.data);
    },
    handleClose(tag) {
      this.formDate.dynamicTags.splice(
        this.formDate.dynamicTags.indexOf(tag),
        1
      );
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleRemoveMainPic(file, fileList) {
      let arr = [];
      fileList.forEach(v => {
        arr.push(v.response && v.response.data);
      });
      this.formDate.main_pic = arr;
    },
    handleRemoveDetailPic(file, fileList) {
      let arr = [];
      fileList.forEach(v => {
        arr.push(v.response && v.response.data);
      });
      this.formDate.detail_pic = arr;
    }
    /*,
    price: function () {
      var self = this
      if (typeof self.formDate.prod_price === 'number') {
        $$.each(self.formDate.tableData, function (index, item) {
          item.prod_price = (item.discount_value * self.formDate.prod_price / 100).toFixed(2)
        })
      }
    }*/
  }
};
</script>
