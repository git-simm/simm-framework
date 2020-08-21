<template>
  <section>
    <el-row>
      <!-- 售后地址维护 -->
      <el-col :span="24">
        <h4 class="text-theme">
          供应商售后地址
          <el-button size="small" @click="handleAdd">
            <i class="el-icon-plus" style="margin-right:5px;"></i>新增
          </el-button>
        </h4>
      </el-col>
      <el-col :span="24">
        <div class="afterSaleAddress">
          <el-table border size="mini" :data="tableData" style="width: 100%">
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  <i class="el-icon-delete" style="margin-right:5px;"></i>删除
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="contactPerson" label="售后信息">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="scope.row.contactPerson" type="text" placeholder="请输入姓名">
                      <template slot="prepend">联 系 人</template>
                    </el-input>
                  </el-col>
                  <el-col :span="12" style="padding-left:25px;">
                    <el-input v-model="scope.row.phoneNumber" type="tel" placeholder="请输入售后电话">
                      <template slot="prepend">售后电话</template>
                    </el-input>
                  </el-col>
                  <el-col :span="24" style="margin-top:5px;">
                    <el-input v-model="scope.row.address" type="text" placeholder="请输入售后地址">
                      <template slot="prepend">售后地址</template>
                    </el-input>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
export default {
  name: "EditAftersale",
  props: {
    baseData: {},
    entity: {}
  },
  data() {
    return {
      tableData: [],
      newCol: {
        contactPerson: "",
        phoneNumber: "",
        address: ""
      }
    };
  },
  //方法列表
  methods: {
    initData(entity) {
      this.tableData = entity || [];
      if (this.tableData.length == 0) {
        this.tableData.push(JSON.parse(JSON.stringify(this.newCol)));
      }
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      if (this.tableData.length == 0) {
        this.tableData.push(JSON.parse(JSON.stringify(this.newCol)));
      }
    },
    handleAdd() {
      this.tableData.push(JSON.parse(JSON.stringify(this.newCol)));
    },
    exec(cmd) {
      //只提交图片信息
      //this.$emit(cmd, this.getImgData());
    }
  }
};
</script>
