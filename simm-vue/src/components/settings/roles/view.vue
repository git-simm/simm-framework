<template>
  <section class="content-section" id="proadd">
    <div class="row">
      <div class="col-sm-8">
        <el-form :model="request" ref="formDate" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色编码：">
                <p>{{request.admin_role_no}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色名称：">
                <p>{{request.admin_role_name}}</p>
              </el-form-item>
           </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="角色说明：">
                <p>{{request.admin_role_desc}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色类型：">
                <p v-if="request.admin_role_type === '1'">平台级可授角色</p>
                <p v-if="request.admin_role_type === '2'">供应商可授角色</p>
                <p v-if="request.admin_role_type === '3'">分站可授角色</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="角色状态：">
            <p v-if="request.status === 1">启用</p>
            <p v-if="request.status === 0">禁用</p>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单权限：">
                <el-tree
                  :data="menuButtonData"
                  node-key="id"
                  ref="tree"
                  highlight-current
                  :default-expanded-keys="menuButtonMap"
                  :props="defaultProps">
                </el-tree>
              </el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="资源权限：">
                <el-tree
                  :data="resourceData"
                  node-key="id"
                  ref="sourceTree"
                  highlight-current
                  :default-expanded-keys="resourceCheckMap"
                  :props="defaultProps">
                </el-tree>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <router-link to="/settings/roles/list" class="ml-10"><el-button > 返回</el-button></router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'SupplySettingsRolesView',
    data: function () {
      return {
        roleData: [],
        resourceData:[],
        resourceCheckMap:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        siteData: [],
        selroleIds: [],
        this_user_type: '',
        request: {
          admin_role_name: '',
          admin_role_no: '',
          admin_role_desc: '',
          admin_role_type: '',
        },
        menuButtonMap: [],
        menuButtonData: []
      }
    },
    created: function () {
      this.getAllCategory();
    },
    methods: {
        getAllCategory() {
          var self = this;
          var store = this.$store;
          var jsondata = {};
          jsondata = {
              token: store.state.token,
              tokenid: store.state.tokenid,
          };
          this.$httpUtil.post({
              url: '/adminRole/getRoleResource.json',
              data: jsondata,
              contentType: 'form', //json,form,multipart
              succ: function (data) {
                  self.resourceData = data.data;
                  self.getDetail();
              },
          });
      },
      getDetail: function () {
        var self = this;
        var store = this.$store;
        var id = self.$route.params.id;
        this.$parent.callAPI('GET', '/adminRole/getDetail.json', {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: id,
        }, function (data) {
          self.request = data.data.roleMap;
          self.request.admin_role_type = String(self.request.admin_role_type);
          self.menuButtonData = data.data.menuButtonData;
          self.menuButtonMap = data.data.menuButtonMap;
          self.resourceCheckMap = data.data.categoryList;
          const filterMethod = function(srclist,idList){
            srclist = srclist.filter(a => idList.includes(a.id) || a.id.split('_')[1] == '9999999');
            for(var index in srclist){
              let node = srclist[index]
              if(node.children)
                node.children = filterMethod(node.children,idList)
            }
            return srclist
          }
          self.resourceData = filterMethod(self.resourceData,self.resourceCheckMap);
        })
      }
    }
  }
</script>
