<template>
  <section class="content-section">
    <table class="table table-hover table-bordered table-largePadding">
      <tbody>
        <tr>
          <!-- <td>城市名称</td>
          <td>{{infoData.company_name}}</td>-->
          <td>城市</td>
          <td>{{infoData.level_name}}</td>
          <td>城市ID</td>
          <td>{{infoData.admin_shop_id}}</td>
        </tr>
        <tr>
          <!-- <td>公司电话</td>
          <td>{{infoData.company_phone}}</td>-->
          <td>负责人姓名</td>
          <td>{{infoData.contact_person}}</td>
          <td>负责人手机</td>
          <td>{{infoData.contact_phone}}</td>
        </tr>
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
        </tr>
      </tbody>
    </table>
    <div style="overflow:auto;">
      <span>
        <h4 class="text-theme">
          收货地址列表
          <router-link :to="`/client/delivery/add/${infoData.id}`" class="row-button">
            <el-button type="primary" class="btn-default" size="small">新增收货地址</el-button>
          </router-link>
        </h4>
      </span>
      <el-table border :data="infoData.deliveryList" style="width: 100%" max-height="300">
        <el-table-column type="index" :index="i=>i+1" label="序号" width="50"></el-table-column>
        <el-table-column prop="receiver_name" label="收货人姓名" width="150"></el-table-column>
        <el-table-column prop="receiver_mobile" label="收货人手机号" width="150"></el-table-column>
        <el-table-column prop="contact_person" label="收货地址">
          <template slot-scope="scope">
            <span>{{scope.row.address_province+scope.row.address_city+(scope.row.address_district || '')+ scope.row.address_detail}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zip_code" label="邮编" width="150"></el-table-column>
        <el-table-column label="默认地址" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.is_default == 1?"是":"否"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.status == 1?"启用":"禁用"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <router-link :to="'/client/delivery/edit/' + scope.row.id">
              <el-button plain size="minier">修改</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <router-link to="/client/clientmanage/list">
      <input type="button" class="btn btn-default" value="返回" />
    </router-link>
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
  name: "DeliveryList",
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
      self.$httpUtil.post({
        url: "/userinfo/getDetail.json",
        loading: true,
        contentType: "form",
        data: {
          id: this.$route.params.id
        },
        succ: function(data) {
          self.infoData = data.data || {};
        }
      });
    }
  }
};
</script>
