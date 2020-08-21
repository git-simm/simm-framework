<template id="list">
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="150px"
        class="demo-ruleForm el-drawer__body"
        @keyup.native.enter="searchFun"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市名称">
              <el-input v-model.trim="request.level_name" placeholder="请输入城市名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否为代理商">
              <el-select
                v-model.number="request.is_agent"
                clearable
                placeholder="请选择"
                type="number"
              >
                <el-option
                  v-for="(item,index) in $cacheUtil.getDic('is_agent')"
                  :key="'noticeType'+index"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市ID">
              <el-input v-model.number="request.admin_shop_id" placeholder="请输入城市ID" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model.number="request.status" clearable placeholder="请选择" type="number">
                <el-option
                  v-for="(item,index) in $cacheUtil.getDic('city_status')"
                  :key="'noticeType'+index"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="pull-right">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜 索</el-button>
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-download"
                @click="excelExport()"
              >导 出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-row>
        <el-col :span="22">
          <span v-permission:clientlevel_add>
            <el-button type="primary" @click="addShow()" class="btn-default" icon="el-icon-plus">新增</el-button>
          </span>
        </el-col>
        <el-col :span="2">
          <div class="pull-right">
            <sxh-help code="020101"></sxh-help>
          </div>
        </el-col>
      </el-row>
      <el-table border :data="infoData.data" style="width: 100%">
        <el-table-column prop="level_name" label="城市名称"></el-table-column>
        <el-table-column prop="admin_shop_id" label="城市ID"></el-table-column>
        <el-table-column label="是否为代理商">
          <template slot-scope="scope">
            <span>
              {{
              scope.row.is_agent == 1
              ? "是"
              : scope.row.is_agent == 0
              ? "否"
              : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="配送方式">
          <template
            slot-scope="scope"
          >{{$cacheUtil.getVal('delivery_type',scope.row.deliveryType,"")}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>
              {{
              scope.row.status == 1
              ? "启用"
              : scope.row.status == 0
              ? "禁用"
              : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              plain
              size="minier"
              @click="editShow(scope.row)"
              v-permission:clientlevel_update
            >修改</el-button>
            <span v-permission:grossProfit_edit>
              <span v-if="scope.row.is_agent == 0">
            <router-link
                    :to="'/client/level/grossprofit/list/' + scope.row.admin_shop_id"
            >
              <el-button  plain
                          size="minier"
              >修改毛利率</el-button>
            </router-link>
              </span>
            </span>
            <span v-permission:clientlevel_apply>
              <el-button
                plain
                size="minier"
                @click="disableFun(scope.row)"
                v-if="scope.row.status == 1"
              >禁用</el-button>
              <el-button
                plain
                size="minier"
                @click="ableFun(scope.row)"
                v-if="scope.row.status == 0"
              >启用</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pull-right"
        @current-change="handleCurrentChange"
        :current-page="request.page"
        layout="total, prev, pager, next, jumper"
        :page-size="request.pagesize"
        :total="infoData.records"
      ></el-pagination>
    </div>
    <el-dialog :title="selected.id!=null?`编辑城市`:`新增城市`" :visible.sync="addFlg" destroy-on-close>
      <el-form :model="selected" label-width="120px" :rules="rules" ref="editCity">
        <el-row>
          <el-col :span="12">
            <el-form-item label="城市名称" prop="level_name">
              <el-input v-model="selected.level_name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市ID" prop="admin_shop_id">
              <el-input
                v-model.number="selected.admin_shop_id"
                auto-complete="off"
                :disabled="selected.id!=null"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务费比例" prop="platformRatio" title>
              <template slot="label">
                <span>服务费比例</span>
                <sxh-popover tooltip="1、设置为0则认为配置不启用；<br/>2、不允许为负值；" :tooltip-width="250"></sxh-popover>
              </template>
              <sxh-input-number
                :precision="2"
                :step="0.1"
                :min="0"
                :max="100"
                :controls="false"
                v-model="selected.platformRatio"
                placeholder="请设置最低平台服务费比例"
                auto-complete="off"
              >
                <template slot="append">%</template>
              </sxh-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团长佣金比例" prop="commissionRatio">
              <template slot="label">
                <span>团长佣金比例</span>
                <sxh-popover tooltip="1、设置为0则认为配置不启用；<br/>2、不允许为负值；" :tooltip-width="250"></sxh-popover>
              </template>
              <sxh-input-number
                :precision="2"
                :step="0.1"
                :min="0"
                :max="100"
                :controls="false"
                v-model="selected.commissionRatio"
                placeholder="请设置默认团长佣金比例"
                auto-complete="off"
              >
                <template slot="append">%</template>
              </sxh-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否为代理商" prop="is_agent">
              <el-select
                :disabled="selected.id!=null"
                v-model="selected.is_agent"
                @change="editIsAgentChange(selected.is_agent)"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- :disabled="selected.is_agent == 1" -->
          <el-col :span="12">
            <el-form-item label="配送方式" prop="deliveryType">
              <template slot="label">
                <span>配送方式</span>
                <sxh-popover tooltip="城市可以支持的团购业务。默认为自提，设置为包邮后，城市将允许做团购包邮业务" :tooltip-width="250"></sxh-popover>
              </template>
              <el-select v-model="selected.deliveryType" clearable filterable placeholder="请选择">
                <el-option
                  v-for="(item,index) in $cacheUtil.getDic('delivery_type')"
                  :key="'delivery_type'+index"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="selected.status">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否差异化上架" prop="isDiff" label-width="130px">
              <!-- :disabled="selected.is_agent == 1" -->
              <template slot="label">
                <span>是否差异化上架</span>
                <sxh-popover tooltip="开启后，城市可以按照团长分组进行SGU上架范围的设置" :tooltip-width="250"></sxh-popover>
              </template>
              <el-select v-model="selected.isDiff">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开启商品审核" prop="isAudit">
              <template slot="label">
                <span>开启商品审核</span>
                <sxh-popover tooltip="开启后，城市建品将增加商品管理员审核节点" :tooltip-width="250"></sxh-popover>
              </template>
              <el-select v-model="selected.isAudit">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否余额支付" prop="isPayByBalance">
              <template slot="label">
                <span>是否余额支付</span>
                <sxh-popover tooltip="开启后，城市商品允许设置为支持余额支付的方式" :tooltip-width="250"></sxh-popover>
              </template>
              <el-select v-model="selected.isPayByBalance">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商审核" prop="isSupplyAudit">
              <template slot="label">
                <span>供应商审核</span>
                <sxh-popover tooltip="商品销售价发生改变时，校验城市开关，如果是关闭审核状态。则直接生成有效的价格版本，否则需要供应商审核" :tooltip-width="250"></sxh-popover>
              </template>
              <el-select v-model="selected.isSupplyAudit" :disabled="selected.is_agent ==1">
                <el-option label="是" value=1></el-option>
                <el-option label="否" value=0></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCity(selected, 'editCity')">确 定</el-button>
        <el-button @click="()=>addFlg = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog top="5vh" width="60%" :visible.sync="dialogTableVisible">
      <!-- 定制列 -->
      <span>选择要展示的列:</span>
      <el-checkbox-group v-model="checkList" @change="handleChange" class="m-20">
        <el-checkbox
          :disabled="item === '城市ID'"
          :label="item"
          v-for="item in tempCheckList"
          :key="item"
        />
      </el-checkbox-group>
    </el-dialog>
  </section>
</template>

<script>
import {tableColumn} from "./data";
import exportUtil from "../../../common/utils/ExportUtil";

export default {
  name: "levelList",
  data: function() {
    return {
      request: {
        level_name: "",
        is_agent: "",
        status: "",
        admin_shop_id: "",
        page: 1,
        pagesize: 10
      },
      // 固定列相关
      dialogTableVisible: false,
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      addFlg: false,
      selected: {},
      infoData: {},
      data: {},
      rules: {
        platformRatio: [
          {
            type: "number",
            required: false,
            trigger: "blur",
            label: "城市平台比例",
            validator: this.checkRatio
          }
        ],
        commissionRatio: [
          {
            type: "number",
            required: false,
            trigger: "blur",
            label: "团长佣金比例",
            validator: this.checkRatio
          }
        ],
        level_name: [
          {
            required: true,
            message: "请输入等级名称",
            trigger: "blur"
          }
        ],
        admin_shop_id: [
          {
            required: true,
            type: "number",
            message: "请输入编码(必为数字)",
            trigger: "blur"
          }
        ],
        discount_value: [
          {
            required: true,
            type: "number",
            message: "请输入折扣(必为数字)",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请输入状态",
            trigger: "change"
          }
        ],
        is_agent: [
          {
            required: true,
            message: "请选择是否为代理商",
            trigger: "change"
          }
        ],
        deliveryType: [
          {
            required: true,
            message: "请选择配送方式",
            trigger: "change"
          }
        ]
      }
    };
  },
  created: function() {
    this.getListData();
    this.tableColumn = tableColumn;
    // 定制列
    this.tempCheckList = tableColumn.map(v => v.label).slice();
    this.checkList = tableColumn.map(v => v.label);
    this.filterTableColumn = tableColumn.filter(
      v => this.checkList.indexOf(v.label) > -1
    );
  },
  methods: {
    // 定制列
    handleChange() {
      this.filterTableColumn = tableColumn.filter(
        v => this.checkList.indexOf(v.label) > -1
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.request.page = val;
      this.getListData();
    },
    getListData: function() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyUserLevel/list.json",
        data: self.request,
        contentType: "form",
        succ: function(data) {
          self.infoData = data;
        }
      });
    },
    /**
     * excel导出
     */
    excelExport() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyUserLevel/list.json",
        data: {
          ...self.request,
          ...{
            page: 1,
            pagesize: 99999
          }
        },
        contentType: "form",
        succ: function(data) {
          var config = self.$metadata.clientLevel;
          exportUtil.exportByConfig(self, data.data, config);
        }
      });
    },
    /**
     * 搜索框
     */
    searchFun: function() {
      if (this.request.page == 1) {
        this.getListData();
        sessionStorage.setItem("level_request", JSON.stringify(this.request));
      } else {
        this.request.page = 1;
      }
    },
    addShow: function() {
      this.selected = {};
      this.$set(this.selected, "discount_value", 100);
      this.$set(this.selected, "level_name", "");
      this.$set(this.selected, "admin_shop_id", null);
      this.$set(this.selected, "status", "1");
      this.$set(this.selected, "is_agent", null);
      this.$set(this.selected, "deliveryType", null);
      this.$set(this.selected, "platformRatio", 0);
      this.$set(this.selected, "commissionRatio", 0);
      this.$set(this.selected, "isDiff", "0");
      this.$set(this.selected, "isAudit", "0");
      this.$set(this.selected, "isPayByBalance", "0");
      this.$set(this.selected, "isSupplyAudit", "1");
      this.addFlg = true;
    },
    saveCity(item, formName) {
      if (item.id != null) {
        this.editSave(item, formName);
      } else {
        this.addSave(item, formName);
      }
    },
    addSave: function(item, formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.$httpUtil.post({
            url: "/supplyUserLevel/doAdd.json",
            contentType: "form",
            data: item,
            succ: function(data) {
              if (data.resultCode == 1000) {
                self.request.page = 1;
                self.$refs[formName].resetFields();
                self.getListData();
                self.addFlg = false;
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    editShow: function(item) {
      item.status = String(item.status);
      item.is_agent = String(item.is_agent);
      item.isDiff = String(item.isDiff);
      item.isAudit = String(item.isAudit);
      item.isPayByBalance = String(item.isPayByBalance);
      item.isSupplyAudit = String(item.isSupplyAudit);
      this.selected = Object.assign({}, item);
      this.addFlg = true;
    },
    editSave: function(item, formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.ajaxFun({}, item);
        } else {
          return false;
        }
      });
    },
    ajaxFun: function(json, item) {
      var self = this;
      if (item == null) {
        item = {};
      }
      var jsondata = Object.assign(item, json);
      this.$httpUtil.post({
        url: "/supplyUserLevel/doUpdate.json",
        contentType: "form",
        data: jsondata,
        succ: function(data) {
          self.getListData();
          self.$refs.editCity.resetFields();
          self.addFlg = false;
        }
      });
    },
    disableFun: function(item) {
      this.ajaxFun(
        {
          id: item.id,
          status: 0
        },
        null
      );
    },
    ableFun: function(item) {
      this.ajaxFun(
        {
          id: item.id,
          status: 1
        },
        null
      );
    },
    cancelFun: function() {
      this.addFlg = false;
    },
    editIsAgentChange: function(val) {
      if (val == 1) {
        this.selected.deliveryType = 2;
        this.selected.isDiff = "0";
        this.selected.isAudit = "0";
        this.selected.isPayByBalance = "0";
        this.selected.isSupplyAudit = "0";
      } else {
        this.selected.deliveryType = null;
      }
    },
    /**
     * 比例校验
     */
    checkRatio(rule, value, callback) {
      if (value < 0 || value > 100) {
        return callback(
          new Error(
            `${rule.label}必须大于或等于0,小于等于100,请正确填写${rule.label}`
          )
        );
      } else if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
        return callback(new Error(`${rule.label}最多2位小数`));
      } else {
        callback();
      }
    }
  }
};
</script>
