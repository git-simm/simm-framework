<template>
  <section class="content-section product-view">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本信息" name="first">
        <div class="col-sm-6">
          <view-base ref="detailBase"></view-base>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="second_prodList">
        <prod-list ref="prodList" :filter="{prod_number:formData.prodNumber}"></prod-list>
      </el-tab-pane>
      <el-tab-pane v-if="showOnSaleSgu" label="上架SGU" name="onsaleSguList">
        <sgu-list
          ref="onsaleSguList"
          :onsale-status="[1,2]"
          date-clear
          :prod-number="formData.prodNumber"
          :pageMode="3"
        ></sgu-list>
      </el-tab-pane>
      <el-tab-pane label="全部SGU" name="sguList">
        <sgu-list ref="sguList" :prod-number="formData.prodNumber" :pageMode="3"></sgu-list>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" v-if="formData.id!=null">
        <sxh-log ref="detailLog" :biz-list="[5,16]" :id-list="[formData.id]"></sxh-log>
      </el-tab-pane>
    </el-tabs>
    <el-row class="col-sm-9">
      <el-col :span="20">
        <span v-permission:skuAudit>
          <span v-if="null!=formData.sysAudit">
            <input
              type="button"
              class="btn btn-default btn-top"
              value="审核通过"
              @click="auditSku(formData)"
            />
            <input
              type="button"
              class="btn btn-default btn-top"
              value="打回"
              @click="rejectSku(formData)"
            />
          </span>
        </span>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import viewBase from "./controls/view-base";
import sguList from "@/components/sgumanager/sgu-list";
import prodList from "@/components/prod/prodmanage/prod-list.vue";
export default {
  name: "skuView",
  components: { viewBase, sguList, prodList },
  props: {
    //查看参数
    viewParam: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      prodNumber: this.viewParam
        ? this.viewParam.number
        : this.$route.params.prodNumber,
      tab: this.viewParam ? this.viewParam.tab : this.$route.params.tab,
      activeName: "first",
      showOnSaleSgu: false,
      formData: {}
    };
  },
  created() {
    if (this.tab > "") {
      this.showOnSaleSgu = true;
      this.activeName = this.tab;
    }
    if (this.prodNumber > "") {
      this.formData.prodNumber = this.prodNumber;
    } else {
      this.formData = JSON.parse(window.sessionStorage.getItem("skuView"));
    }
  },
  mounted() {
    var self = this;
    if (this.prodNumber > "") {
      //获取明细
      this.$httpUtil.post({
        url: "/base/prod/info/get.json",
        data: {
          prod_number: this.prodNumber
        },
        contentType: "form",
        succ: function(data) {
          self.formData = data.data;
          self.$refs.detailBase.initData(self.formData);
        }
      });
    } else {
      this.$refs.detailBase.initData(this.formData);
    }
  },
  methods: {
    /**
     * sku审核
     */
    auditSku(item) {
      var self = this;
      self
        .$confirm("确认审核?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.$httpUtil.post({
            url: "/base/prod/info/auditBaseProdInfo.json",
            contentType: "form",
            data: {
              id: item.id,
              status: 1
            },
            succ: function(data) {
              self.$message({
                type: "success",
                message: "操作成功!"
              });
              self.$back();
            }
          });
        })
        .catch(() => {});
    },
    /**
     * rejectSku
     */
    rejectSku(item) {
      var self = this;
      self
        .$confirm("确认打回到申请人?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.$httpUtil.post({
            url: "/base/prod/info/rejectBaseProdInfo.json",
            contentType: "form",
            data: {
              id: item.id,
              status: -1
            },
            succ: function(data) {
              self.$message({
                type: "success",
                message: "操作成功!"
              });
              self.$back();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
