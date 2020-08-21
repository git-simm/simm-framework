<template>
  <section class="content-section spu-edit">
    <!-- 新增 & 编辑模式 -->
    <el-row v-if="baseData.mode == 'add' || baseData.mode == 'edit'">
      <el-col :span="24">
        <el-steps :active="active" space="300px" finish-status="success" style="margin-top: 15px">
          <!-- @click.native="setStep(index)" -->
          <el-step v-for="(item, index) in steps" :key="'step' + index" :title="item"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="24">
        <SpuBaseInfo
          ref="baseInfo"
          v-show="active == 0"
          :entity="entity"
          :baseData="baseData"
          @next="next"
          @prev="prev"
          @save="save"
        ></SpuBaseInfo>
        <SpuSkuMix
          ref="spuSkuMix"
          v-if="active == 1"
          :entity="entity"
          :baseData="baseData"
          @next="next"
          @prev="prev"
          @save="save"
          @submit="submit"
        ></SpuSkuMix>
      </el-col>
    </el-row>
    <!-- 查看模式 -->
    <el-row v-if="baseData.mode=='view' || baseData.mode=='audit'">
      <el-col :span="24">
        <SpuView ref="spuView" :entity="entity" :baseData="baseData"></SpuView>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import SpuBaseInfo from "./controls/spu-baseinfo";
