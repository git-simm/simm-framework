<template>
  <section class="content-section product-add-edit" id="billadd">
    <div class="row">
      <el-form
          :model="formData"
          ref="formData"
          label-width="50px"
          class="demo-ruleForm"
          :rules="rules"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="费用单编号" prop="afterTime" label-width="100px">
              <el-input placeholder="费用单编码自动生成" v-model="formData.billNumber" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="费用单名称" prop="billName" label-width="100px">
              <el-input placeholder="请输入费用单名称" v-model="formData.billName">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="费用单类型" prop="billModel" label-width="100px">
              <el-select v-model="formData.billModel" clearable filterable placeholder="请选择" @change="billTypeChange">
                <el-option v-if="pageMode == 1"
                           v-for="(item,index) in $cacheUtil.getDic('group_bill_model')"
                           :key="'bill_model'+index"
                           :label="item.value"
                           :value="item.key"
                ></el-option>
                <el-option v-if="pageMode == 2"
                           v-for="(item,index) in $cacheUtil.getDic('direct_bill_model')"
                           :key="'bill_model'+index"
                           :label="item.value"
                           :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="城市" prop="cityName" label-width="100px">
              <sxh-city v-model="cityIdList" :check-strictly="false" @change="cityChange">
              </sxh-city>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="城市编码" prop="billCityId" label-width="100px">
              <el-input v-model="formData.billCityId" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplyName" label-width="100px">
              <el-select v-model="formData.supplyName" clearable filterable placeholder="请选择" @change="supplyChange"
                         ref="supplySelect">
                <el-option
                    v-for="(item, key) in supplyData"
                    :key="key"
                    :label="item.supply_name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label=供应商编码 prop="supplyNumber" label-width="100px">
              <el-input v-model="formData.supplyNumber" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="金额" prop="billAmount" label-width="100px">
              <el-input v-model.number="formData.billAmount">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="备注" prop="remark" label-width="100px">
              <el-input type="textarea" placeholder="请输入备注" v-model="formData.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-form-item>
            <el-button type="primary" @click="submit(2)">保存</el-button>
            <el-button type="primary" @click="submit(1)">提交</el-button>
            <a href="javascript:;" @click="$back" class="ml-10">
              <el-button>取消</el-button>
            </a>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </section>
</template>

<script>

export default {
  name: "BillAdd",
  created: function () {
    this.pageMode = Number(this.$route.params.pageMode);
    this.getSupplyData(this.pageMode);
    this.initData();
  },
  data() {
    return {
      mode: "add",
      formData: {
        billNumber: "",
        billName: "",
        billModel: null,
        billCityId: null,
        cityName: "",
        supplyId: null,
        supplyName: "",
        supplyNumber: "",
        billAmount: null,
        remark: "",
      },
      cityIdList: [],
      supplyData: [],
      pageMode: 1,
      rules:{
        billName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入费用单名称",
          }
        ],
        billNumber: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        billModel: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        cityName: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        supplyName: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        billAmount: [
          {
            type: "number",
            required: true,
            trigger: "blur",
            message: "请输入金额",
          }
        ],
      }
    }
  },
  //方法列表
  methods: {
    initData() {
      if (this.$route.path.includes("/add")) {
        this.mode = "add";
      } else if (this.$route.path.includes("/edit")) {
        this.mode = "edit";
      }
      if (this.mode == "edit") {
        this.initDataEdit(this.$route.params.id);
      }
    },
    initDataEdit(id) {
      var self = this;
      this.$httpUtil.post({
        url: "/billInfo/queryDetail.json",
        data: {
          id: id
        },
        loading: false, //不显示遮罩
        succ: function (data) {
          self.formData = data.data;
          self.cityIdList = data.data.cityId;
        }
      });
    },

    getSupplyData: function (type) {
      var pageMode = 2;
      if(type != null && type ==2 ){
        pageMode = 1;
      }
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/groupList.json",
        data: {
          pageMode: pageMode
        },
        loading: false, //不显示遮罩
        succ: function (data) {
          self.supplyData = data.data;
        }
      });
    },

    cityChange(val) {
      if (val.cityId > 0) {
        this.formData.billCityId = val.cityId;
        this.formData.cityName = val.level_name;
        return;
      } else if (val.provinceId > 0) {
        this.formData.billCityId = null;
        this.formData.cityName = null;
        return;
      }
      this.formData.billCityId = null;
      this.formData.cityName = null;
    },

    supplyChange(val) {
      if (val > 0) {
        var supplyInfo = this.supplyData.find((item) => {
          return item.id === val;//筛选出匹配数据
        });
        this.formData.supplyNumber = supplyInfo.supply_number;
        this.formData.supplyId = supplyInfo.id;
        return;
      }
      this.formData.supplyNumber = null;
    },

    billTypeChange(val) {
      if (this.mode == 'add') {
        var self = this;
        this.$httpUtil.post({
          url: "/uniqCode.json",
          data: {},
          loading: false, //不显示遮罩
          succ: function (data) {
            self.formData.billNumber = "FY0" + self.formData.billModel + data.data;
          }
        });
      }
    },
    /**
     * 更新/提交方法 1：提交，2：保存
     * */
    submit(type) {
      var self = this;
      let emptyValid = this.$commonUtil.valid.emptyValid;
      emptyValid(self.formData.billNumber, "费用单号不能为空");
      emptyValid(self.formData.billModel, "费用类型不能为空");
      emptyValid(self.formData.billCityId, "城市不能为空");
      emptyValid(self.formData.supplyName, "供应商不能为空");
      emptyValid(self.formData.billAmount, "金额不能为空");
      var url = "/billInfo/submit.json";
      if (type == 2) {
        url = "/billInfo/save.json";
      }
      var jsondata =this.formData
      this.$httpUtil.post({
        url: url,
        data: jsondata,
        contentType: "json",
        loading: true,//不显示遮罩层
        succ: function (data) {
          self.$back();
        }
      });
    }
  }
};
</script>
