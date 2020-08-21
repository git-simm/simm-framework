<template>
  <section class="content-section" id="proadd">
    <div class="row">
      <div class="col-sm-8">
        <el-form :model="request" ref="formDate" label-width="200px" class="demo-ruleForm">
          <el-form-item label="配送模板名称：" prop="templateName">{{ request.templateName }}</el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="配送范围：">
                <div style="height:500px;overflow:auto;">
                  <!-- :default-expanded-keys="menuButtonMap" -->
                  <el-tree
                    :data="cityTree"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="checkedstatus.length==0?[0]:checkedstatus"
                    highlight-current
                    auto-expand-parent
                    :props="defaultProps"
                  ></el-tree>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formDate')">确认</el-button>
            <router-link to="/sgumanager/template/list" class="ml-10">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "templateRelevance",
  data: function() {
    return {
      cityList: [],
      addressList: [],
      provinceList: [],
      cityTree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      checkedstatus: [],
      sguCount: 0,
      request: {
        templateName: "",
        detailIds: []
      }
    };
  },
  created: function() {
    this.getParentMenu();
  },
  methods: {
    submitForm(formName) {
      var citys = this.getCheckedData();
      var self = this;
      let store = this.$store;
      let id = self.$route.params.id;
      let jsondata = Object.assign(self.request, {
        id: id,
        detailIds: citys.map(a => a.id).join(",")
      });
      if (self.sguCount > 0) {
        this.$confirm(
          "当前模板正在被SGU商品包使用中，修改会导致关联的SGU商品包范围变更，确认修改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        )
          .then(() => {
            this.$httpUtil.post({
              url: "/distributionTemplate/update.json",
              contentType: "form",
              data: jsondata,
              succ: function(data) {
                if (data !== "error") {
                  self.$message({
                    message: "修改成功",
                    type: "success"
                  });
                  setTimeout(
                    () =>
                      self.$router.push({ path: "/sgumanager/template/list" }),
                    1500
                  );
                }
              }
            });
          })
          .catch(() => {
            return true;
          });
      } else {
        this.$httpUtil.post({
          url: "/distributionTemplate/update.json",
          contentType: "form",
          data: jsondata,
          succ: function(data) {
            if (data !== "error") {
              self.$message({
                message: "修改成功",
                type: "success"
              });
              setTimeout(
                () => self.$router.push({ path: "/sgumanager/template/list" }),
                1500
              );
            }
          }
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 获取选中的数据
     */
    getCheckedData() {
      var list = this.$refs.tree.getCheckedKeys();
      var checkedCitys = this.cityList.filter(a => list.includes(a.id));
      return checkedCitys;
    },
    /**
     * 组装城市数据Tree
     */
    wrapTreeData(addressList) {
      var self = this;
      this.addressList = addressList;
      this.provinceList = addressList.filter(a => a.level == 1);
      this.provinceList.forEach(a => (a.label = a.province_name));
      this.cityList = addressList.filter(a => a.level == 2);
      this.cityList.forEach(
        a =>
          (a.label =
            a.city_name + (a.district_name > "" ? "-" + a.district_name : ""))
      );
      this.provinceList.forEach(a => {
        a.children = self.cityList.filter(c => c.parent_id == a.id);
      });
      this.cityTree = [
        {
          id: 0,
          label: "全国",
          level: 0,
          children: this.provinceList
        }
      ];
    },
    getParentMenu: function() {
      var self = this;
      var store = this.$store;
      var id = self.$route.params.id;
      this.$httpUtil.post({
        url: "/distributionTemplate/queryCityList.json",
        contentType: "form",
        data: { id: id },
        succ: function(data) {
          self.request.templateName = data.data.templateName;
          self.wrapTreeData(data.data.addressInfos);
          let len1 = data.data.distributionTemplateDetailList.length;
          let len2 = self.cityList.length;
          self.sguCount = data.data.sguCount;
          data.data.distributionTemplateDetailList.forEach(ele => {
            self.checkedstatus.push(
              ele.addressCityId != null
                ? ele.addressCityId
                : ele.addressProvinceId
            );
          });
          self.$refs.tree.setCheckedKeys(self.checkedstatus);
        }
      });
    }
  }
};
</script>
