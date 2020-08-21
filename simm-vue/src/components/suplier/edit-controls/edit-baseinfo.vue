<template>
  <section>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="140px"
      class="demo-ruleForm"
    >
      <h4 class="text-theme">基本信息</h4>
      <el-row>
        <el-col :span="10">
          <el-form-item label="供应商编码">
            <el-input v-model.trim="formData.supply_number" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="供应商名称" prop="supply_name">
            <el-input v-model.trim="formData.supply_name"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contact_person">
            <el-input v-model.trim="formData.contact_person"></el-input>
          </el-form-item>
          <el-form-item label="供应商类型" prop="supply_identity">
            <el-select v-model.number="formData.supply_identity" clearable placeholder="请选择">
              <el-option label="厂家" :value="1"></el-option>
              <el-option label="品牌代理商" :value="2"></el-option>
              <el-option label="一级经销商" :value="6"></el-option>
              <el-option label="二级经销商" :value="7"></el-option>
              <el-option label="农产品原产地" :value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司地址" prop="addressArr">
            <el-cascader
              expand-trigger="hover"
              :options="baseData.addressJson"
              :props="{ checkStrictly: true }"
              v-model="formData.addressArr"
              ref="cascaderAddr"
              @change="onProvincesChange"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="供应商简称" prop="supplyShortName">
            <el-input v-model.trim="formData.supplyShortName"></el-input>
            <span style="position:absolute;">
              <el-popover placement="top" trigger="click">
                <div v-viewer>
                  <img src="/static/img/supplyShortName.png" width="100%" />
                </div>
                <el-button slot="reference" type="primary">
                  <i class="el-icon-view"></i>
                  <span>示例</span>
                </el-button>
              </el-popover>
            </span>
          </el-form-item>
          <el-form-item label="联系人电话" prop="contact_phone">
            <el-input v-model.trim="formData.contact_phone"></el-input>
          </el-form-item>
          <el-form-item label="公司说明">
            <el-input v-model.trim="formData.supply_note"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address_detail">
            <el-input v-model.trim="formData.address_detail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import EditBaseinfoHandler from "./edit-baseinfo-handler.js";
import EditCommonHandler from "./edit-common-handler.js";
export default {
  name: "EditBaseinfo",
  mixins: [EditBaseinfoHandler, EditCommonHandler],
  props: {
    baseData: {},
    entity: {}
  },
  //方法列表
  methods: {
    /**
     * 初始化
     * @param {*} data
     * @param {*} compProp
     */
    initData(data, compProp) {
      this.baseInitData(data, compProp);
      if (this.baseData.mode !== "add") {
        this.formData.addressArr = [];
        if (this.formData.address_province_id) {
          this.formData.addressArr.push(this.formData.address_province_id);
        }
        if (this.formData.address_city_id) {
          this.formData.addressArr.push(this.formData.address_city_id);
        }
        if (this.formData.address_district_id) {
          this.formData.addressArr.push(this.formData.address_district_id);
        }
      }
    },
    exec(cmd) {
      //只提交图片信息
      //this.$emit(cmd, this.getImgData());
    }
  }
};
</script>
