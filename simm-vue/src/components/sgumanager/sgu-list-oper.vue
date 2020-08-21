<template>
  <span>
    <span v-if="checkEdit(scope.row) && canOnSale(scope.row)">
      <router-link
        v-permission="
                  $permission.getCode(modeValid, {
                    1: `sgu_manager_edit`,
                    2: `sgu_manager_edit_2`,
                    3: `sgu_manager_edit,sgu_manager_edit_2`
                  })
                "
        :to="'/sgumanager/edit/' + scope.row.id"
      >
        <el-button plain size="minier">编辑</el-button>
      </router-link>
    </span>
    <span v-if="auditAuth(scope.row)">
      <el-button
        plain
        size="minier"
        v-permission="
                  $permission.getCode(modeValid, {
                    1: `sgu_manager_copy`,
                    2: `sgu_manager_copy_2`,
                    3: `sgu_manager_copy,sgu_manager_copy_2`
                  })
                "
        @click="copySgu(scope.row)"
      >复制SGU</el-button>
    </span>
    <!-- 代理 或者 非下架状态的SGU(团购/直购)允许再直接修改时间重新上架 -->
    <span
      v-if="(userInfo.isAgent===1 || scope.row.onSale!==0) && auditAuth(scope.row) && canOnSale(scope.row)"
    >
      <el-button
        plain
        size="minier"
        v-permission="
                  $permission.getCode(modeValid, {
                    1: `sgu_set_on_sale`,
                    2: `sgu_set_on_sale_2`,
                    3: `sgu_set_on_sale,sgu_set_on_sale_2`
                  })
                "
        @click="baseData.onSaleOpera(scope.row)"
      >
        {{
        scope.row.onSale == 1 ? "下架时间" : "上架时间"
        }}
      </el-button>
    </span>
    <span
      v-if="null != scope.row.sysAudit"
      v-permission="
                $permission.getCode(modeValid, {
                  1: `sgu_manager_audit`,
                  2: `sgu_manager_audit_2`,
                  3: `sgu_manager_audit,sgu_manager_audit_2`
                })
              "
    >
      <router-link :to="`/sgumanager/audit/${scope.row.id}/${scope.row.sysAudit.id}`">
        <el-button plain size="minier">审核</el-button>
      </router-link>
    </span>
    <sxh-dropdown :key="`${scope.row.id}-${Math.random()}`">
      <el-dropdown-item v-if="auditAuth(scope.row)">
        <div
          v-permission="
                    $permission.getCode(modeValid, {
                      1: `sgu_set_sort`,
                      2: `sgu_set_sort_2`,
                      3: `sgu_set_sort,sgu_set_sort_2`
                    })
                  "
          @click="showSortDialog(scope.row)"
        >排序</div>
      </el-dropdown-item>
      <el-dropdown-item
        v-permission="
                  $permission.getCode(modeValid, {
                    1: `sgu_set_role`,
                    2: `sgu_set_role_2`,
                    3: `sgu_set_role,sgu_set_role_2`
                  })
                "
      >
        <div @click="resetRole(scope.row)">重置归属</div>
      </el-dropdown-item>
      <el-dropdown-item
        v-permission="
                  $permission.getCode(modeValid, {
                    1: `sgu_set_es`,
                    2: `sgu_set_es_2`,
                    3: `sgu_set_es,sgu_set_es_2`
                  })
                "
      >
        <div @click="resetES(scope.row)">重置ES状态</div>
      </el-dropdown-item>
      <el-dropdown-item v-if="checkEdit(scope.row)">
        <div
          v-permission="
                    $permission.getCode(modeValid, {
                      1: `sgu_manager_update_img`,
                      2: `sgu_manager_update_img_2`,
                      3: `sgu_manager_update_img,sgu_manager_update_img_2`
                    })
                  "
          @click="updateImages(scope.row)"
        >更新图片</div>
      </el-dropdown-item>
      <!-- 下架状态且在自己的SGU池内且有删除权限才能删除 -->
      <el-dropdown-item
        v-if="((scope.row.onSale == 0 && scope.row.processStatus == 3 && dataAuth(scope.row)) || checkDelete(scope.row)) "
      >
        <div
          v-permission="
                    $permission.getCode(modeValid, {
                      1: `sgu_manager_del`,
                      2: `sgu_manager_del_2`,
                      3: `sgu_manager_del,sgu_manager_del_2`
                    })
                  "
          @click="deleteSGU(scope.row.id)"
        >删除</div>
      </el-dropdown-item>
    </sxh-dropdown>
    <el-dialog title="修改排序码" width="500px" :visible.sync="sortDialog.visible">
      <el-row>
        <span>
          排序码&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input
            style="width:80%"
            placeholder="请输入排序码"
            v-model.number="sortDialog.sort"
            type="number"
            :min="0"
          ></el-input>
        </span>
      </el-row>
      <el-row>
        <el-col :span="24" style="float:right;padding-top:10px;padding-left:240px;">
          <el-button type="primary" @click="saveSortDialog()">确 认</el-button>
          <el-button @click="cancelSortDialog()">取 消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </span>
