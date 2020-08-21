
<template>
  <section class="content-section">
    <h5>基本信息</h5>
    <el-row>
      <el-col :span="20">
        <sxh-view-container :item-span="12" :label-width="150" style="padding:10px;">
          <sxh-view-item title="供应商编码">{{infoData.supply_number}}</sxh-view-item>
          <sxh-view-item title="结算抵扣余额" :label-width="180">
            <template slot="title">
              <span style="color: red;">结算抵扣余额（供应商欠款）</span>
            </template>
            <span style="color: red;">{{infoData.supply_balance}}</span>
          </sxh-view-item>
          <sxh-view-item title="供应商名称">{{infoData.supply_name}}</sxh-view-item>
          <sxh-view-item title="供应商简称">
            <span>{{infoData.supply_short_name}}</span>
            <span style="margin-left:20px;">
              <el-popover placement="top" trigger="click">
                <div v-viewer>
                  <img src="/static/img/supplyShortName.png" width="100%" />
                </div>
                <el-button slot="reference" size="minier" type="primary">
                  <i class="el-icon-view"></i>
                  <span>示例</span>
                </el-button>
              </el-popover>
            </span>
          </sxh-view-item>
          <sxh-view-item title="联系人姓名">{{infoData.contact_person}}</sxh-view-item>
          <sxh-view-item title="联系人电话">{{infoData.contact_phone}}</sxh-view-item>
          <sxh-view-item
            title="供应商类型"
          >{{infoData.supply_identity==1?'厂家':infoData.supply_identity==2?'品牌代理商':infoData.supply_identity==6?'一级经销商':infoData.supply_identity==7?'二级经销商':infoData.supply_identity==8?'农产品原产地':''}}</sxh-view-item>
          <sxh-view-item title="公司说明">{{infoData.supply_note}}</sxh-view-item>
          <sxh-view-item
            title="公司地址"
          >{{infoData.address_province+infoData.address_city+infoData.address_district}}</sxh-view-item>
          <sxh-view-item title="详细地址">{{infoData.address_detail}}</sxh-view-item>
          <sxh-view-item title="审核备注" v-if="infoData.audit_remark != null" :span="24">
            <span style="color: red;">{{infoData.audit_remark}}</span>
          </sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <h5>供应商账号信息</h5>
        <AccountList :id="infoData.id" :bankCode="infoData.bank_code" ref="AccountList"></AccountList>
      </el-col>
    </el-row>
    <h5>工商法人</h5>
    <el-row>
      <el-col :span="20">
        <sxh-view-container :item-span="12" :label-width="150" style="padding:10px;">
          <sxh-view-item title="法人姓名">{{infoData.juridical_person_name}}</sxh-view-item>
          <sxh-view-item title="法人身份证号">{{infoData.corporate_identity_number}}</sxh-view-item>
          <sxh-view-item title="身份证有效期至">{{infoData.corporate_identity_validity_end}}</sxh-view-item>
          <sxh-view-item title="法人手机号">{{infoData.corporate_phone_number}}</sxh-view-item>
          <sxh-view-item title="注册资本">
            {{infoData.registered_capital}}
            <span v-if="infoData.registered_capital != null">元</span>
          </sxh-view-item>
          <sxh-view-item title="社会统一信用号码">{{infoData.business_license_no}}</sxh-view-item>
          <sxh-view-item title="注册时间">{{infoData.registration_time}}</sxh-view-item>
          <sxh-view-item title="营业执照类型">{{infoData.license_type}}</sxh-view-item>
          <sxh-view-item title="注册地址">{{infoData.registered_address}}</sxh-view-item>
          <sxh-view-item
            title="执照有效期"
          >{{infoData.certificates_validity_begin}}至{{infoData.certificates_validity_end}}</sxh-view-item>
          <sxh-view-item title="经营范围">{{infoData.business_scope}}</sxh-view-item>
          <sxh-view-item
            title="税务身份"
          >{{infoData.tax_identity == 1 ? '合作社':infoData.tax_identity == 2 ? '个体工商户':infoData.tax_identity == 3 ? '小规模纳税人':infoData.tax_identity == 4 ? '一般纳税人':''}}</sxh-view-item>
          <sxh-view-item title="工商注册公司名称">{{infoData.company_name}}</sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
    <h5>合作信息</h5>
    <el-row>
      <el-col :span="20">
        <sxh-view-container :item-span="12" :label-width="150" style="padding:10px;">
          <sxh-view-item title="供应商归属">{{infoData.is_direct_purchasing == 1 ? '直购' :'团购'}}</sxh-view-item>
          <sxh-view-item title="销售模式">{{ $cacheUtil.getVal('settltType',infoData.merchant_model ) }}</sxh-view-item>
          <sxh-view-item
            title="配送方式"
          >{{ $cacheUtil.getVal('delivery_type',infoData.deliveryType ) }}</sxh-view-item>
          <sxh-view-item
            title="是否分账"
          >{{infoData.is_sub_account == 0 ? '否' : infoData.is_sub_account == 1 ? '是':''}}</sxh-view-item>
          <sxh-view-item
            title="是否为代理商"
          >{{infoData.is_agent == 0 ? '否' : infoData.is_agent == 1 ? '是':''}}</sxh-view-item>
          <sxh-view-item title="经营类目">
            <el-tag
              size="mini"
              effect="plain"
              v-for="item in categoryList"
              :key="item.id"
            >{{item.category_name}}</el-tag>
          </sxh-view-item>
          <sxh-view-item title="供应商账期（天）">{{infoData.settle_day}}</sxh-view-item>
          <sxh-view-item title="代理城市">{{infoData.level_name}}</sxh-view-item>
          <sxh-view-item title="结算邮箱">{{infoData.contact_email}}</sxh-view-item>
          <sxh-view-item title="合同有效期">
            {{infoData.contract_validity_begin}}
            <span
              v-if="null!=infoData.contract_validity_begin"
            >至</span>
            {{infoData.contract_validity_end}}
          </sxh-view-item>
          <sxh-view-item title="保证金">{{infoData.deposit_price}}</sxh-view-item>
          <sxh-view-item title="收货邮箱">{{infoData.receive_email}}</sxh-view-item>
          <sxh-view-item title="平台比例">
            <span v-if="infoData.is_agent===1">
              {{infoData.platform_ratio}}
              <span v-if="infoData.platform_ratio != null">%</span>
            </span>
          </sxh-view-item>
          <sxh-view-item title="保证金余额">{{infoData.bailBalance}}</sxh-view-item>
          <sxh-view-item
            title="供应商服务区域"
            :span="24"
            v-if="infoData.is_direct_purchasing===0 && infoData.is_agent===0"
          >
            <p style="color:darkgoldenrod;max-height:80px;overflow:auto;">
              <el-tag
                size="mini"
                effect="plain"
                v-for="(item,index) in supplySiteData.filter(a=>a.addressCity>'')"
                :key="index"
              >{{item.addressCity}}</el-tag>
            </p>
          </sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
    <el-row v-show="tableData.length > 0">
      <div class="optlog">
        <p class="form-control-static">
          <label class="controle-label">售后服务地址&nbsp;</label>
          <i class="iconfont icon-sort-desc"></i>
        </p>
        <el-col :span="20">
          <table class="table table-bordered table-striped dataTable">
            <thead>
              <tr role="row">
                <th>联系人</th>
                <th>售后电话</th>
                <th>售后地址</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id">
                <td>{{item.contactPerson}}</td>
                <td>{{item.phoneNumber}}</td>
                <td>{{item.address}}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </div>
    </el-row>
    <h5>打款信息</h5>
    <el-row>
      <el-col :span="20">
        <sxh-view-container :item-span="12" :label-width="150" style="padding:10px;">
          <sxh-view-item title="类型">{{$cacheUtil.getVal("finance_type",infoData.finance_type,"")}}</sxh-view-item>
          <sxh-view-item title="户名">{{infoData.account_name}}</sxh-view-item>
          <sxh-view-item title="开户行">{{infoData.account_bank}}</sxh-view-item>
          <sxh-view-item title="支行名称">{{infoData.sub_bank_name}}</sxh-view-item>
          <sxh-view-item title="打款卡号">{{infoData.account_number}}</sxh-view-item>
          <sxh-view-item title="证件类型">{{infoData.identity_card_kind}}</sxh-view-item>
          <sxh-view-item
            title="授权代理人姓名"
            v-if="infoData.finance_type==2"
          >{{infoData.authorized_agent_name}}</sxh-view-item>
          <sxh-view-item
            :title="infoData.finance_type==1?`收款人证件编号`:`授权代理人证件编号`"
          >{{infoData.identity_card}}</sxh-view-item>
          <sxh-view-item title="证件有效期至">{{infoData.identity_card_end}}</sxh-view-item>
          <sxh-view-item
            :title="infoData.finance_type==1?`收款人手机号`:`授权代理人手机号`"
          >{{infoData.authorized_agent_phone_number}}</sxh-view-item>
          <sxh-view-item title="供应商平台账号">{{infoData.platform_account}}</sxh-view-item>
          <sxh-view-item title="打款备注">{{infoData.account_note}}</sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import moment from "moment";
import AccountList from "./account-list";
export default {
  components: {
    AccountList: AccountList,
  },
  data: function () {
    return {
      tableData: [],
      infoData: {}, // 基本信息
      soOptLogList: [], // 操作日志
      images: [], // 证件信息
      categoryList: [], // 基础类目
      supplySiteData: [], // 全部服务区域
    };
  },
  methods: {
    initData(data) {
      this.tableData = data.tableData;
      this.infoData = data.infoData;
      this.soOptLogList = data.soOptLogList;
      this.images = data.images;
      this.categoryList = data.categoryList;
      this.supplySiteData = data.supplySiteData;
      //获取账号信息
      this.$refs.AccountList.getList(this.infoData.id, this.infoData.bank_code);
    },
  },
};
</script>
