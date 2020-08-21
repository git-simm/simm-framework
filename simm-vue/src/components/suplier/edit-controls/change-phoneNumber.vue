<template>
  <section class="content-section layer-container">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="法人姓名:">
        <span>{{formData.juridical_person_name}}</span>
      </el-form-item>
      <el-form-item label="法人手机号:">
        <span>{{formData.corporatePhoneNumber}}</span>
      </el-form-item>
      <h4 style="color:indianred; padding-left: 10px">
        注意：1、您刚刚修改了法人手机号，请记得联系交行人员同步修改；
        <br />2、交行修改后不会同步更改供应商平台数据，交行修改成功后请告知供应商组产品经理
      </h4>
    </el-form>
    <div class="layer-footer" style="text-align:center;">
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </section>
</template>
<script>
export default {
  name: "change-phoneNumber",
  data() {
    return {
      formData: {}
    };
  },
  created() {
    this.formData = this.$options.propsData.formData || {};
  },
  methods: {
    save: function() {
      this.$layerUtil.closeWin(this);
    }
  }
};
</script>

<style scoped>
</style>