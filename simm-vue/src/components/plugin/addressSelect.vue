<template>
  <div>
    <div class="col-sm-2">
      <select class="form-control"  v-bind:value="address.address_province_id"  @change="changeProv($event.target.value)">
        <option value="">请选择省</option>
        <option :value="item.id" v-for="item in provData"  :selected="item.id==address.address_province_id" >{{item.province_name}}</option>
      </select>
    </div>
    <div class="col-sm-2">
      <select class="form-control"  v-bind:value="address.address_city_id" @change="changeCity($event.target.value)">
        <option value="">请选择市</option>
        <option :value="item.id" v-for="item in cityData" :disabled="!cityData"  :selected="item.id==address.address_city_id">{{item.city_name}}</option>
      </select>
    </div>
    <div class="col-sm-2">
      <select class="form-control"  v-bind:value="address.address_district_id" @change="changeDist($event.target.value)">
        <option value="">请选择区</option>
        <option :value="item.id" v-for="item in distData" :disabled="!distData"  :selected="item.id==address.address_district_id">{{item.district_name}}</option>
      </select>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['value', 'address'],
    data: function () {
      return {
        provData: [],
        cityData: [],
        distData: []
      }
    },
    created: function () {
      this.getListProv(1, '')
      if (this.address.address_province_id) {
        this.getListProv(2, this.address.address_province_id)
      }
      if (this.address.address_city_id) {
        this.getListProv(3, this.address.address_city_id)
      }
    },
    methods: {
      getListProv: function (level, parentId) {
        var self = this
        var store = this.$store
        this.$parent.$parent.callAPI('GET', '/addressinfo/getaddress.json', {
          token: store.state.token,
          tokenid: store.state.tokenid,
          level: level,
          parent_id: parentId
        }, function (data) {
          if (level === 1) {
            self.provData = data.data
            self.cityData = []
            self.distData = []
            self.address.address_city_id = ''
            self.address.address_district_id = ''
          } else if (level === 2) {
            self.cityData = data.data
            self.distData = []
            self.address.address_district_id = ''
          } else if (level === 3) {
            self.distData = data.data
          }
        })
      },
      changeProv: function (value) {
        this.address.address_province_id = value
        this.getListProv(2, value)
        this.$emit('increment1', this.address)
      },
      changeCity: function (value) {
        this.address.address_city_id = value
        this.getListProv(3, value)
        this.$emit('increment1', this.address)
      },
      changeDist: function (value) {
        this.address.address_district_id = value
        this.$emit('increment1', this.address)
      }
    }
  }
</script>
