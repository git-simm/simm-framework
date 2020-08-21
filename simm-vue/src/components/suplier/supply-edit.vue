<template>
  <section class="content-section spu-edit">
    <!-- 新增 & 编辑模式 -->
    <el-row v-if="baseData.mode == 'add' || baseData.mode == 'edit'" style="margin-bottom:10px;">
      <el-col :span="24">
        <el-steps :active="active" space="300px" finish-status="success" style="margin-top: 15px">
          <el-step
            v-for="(item, index) in steps"
            :key="'step' + index"
            :title="item.name"
            style="cursor:pointer;"
            @click.native="setStep(item.active)"
          ></el-step>
        </el-steps>
      </el-col>
      <el-col :span="24">
        <edit-baseinfo ref="baseInfo" v-show="active == 0" :entity="entity" :baseData="baseData"></edit-baseinfo>
        <edit-business ref="business" v-show="active == 1" :entity="entity" :baseData="baseData"></edit-business>
        <edit-cooperate ref="cooperate" v-show="active == 2" :entity="entity" :baseData="baseData"></edit-cooperate>
        <edit-finance ref="finance" v-show="active == 3" :entity="entity" :baseData="baseData"></edit-finance>
        <edit-license ref="license" v-show="active == 4" :entity="entity" :baseData="baseData"></edit-license>
      </el-col>
    </el-row>
    <el-row
      v-if="
        baseData.mode == 'add' ||
          baseData.mode == 'edit' ||
          baseData.mode == 'audit'
      "
    >
      <el-col :span="24" style="text-align:center;">
        <el-button @click="$back">取消</el-button>
        <el-button v-if="active > 0" @click="prev">上一步</el-button>
        <el-button v-if="active < 4" @click="next">下一步</el-button>
        <el-button type="primary" @click="submit('save')">保存</el-button>
        <!-- v-permission:spu_manager_edit -->
        <el-button v-if="entity.process_status != 3" type="primary" @click="submit('commit')">提交</el-button>
      </el-col>
    </el-row>
    <!-- 查看模式 -->
    <!-- <el-row v-if="baseData.mode=='view'|| baseData.mode=='audit'">
      <el-col :span="24">
        <SpuView ref="spuView" :entity="entity" :baseData="baseData" @audit="audit"></SpuView>
      </el-col>
    </el-row>-->
  </section>
</template>

<script>
import supplyEditHandler from "./supply-edit-handler.js";
import editBaseinfo from "./edit-controls/edit-baseinfo.vue";
import editBusiness from "./edit-controls/edit-business.vue";
import editCooperate from "./edit-controls/edit-cooperate.vue";
import editFinance from "./edit-controls/edit-finance.vue";
import editLicense from "./edit-controls/edit-license.vue";
export default {
  name: "supplyEdit",
  components: {
    editBaseinfo,
    editBusiness,
    editCooperate,
    editFinance,
    editLicense
  },
  mixins: [supplyEditHandler],
  data() {
    return {
      steps: [
        { name: "基本信息", comp: "baseInfo", active: 0 },
        { name: "工商法人", comp: "business", active: 1 },
        { name: "合作信息", comp: "cooperate", active: 2 },
        { name: "打款信息", comp: "finance", active: 3 },
        { name: "证照信息", comp: "license", active: 4 }
      ],
      active: 0
    };
  },
  mounted() {
    this.initData();
  },
  //方法列表
  methods: {
    /**
     * 初始化数据结构
     */
    initData() {
      let self = this;
      if (this.$route.path.includes("/view")) {
        this.baseData.mode = "view";
      } else if (this.$route.path.includes("/audit")) {
        this.baseData.mode = "audit";
      } else if (this.$route.path.includes("/edit")) {
        this.baseData.mode = "edit";
      } else if (this.$route.path.includes("/editname")) {
        //允许编辑品名
        this.baseData.mode = "editname";
      } else {
        this.baseData.mode = "add";
      }
      if (this.baseData.mode == "add") {
        this.initNewData();
      } else {
        this.initEditData(entity => {
          setTimeout(() => {
            self.initCompData(entity);
          }, 50);
        });
      }
    },
    next() {
      this.getCurrPageData();
      this.active++;
    },
    prev() {
      if (this.active > 0) {
        this.getCurrPageData();
        this.active--;
      }
    },
    setStep(index) {
      this.getCurrPageData();
      this.active = index;
    }
  }
};
</script>
