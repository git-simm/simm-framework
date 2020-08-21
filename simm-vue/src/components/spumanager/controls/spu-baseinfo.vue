<template>
  <section class="content-section spu-edit">
    <el-row>
      <el-form
        :model="formData"
        ref="formData"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
      >
        <h4 class="text-theme">基本信息</h4>
        <el-col :span="10">
          <el-form-item label="是否为自有品牌" prop="isSelfBrand">
            <el-radio-group v-model="formData.isSelfBrand" :disabled="!baseData.canEdit">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="一级类目" prop="categoryId">
            <el-select
              v-model="formData.categoryId"
              clearable
              filterable
              placeholder="请选择"
              :disabled="!baseData.canEdit"
              @change="categoryNameDataChange"
              @clear="categoryNameDataChange"
            >
              <el-option
                v-for="(item, key) in baseData.categoryNameData"
                :key="key"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级类目" prop="twoCategoryId">
            <el-select
              v-model="formData.twoCategoryId"
              clearable
              filterable
              placeholder="请选择"
              :disabled="!baseData.canEdit"
              @change="twoCategoryNameDataChange"
              @clear="twoCategoryNameDataChange"
            >
              <el-option
                v-for="(item, key) in twoCategoryNameData"
                :key="key"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="三级类目" prop="threeCategoryId">
            <el-select
              v-model="formData.threeCategoryId"
              clearable
              filterable
              placeholder="请选择"
              :disabled="!baseData.canEdit"
              @change="threeCategoryNameDataChange"
              @clear="threeCategoryNameDataChange"
            >
              <el-option
                v-for="(item, key) in threeCategoryNameData"
                :key="key"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品名" prop="spuName">
            <!-- 草稿状态 或者 (审批通过/并且有修改品名权限) -->
            <el-input
              v-model.trim="formData.spuName"
              @change="setJointName()"
              v-if="baseData.canEdit || (baseData.canAddSku && baseData.canEditName)"
            ></el-input>
            <span v-else>{{formData.spuName}}</span>
          </el-form-item>
          <el-form-item label="保质期" prop="quaranteePeriodCode">
            <!-- 草稿状态 或者 (审批通过/并且有修改品名权限) -->
            <el-input
              v-model.number="formData.quaranteePeriodCode"
              type="number"
              :min="0"
              v-if="baseData.canEdit || (baseData.canAddSku && baseData.canEditName)"
              placeholder="请输入天数"
              clearable
            >
              <template slot="append">天</template>
            </el-input>
            <span v-else>{{formData.quaranteePeriodCode}}天</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="组合名称" prop="jointName">
            <el-input v-model.trim="formData.jointName" :disabled="!baseData.canEdit"></el-input>
          </el-form-item>
          <el-form-item label="商品品牌" prop="brandName">
            <el-input
              v-model.trim="formData.brandName"
              @change="setJointName()"
              :disabled="!baseData.canEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品产地" prop="placeName">
            <el-input
              v-model.trim="formData.placeName"
              v-if="baseData.canEdit || (baseData.canAddSku && baseData.canEditName)"
            ></el-input>
            <span v-else>{{formData.placeName}}</span>
          </el-form-item>
          <el-form-item label="SPU编码" prop="spuNumber">
            <el-input v-model.trim="formData.spuNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品属性" prop="storageModeCode">
            <el-radio-group
              v-model="formData.storageModeCode"
              :disabled="!(baseData.canEdit || (baseData.canAddSku && baseData.canEditName))"
            >
              <el-radio
                :label="item.key"
                :key="'storageModeCode'+index"
                v-for="(item,index) in $cacheUtil.getDic('storage_method')"
              >{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="计量单位" prop="deposit_price">
                    <el-input v-model.number="formData.deposit_price"></el-input>
          </el-form-item>-->
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-form :model="formData" ref="formSpec" label-width="140px" class="demo-ruleForm">
        <h4 class="text-theme">
          商品规格
          <el-button
            title="添加规格"
            :disabled="unAddSpec || (!baseData.canEdit)"
            @click="addSpec(formData.specList)"
          >
            <span>+ 添加规格</span>
          </el-button>
        </h4>
        <el-col :span="24" style="padding:20px;">
          <table class="table table-hover table-bordered">
            <thead>
              <th width="60" style="height:40px;">序号</th>
              <th width="180" style="height:40px;">规格名称</th>
              <th>规格值</th>
              <th width="180">操作</th>
            </thead>
            <tbody class="spec-list">
              <tr
                v-for="(item,index) in formData.specList"
                :key="'spec'+index"
                :spec="item.spec!= baseData.unitSpec"
              >
                <td style="vertical-align: middle;">{{ index+1 }}</td>
                <!-- 规格名称 -->
                <td
                  style="vertical-align: middle;"
                  v-if="!baseData.canEdit || item.spec == baseData.unitSpec"
                >{{item.name}}</td>
                <td style="vertical-align: middle;" v-else>
                  <el-select v-model="item.spec" filterable placeholder="请选择规格" @change="specValid">
                    <el-option
                      v-for="spec in specDic"
                      :key="'unit'+spec.key"
                      :label="spec.name"
                      :value="spec.key"
                      :disabled="spec.disabled"
                    ></el-option>
                  </el-select>
                </td>
                <!-- 非单位 -->
                <td style="vertical-align: middle;" v-if="item.spec!=baseData.unitSpec">
                  <el-form-item
                    label
                    label-width="0"
                    class="form-input"
                    v-for="(specItem,i) in item.specArr"
                    :key="'spec'+index+'val'+i"
                    :prop="'specList.'+ index +'.specArr.'+ i"
                  >
                    <el-input
                      class="undraggable"
                      v-model="item.specArr[i].specVal"
                      :disabled="!baseData.canEdit && specItem.id>0"
                      placeholder="请输入值"
                      style="width:200px;padding:2px;"
                      clearable
                    >
                      <template slot="append" v-if="baseData.canEdit || !(specItem.id>0)">
                        <i
                          class="el-icon-delete"
                          slot="suffix"
                          title="点击删除"
                          @click="removeItem(item.specArr,item.specArr[i],i)"
                        ></i>
                      </template>
                    </el-input>
                  </el-form-item>
                </td>
                <!-- 单位 -->
                <td style="vertical-align: middle;" v-if="item.spec==baseData.unitSpec">
                  <el-col
                    :span="12"
                    v-for="(specItem,i) in item.specArr"
                    :key="'spec'+index+'val'+i"
                    :prop="'specList.'+ index +'.specArr.'+ i"
                  >
                    <SpuProdUnit
                      v-if="showSpuUnitList"
                      :entity="specItem"
                      :baseData="baseData"
                      label-width="0"
                      :disabled="!baseData.canEdit && specItem.id>0"
                      @specificationChange="spec=>{
                                                item.specArr[i] = spec;
                                                specItem = spec;
                                            }"
                    >
                      <template slot="append">
                        <el-button
                          class="el-icon-delete"
                          v-if="baseData.canEdit || !(specItem.id>0)"
                          @click="removeUnitItem(item.specArr,item.specArr[i],i)"
                        ></el-button>
                      </template>
                    </SpuProdUnit>
                  </el-col>
                </td>
                <td style="vertical-align: middle;">
                  <a
                    href="javascript:;"
                    style="padding:0 5px;"
                    title="添加规格值"
                    @click="addItem(item.specArr,item.spec==baseData.unitSpec)"
                  >新增值</a>
                  <a
                    href="javascript:;"
                    style="padding:0 5px;"
                    title="删除规格"
                    v-if="baseData.canEdit && item.spec!=baseData.unitSpec"
                    @click="removeSpecItem(formData.specList,item,index)"
                  >删除</a>
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align:center;">
        <span v-permission:spu_manager_edit>
          <el-button type="primary" v-if="baseData.canEdit" @click="save">保存</el-button>
        </span>
        <!-- <el-button @click="$emit('save',formData)">上一步</el-button> -->
        <el-button @click="next">下一步</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import Sortable from "../../draggable/src/util/Sortable";
