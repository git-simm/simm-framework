<template>
  <section class="content-section">
    <el-row class="col-sm-9">
      <table class="table table-hover table-bordered table-largePadding">
        <tbody>
          <tr>
            <!-- <td>城市名称</td>
            <td>{{infoData.company_name}}</td>-->
            <td>城市</td>
            <td style="width:30%">{{infoData.level_name}}</td>
            <td>城市ID</td>
            <td>{{infoData.admin_shop_id}}</td>
          </tr>
          <tr>
            <td>收货人手机号</td>
            <td>{{infoData.receiver_mobile}}</td>
            <td>收货人姓名</td>
            <td>{{infoData.receiver_name}}</td>
          </tr>
          <tr>
            <!-- <td>客户生日</td>
            <td>{{infoData.birthday}}</td>-->
            <!-- <td>城市</td>
            <td>{{infoData.level_name}}</td>-->
            <!-- <td>账号</td>
            <td>{{infoData.user_name}}</td>-->
          </tr>
          <tr>
            <td>收货地址</td>
            <td>{{infoData.address_province+infoData.address_city+(infoData.address_district || '')+ infoData.address_detail}}</td>
            <td>邮编</td>
            <td>{{infoData.zip_code}}</td>
          </tr>
          <!-- <tr>
          <td>所属分站</td>
          <td>{{infoData.site_name}}</td>
          <td>客户类型</td>
          <td>{{infoData.user_type==1?'KA卖场客户':infoData.user_type==2?'批发客户':infoData.user_type==3?'微商客户':''}}</td>
          </tr>-->
          <!-- <tr>
          <td>城市等级</td>
          <td>{{infoData.level_name}}</td>
           <td>签约有效期</td>
          <td>{{infoData.validity_start_date}} 至 {{infoData.validity_end_date}}</td>
          </tr>-->
          <tr>
            <!-- <td>公司电话</td>
            <td>{{infoData.company_phone}}</td>-->
            <td>负责人姓名</td>
            <td>{{infoData.contact_person}}</td>
            <td>负责人手机</td>
            <td>{{infoData.contact_phone}}</td>
          </tr>
          <!-- <tr>
           <td>联系人职位</td>
          <td>{{infoData.contact_position}}</td>
          <td>联系人手机</td>
          <td>{{infoData.contact_phone}}</td>
          </tr>-->
          <tr>
            <td>联系人email</td>
            <td>{{infoData.contact_email}}</td>
            <td>备注</td>
            <td>{{infoData.contact_note}}</td>
          </tr>
          <tr>
            <td>微信昵称</td>
            <td>{{infoData.wx_nickname}}</td>
            <td>微信账号</td>
            <td>{{infoData.wx_username}}</td>
          </tr>
          <tr>
            <td>账号</td>
            <td>{{infoData.user_name}}</td>
            <td>账号状态</td>
            <td>{{infoData.status==0?'未启用':infoData.status==1?'启用':infoData.status==2?'过期':infoData.status==3?'禁用':''}}</td>
            <!-- <td>账号类型</td>
            <td>{{infoData.is_supply_user==0?'普通订货账号':'供应商订货账号'}}</td>-->
          </tr>
        </tbody>
      </table>
      <router-link to="/client/clientmanage/list">
        <input type="button" class="btn btn-default" value="返回" />
      </router-link>
    </el-row>
  </section>
</template>
<style lang="less">
.table.table-largePadding > tbody > tr > td {
  padding: 10px;
  border: 1px solid #e8e8e8;
  &:nth-child(2n + 1) {
    background: #f1f1f1;
    /* width:130px */
    width: 15%;
  }
}
</style>
<script>
export default {
  name: "SupplyClientManageView",
  data: function() {
    return {
      response: "",
      infoData: {}
    };
  },
  created: function() {
    this.getInfoData();
  },
  methods: {
    getInfoData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/userinfo/view.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: this.$route.params.id
        },
        function(data) {
          self.infoData = data.data;
        }
      );
    }
  }
};
</script>