</template>
<script>
import sguListValid from "@/components/sgumanager/sgu-list-valid";
import sguCommonHandler from "@/components/sgumanager/controls/sgu-common-handler";
export default {
  name: "sguListOper",
  mixins: [sguListValid, sguCommonHandler],
  props: {
    scope: {
      type: Object,
      default: function() {
        return {};
      }
    },
    pageMode: {
      required: true,
      type: Number
    },
    baseData: {
      type: Object,
      required: true,
      default: function() {
        return {
          onSaleOpera: null
        };
      }
    }
  },
  data() {
    return {
      sortDialog: {
        visible: false,
        id: "",
        sort: ""
      },
      userInfo: this.$store.state.userInfo
    };
  },
  methods: {
    /**
     * 重置数据归属
     */
    resetRole: function(row) {
      var self = this;
      this.$httpUtil.post({
        url: "/sguBaseInfo/resetRole.json",
        data: {
          id: row.id
        },
        contentType: "json", //json,form,multipart
        succ: function() {
          self.$message({
            message: "重置成功",
            type: "success"
          });
        }
      });
    },
    /**
     * 重置ES状态
     */
    resetES: function(row) {
      var self = this;
      this.$httpUtil.post({
        url: "/sguBaseInfo/resetES.json",
        data: {
          id: row.id
        },
        contentType: "json", //json,form,multipart
        succ: function() {
          self.$message({
            message: "重置成功",
            type: "success"
          });
        }
      });
    },
    // 更新图片
    updateImages: function(row) {
      var self = this;
      this.$httpUtil.post({
        url: "/sguBaseInfo/updatePicture.json",
        data: {
          id: row.id
        },
        contentType: "json", //json,form,multipart
        succ: function() {
          self.$message({
            message: "更新" + row.sguNumber + "商品图片成功",
            type: "success"
          });
        }
      });
    },
    copySgu(row) {
      this.validCommActiveStatus(row, row => {
        this.$router.push({ path: "/sgumanager/copy/" + row.id });
      });
    },
    // 校验供应商交行账号激活状态
    validCommActiveStatus(row, callBack) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/getCommActiveStatus.json",
        data: { supplyId: row.supplyId },
        contentType: "form", //json,form,multipart
        succ: function() {
          self.validSguCopy(row, callBack);
        }
      });
    },

    validSguCopy(row, callBack) {
      var self = this;
      // 直购、省级&全国团购复制 直接跳转
      if (row.distributionType == 1 || self.userInfo.roleType < 2) {
        this.$router.push({ path: "/sgumanager/copy/" + row.id });
        return;
      }
      // 城市复制 校验城市&供应商
      this.$httpUtil.post({
        url: "/sguBaseInfo/validSguCopy.json",
        data: {
          supplyId: row.supplyId,
          cityId: self.userInfo.cityId,
          deliveryType: row.deliveryType,
          id: row.id
        },
        contentType: "json", //json,form,multipart
        succ: function() {
          if (callBack) {
            callBack(row);
          }
        }
      });
    },
    checkDelete(item) {
      var userInfo = this.$store.state.userInfo;
      return (
        userInfo.id === item.creatorId &&
        (item.processStatus == -2 || item.processStatus === 0)
      );
    },
    /**
     * 删除SGU
     */
    deleteSGU: function(id) {
      var self = this;
      this.$commonUtil.message.confirm("确定删除SGU?", () => {
        self.$httpUtil.post({
          url: "/sguBaseInfo/deleteSGU.json",
          data: {
            sguId: id
          },
          contentType: "form",
          succ: function() {
            self.$message({
              message: "删除成功",
              type: "success"
            });
            self.getListData();
          }
        });
      });
    },
    showSortDialog: function(item) {
      this.sortDialog.visible = true;
      this.sortDialog.id = item.id;
      this.sortDialog.creatorRole = item.creatorRole;
      this.sortDialog.sort = item.sort;
    },

    cancelSortDialog: function() {
      this.sortDialog.id = "";
      this.sortDialog.sort = "";
      this.sortDialog.creatorRole = "";
      this.sortDialog.visible = false;
    },
    getListData() {
      this.$emit("refresh", {});
    },
    /**
     * 保存排序对话框
     */
    saveSortDialog: function() {
      let self = this;
      this.validSort(this.sortDialog.creatorRole, this.sortDialog.sort);
      self
        .$confirm("确定调整排序码？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          // dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          this.$httpUtil.post({
            url: "/sguBaseInfo/sortList.json",
            data: this.sortDialog,
            contentType: "json", //json,form,multipart
            succ: function(data) {
              if (data) {
                self.$message({
                  message: "设置成功",
                  type: "success"
                });
                self.getListData();
              }
            }
          });
          this.sortDialog.visible = false;
        })
        .catch(() => {});
    }
  }
};
</script>