import spuProdUnit from "./spu-prod-unit";
import { setTimeout } from "timers";
export default {
  name: "SpuBaseInfo",
  components: {
    SpuProdUnit: spuProdUnit
  },
  props: {
    entity: {
      isSelfBrand: 0
    },
    baseData: {
      unitData: [],
      secUnitData: [],
      categoryNameData: []
    }
  },
  data() {
    return {
      showSpuUnitList: true,
      specDic: [],
      unAddSpec: false,
      // 二级类目数据
      twoCategoryNameData: [],
      threeCategoryNameData: [],
      formData: {
        isSelfBrand: null,
        spuName: "",
        categoryId: "",
        categoryName: "",
        twoCategoryId: "",
        twoCategoryName: "",
        threeCategoryId: "",
        threeCategoryName: "",
        storageModeCode: "",
        quaranteePeriodCode: "",
        //默认数据为编辑中
        processStatus: 0,
        spuNumber: "",
        brandName: "",
        placeName: "",
        specList: [],
        jointName: ""
      },
      rules: {
        isSelfBrand: [
          {
            required: true,
            type: "number",
            message: "请选择是否为自有品牌",
            trigger: "change"
          }
        ],
        spuName: [
          {
            required: true,
            message: "spu名称不能为空",
            trigger: "change"
          }
        ],
        categoryId: [
          {
            type: "number",
            required: true,
            message: "请选择一级类目",
            trigger: "change"
          }
        ],
        twoCategoryId: [
          {
            type: "number",
            required: true,
            message: "请选择二级类目",
            trigger: "change"
          }
        ],
        threeCategoryId: [
          {
            type: "number",
            required: true,
            message: "请选择三级类目",
            trigger: "change"
          }
        ],
        storageModeCode: [
          {
            type: "number",
            required: true,
            message: "请选择商品属性",
            trigger: "change"
          }
        ],
        jointName: [
          {
            required: true,
            message: "组合名称不能为空",
            trigger: "change"
          },
          {
            min: 1,
            max: 24,
            message: "长度在 1 到 24 个字符"
          }
        ]
        // quaranteePeriodCode: [{
        //     type: 'number',
        //     required: true,
        //     message: '请设置保质期',
        //     trigger: 'change'
        // }]
      }
    };
  },
  watch: {
    //监听外部实体信息的变化
    entity: {
      handler: function(val) {
        this.formData = {
          ...this.formData,
          ...val
        };
      }
    },
    "formData.categoryId": {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.getTwoCategoryNameData();
        }
      },
      deep: true
    },
    "formData.twoCategoryId": {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.getThreeCategoryNameData();
        }
      },
      deep: true
    }
  },
  created() {
    this.formData = {
      ...this.formData,
      ...this.entity
    };
    this.getSpecData();
    //新增模式下，规格默认添加一个单位
    if (
      this.baseData.mode == "add" &&
      (this.formData.specList || []).length == 0
    ) {
      this.formData.specList.push({
        spec: this.baseData.unitSpec,
        name: "单位",
        specArr: []
      });
    }
  },
  mounted() {
    //编辑状态下允许排序
    if (this.baseData.canEdit) {
      this.initSortable();
    }
  },
  //方法列表
  methods: {
    stop(event) {
      event.cancelBubble = true;
    },
    initSortable() {
      var self = this;
      //初始化拖拽控件
      var $ul = this.$el.querySelector(".spec-list");
      new Sortable($ul, {
        draggable: ">tr[spec]",
        filter: ".undraggable",
        onUpdate: function(event) {
          var newIndex = event.newIndex,
            oldIndex = event.oldIndex,
            $li = $ul.children[newIndex],
            $oldLi = $ul.children[oldIndex];
          // 先删除移动的节点
          $ul.removeChild($li);
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            $ul.insertBefore($li, $oldLi);
          } else {
            $ul.insertBefore($li, $oldLi.nextSibling);
          }
          //计算table的序号
          for (var i = 0; i < $ul.children.length; i++) {
            $ul.children[i].children[0].innerHTML = i + 1;
          }
          var item = self.formData.specList.splice(oldIndex, 1);
          self.formData.specList.splice(newIndex, 0, item[0]);
        },
        animation: 150
      });
      this.stopPropagation();
    },
    /**
     * 阻止冒泡
     */
    stopPropagation() {
      setTimeout(() => {
        //对选中项执行foreach操作
        var $el = document.querySelectorAll(".undraggable");
        if (!$el) return;
        [].forEach.call($el, function(item) {
          item.addEventListener("pointerdown", e => {
            e.stopPropagation();
          });
          item.addEventListener("mousedown", e => {
            e.stopPropagation();
          });
        });
      }, 200);
    },
    next() {
      this.valid();
      //组装规格名称
      this.wrapSpec();
      this.$emit("next", this.formData);
    },
    save() {
      //组装规格名称
      this.wrapSpec();
      this.$emit("save", this.formData);
    },
    //校验信息是否填写完整
    valid() {
      var self = this;
      //组装规格数据
      self.wrapSpec();
      self.formData.specList.forEach(a => {
        if (a.specArr.some(a => self.$commonUtil.valid.isEmpty(a.specVal))) {
          self.$commonUtil.valid.throwEx("请把空缺的规格信息填写完整");
        }
        //判断规格信息是否有重复
        let newArr = Array.from(new Set(a.specArr.map(a => a.specVal)));
        //spec == 3 为单位
        if (a.spec == self.baseData.unitSpec) {
          //规格为单位时，需要按照规格值进行校验
          newArr = Array.from(new Set(a.specArr.map(a => a.specification)));
        }
        if (newArr.length != a.specArr.length) {
          self.$commonUtil.valid.throwEx(`规格[${a.name}]中存在重复的规格值`);
        }
        //校验单位信息是否完整
        if (a.spec == self.baseData.unitSpec) {
          a.specArr.forEach(unit => {
            //单位信息的完整性校验
            if (unit.validFunc) {
              unit.validFunc();
            }
          });
        }
      });
    },
    //************ 规格管理 begin ********************* */
    //新增项
    addItem(obj, isUnit) {
      if (isUnit) {
        obj.push({
          categoryName: this.formData.categoryName,
          twoCategoryName: this.formData.twoCategoryName
        });
      } else {
        obj.push({
          specVal: ""
        });
      }
      this.stopPropagation();
    },
    /**
     * 移除项
     */
    removeItem(obj, item, index) {
      //删除记录
      obj.splice(index, 1);
    },
    removeUnitItem(obj, item, index) {
      var self = this;
      self.showSpuUnitList = false;
      //删除记录
      obj.splice(index, 1);
      this.$nextTick(() => {
        self.showSpuUnitList = true;
      });
    },
    //移除规格
    removeSpecItem(obj, item, index) {
      //删除记录
      obj.splice(index, 1);
      this.specValid();
    },
    //添加新的规格
    addSpec(specList) {
      //把新的规格插入到单位前面
      specList.splice(specList.length - 1, 0, {
        spec: "",
        name: "",
        specArr: []
      });
    },
    /**
     * 判断规格是否允许添加
     */
    specValid(val) {
      //禁用掉已经被选中的规格信息
      var self = this;
      //恢复初始状态
      self.specDic.forEach(a => self.$set(a, "disabled", false));
      this.formData.specList.forEach(item => {
        var temp = self.specDic.find(a => a.key == item.spec) || {};
        //禁用已经选中的项
        temp.disabled = true;
      });
      this.unAddSpec = this.specDic.every(a => a.disabled);
      //组装规格名
      this.wrapSpec();
      //刷新值,使控件及时刷新
      //self.specDic = JSON.parse(JSON.stringify(self.specDic));
    },
    wrapSpec() {
      //组装规格名称
      var self = this;
      self.formData.specList.forEach(item => {
        var temp = self.specDic.find(a => a.key == item.spec) || {};
        item.name = temp.name;
      });
    },
    //************ 规格管理 end ********************* */
    //查找规格集合
    getSpecData() {
      var self = this;
      this.$httpUtil.post({
        url: "/dictionary/queryByClassCode.json?classCode=prod_spec",
        contentType: "form",
        succ: function(data) {
          self.specDic = data.data.map(a => {
            return {
              key: a.itemCode,
              name: a.itemName
            };
          });
          self.specValid();
        }
      });
    },
    categoryNameDataChange(val) {
      if (val) {
        var levelOne = this.baseData.categoryNameData.find(a => a.id == val);
        this.formData.categoryName = levelOne.categoryName;
      } else {
        this.formData.categoryName = "";
      }
      this.clearUnit();
      this.formData.twoCategoryId = "";
      this.formData.twoCategoryName = "";
      this.formData.threeCategoryId = "";
      this.formData.threeCategoryName = "";
      this.formData.unit = "";
      this.formData.firstUnit = "";
      this.twoCategoryNameData = [];
      this.threeCategoryNameData = [];
    },

    twoCategoryNameDataChange(val) {
      if ((this.twoCategoryNameData || []).length == 0) return;
      if (val) {
        var level = this.twoCategoryNameData.find(a => a.id == val);
        this.formData.twoCategoryName = level.categoryName;
      } else {
        this.formData.twoCategoryName = "";
      }
      this.clearUnit();
      this.formData.threeCategoryId = "";
      this.formData.threeCategoryName = "";
      this.threeCategoryNameData = [];
    },

    threeCategoryNameDataChange(val) {
      if ((this.threeCategoryNameData || []).length == 0) return;
      if (val) {
        var level = this.threeCategoryNameData.find(a => a.id == val);
        this.formData.threeCategoryName = level.categoryName;
      } else {
        this.formData.threeCategoryName = "";
      }
      //当前三级类目变更，不用清理单位
    },

    clearUnit() {
      //清理掉单位信息
      var unit = this.formData.specList.find(
        a => a.spec == this.baseData.unitSpec
      );
      if (unit) {
        unit.specArr = [];
      }
      this.formData.skuMixList = [];
    },

    // 二级类目数据
    getTwoCategoryNameData() {
      var self = this;
      if (this.$commonUtil.valid.isEmpty(self.formData.categoryId)) {
        return;
      }
      this.$httpUtil.post({
        url: "/base/prod/category/list.json",
        contentType: "form",
        data: {
          parent_id: self.formData.categoryId,
          page: 1,
          pagesize: 100000
        },
        succ: function(data) {
          self.twoCategoryNameData = (data.data || []).filter(
            a => a.status == 1
          );
        }
      });
    },
    // 三级类目数据
    getThreeCategoryNameData() {
      var self = this;
      if (this.$commonUtil.valid.isEmpty(self.formData.twoCategoryId)) {
        return;
      }
      this.$httpUtil.post({
        url: "/base/prod/category/list.json",
        contentType: "form",
        data: {
          parent_id: self.formData.twoCategoryId,
          page: 1,
          pagesize: 100000
        },
        succ: function(data) {
          self.threeCategoryNameData = (data.data || []).filter(
            a => a.status == 1
          );
        }
      });
    },
    setJointName() {
      let self = this;
      let brandName =
        self.formData.brandName == "无" ? "" : self.formData.brandName;
      let spuName = self.formData.spuName;
      self.formData.jointName = brandName + spuName;
    }
  }
};
</script>

<style lang="less" scoped>
.form-input {
  float: left;
  margin-bottom: 0;
  padding-right: 10px;
}
</style>