import SpuSkuMix from "./controls/spu-sku-mix";
import SpuView from "./controls/spu-view";
export default {
  name: "SpuEdit",
  components: {
    SpuBaseInfo: SpuBaseInfo,
    SpuSkuMix: SpuSkuMix,
    SpuView: SpuView
  },
  props: {
    //查看参数
    viewParam: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      id: this.viewParam ? this.viewParam.id : Number(this.$route.params.id),
      steps: ["SPU基础信息", "SKU设置"],
      active: 0,
      baseData: {
        unitSpec: "3",
        unitData: [],
        secUnitData: [],
        categoryNameData: [],
        mode: "add",
        canAddSku: true,
        canEdit: true,
        auditId: null
      },
      entity: {}
    };
  },
  created() {
    this.getUnitData();
    this.getSecUnitData();
    this.getCategoryNameData();
    this.initData();
  },
  //方法列表
  methods: {
    next(formData) {
      //console.log(formData);
      //将编辑完成的数据返回给主界面
      this.entity = {
        ...this.entity,
        ...formData
      };
      this.active++;
      if (this.active == this.steps.length) {
        //处理完毕,准备返回列表页
        this.$back();
      }
    },
    prev(formData) {
      if (formData) {
        this.entity = {
          ...this.entity,
          ...formData
        };
      }
      if (this.active > 0) {
        this.active--;
      }
    },
    setStep(index) {
      this.active = index;
    },
    // 标品 一级单位
    getUnitData() {
      var self = this;
      this.$httpUtil.post({
        url: "/base/prod/unit/list.json",
        contentType: "form",
        data: {
          parent_id: 0,
          level: 12,
          page: 1,
          status: 1,
          pagesize: 100000
        },
        succ: function(data) {
          self.baseData.unitData = data.data;
        }
      });
    },
    // 标品 二级单位
    getSecUnitData(callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/base/prod/unit/list.json",
        contentType: "form",
        data: {
          parent_id: 0,
          level: 123,
          page: 1,
          status: 1,
          pagesize: 100000
        },
        succ: function(data) {
          self.baseData.secUnitData = (data.data || []).filter(
            a => a.status == 1
          );
        }
      });
    },
    // 一级类目数据
    getCategoryNameData() {
      var self = this;
      this.$httpUtil.post({
        url: "/base/prod/category/userList.json",
        contentType: "form",
        succ: function(data) {
          self.baseData.categoryNameData = (data.data || []).filter(
            a => a.status == 1
          );
        }
      });
    },
    /**
     * 初始化数据结构
     */
    initData() {
      let self = this;
      if (this.viewParam) {
        this.baseData.mode = "view";
      } else if (this.$route.path.includes("/view")) {
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
      //判断是否有品名编辑权
      this.$set(
        this.baseData,
        "canEditName",
        this.$permission.hasPermission("spu_edit_name")
      );
      let id = this.id;
      let auditId = this.$route.params.auditId;
      if (id) {
        //编辑模式，获取明细数据
        self.$httpUtil.post({
          url: "/spuBaseInfo/view.json?id=" + id,
          succ: function(data) {
            //数据反向生成目录结构
            self.recoveryData(data.data);
            //草稿可编辑
            self.$set(
              self.baseData,
              "canEdit",
              data.data.processStatus === 0 || data.data.processStatus === -2
            );
            //审核通过后可以添加sku
            self.$set(
              self.baseData,
              "canAddSku",
              data.data.processStatus === 3
            );
            if (auditId) {
              self.baseData.auditId = auditId;
            }
          }
        });
      }
    },
    /**
     * 后台数据恢复成前端接受的类型
     */
    recoveryData(data) {
      //data.processStatus = 3;
      data.skuMixList = data.baseProdInfoList;
      (data.skuMixList || []).forEach(a => {
        a.specAttrs = JSON.parse(a.addInfo);
        //计算一个规格字段
        a.specDesc = a.productName.replace(data.jointName, "");
        //组装母码信息
        if (a.refId > 0) {
          var parent = data.skuMixList.find(sku => sku.id == a.refId);
          if (parent) {
            a.parentName = parent.productName;
          }
        }
      });
      data.specList = [];
      //升序排列
      let sortSpecList = (data.spuSpecsInfoList || []).sort((a, b) => {
        return a.order - b.order;
      });
      sortSpecList.forEach(a => {
        var specInfo = data.specList.find(
          item => item.spec == a.specsGroupCode
        );
        if (!specInfo) {
          var specInfo = {
            spec: a.specsGroupCode,
            name: a.specsGroupName,
            specArr: []
          };
          data.specList.push(specInfo);
        }
        //反向组装初始化数据
        if (a.specJson > "") {
          var json = JSON.parse(a.specJson);
          a = {
            ...a,
            ...json
          };
        }
        specInfo.specArr.push(a);
      });
      //为实体赋值(双向绑定)
      for (var p in data) {
        this.$set(this.entity, p, data[p]);
      }
      //数据绑定
      this.entity.storageModeCode = Number(this.entity.storageModeCode);
      this.entity.quaranteePeriodCode = Number(this.entity.quaranteePeriodCode);
    },
    /**
     * 组装业务数据
     */
    wrapData(data) {
      data.baseProdInfoList = [];
      data.spuSpecsInfoList = [];
      (data.skuMixList || []).forEach(sku => {
        //属性拷贝
        var props = [
          "brandName",
          "categoryId",
          "categoryName",
          "isSelfBrand",
          "placeName",
          "quaranteePeriodCode",
          "remark",
          "spuName",
          "spuNumber",
          "storageModeCode",
          "twoCategoryId",
          "twoCategoryName"
        ];
        props.forEach(p => {
          sku[p] = data[p];
        });
        //储藏方式
        sku.storageMethod = data.storageModeCode;
        //默认设置为普通sku
        if (!sku.prodType) {
          sku.prodType = 1;
        }
        data.baseProdInfoList.push(sku);
      });
      var index = 0;
      //无效的数据过滤
      (data.specList || []).forEach(a => {
        //取有效的规格信息
        a.specArr = (a.specArr || []).filter(b => b.specVal > "");
      });
      //过滤掉规格为空的数据
      data.specList = (data.specList || []).filter(
        a => (a.specArr || []).length > 0
      );
      data.specList.forEach(a => {
        a.specArr.forEach(item => {
          index++;
          var spec = {
            specsGroupCode: a.spec,
            specsGroupName: a.name,
            id: item.id,
            spuId: item.spuId,
            specVal: item.specVal,
            specJson: item.specJson,
            order: index
          };
          data.spuSpecsInfoList.push(spec);
        });
      });
    },
    /**
     * 保存数据
     */
    save(formData, callback) {
      var self = this;
      this.entity = {
        ...this.entity,
        ...formData
      };
      //存在id,则为更新模式
      var url = "/spuBaseInfo/doAdd.json";
      if (self.entity.id) {
        url = "/spuBaseInfo/doUpdate.json";
      }
      this.baseSave(this.entity, url, data => {
        self.success("保存成功", () => self.$back());
      });
    },
    success(msg, callback) {
      var self = this;
      self.$message({
        message: msg,
        type: "success"
      });
      if (callback) {
        setTimeout(callback, 1500);
      }
    },
    /**
     * 提交请求
     */
    submit(formData) {
      let self = this;
      this.entity = {
        ...this.entity,
        ...formData
      };
      //存在id,则为更新模式
      var url = "/spuBaseInfo/addCommit.json";
      if (this.entity.id) {
        url = "/spuBaseInfo/updateCommit.json";
      }
      this.baseSave(this.entity, url, data => {
        self.success("提交成功", () => self.$back());
      });
    },
    /**
     * 基础保存
     */
    baseSave(entity, url, callback) {
      //基础信息校验
      var self = this;
      if (entity.skuMixList.length <= 0) {
        self.active = 1;
        self.$commonUtil.valid.throwEx(`SKU列表不能为空`);
      }
      let prodInfoValid = (sku, val, msg) => {
        if (self.$commonUtil.valid.isEmpty(val)) {
          //校验出错，返回到第一个页签
          self.active = 1;
          self.$commonUtil.valid.throwEx(`[${sku.productName}]的${msg}未填写`);
        }
      };
      //sku校验
      entity.skuMixList.forEach(a => {
        prodInfoValid(a, a.tax, "税率");
        prodInfoValid(a, a.unit, "规格单位");
        prodInfoValid(a, a.salesModel, "售卖模式");
      });
      this.wrapData(entity);
      //校验数据(规格,表单校验)
      this.$refs.baseInfo.valid();
      this.$refs.baseInfo.$refs["formData"].validate(valid => {
        if (valid) {
          self.$httpUtil.post({
            url: url,
            data: entity,
            succ: function(data) {
              if (callback) {
                callback(data);
              } else {
                //返回列表页面
                self.success("保存成功", () => self.$back());
              }
            }
          });
        } else {
          //校验出错，返回到第一个页签
          self.active = 0;
          return false;
        }
      });
    }
  }
};
</script>
