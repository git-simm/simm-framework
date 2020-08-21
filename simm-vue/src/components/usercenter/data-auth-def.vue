<template>
<section class="content-section" style="position:relative;">
    <!-- 帮助文档 -->
    <el-header style="position:absolute;top:10px;right:0;">
        <a href="https://sxhimg.shixiangyiwei.com/upload/download/help.doc">帮助文档</a>
    </el-header>
    <div>
        <h4 class="text-theme">我的账号</h4>
        <h4>
            <span>
                <i class="el-icon el-icon-s-custom"></i>账号名称：
            </span>
            <span>
                <b>{{$store.state.user}}</b>
            </span>
        </h4>
        <h4>
            <span>
                <i class="el-icon el-icon-location"></i>账号类型：
            </span>
            <span>
                <b>{{account}}</b>
            </span>
        </h4>
        <p>
            <span style="font-size: large;">
                <i class="el-icon el-icon-key"></i>拥有角色：
            </span>
            <el-tag size="mini" effect="plain" v-for="(item,index) in (user.roleList||[])" :key="index">{{item.adminRoleName}}</el-tag>
        </p>
        <p>
            <span style="font-size: large;">
                <i class="el-icon el-icon-s-grid"></i>类目权限：
            </span>
            <el-tag size="mini" effect="plain" v-for="(item,index) in (user.categoryList||[])" :key="index">{{item.categoryName}}</el-tag>
        </p>
        <city-auth></city-auth>
        <el-divider></el-divider>
            <div v-if="user.isAgent !==1">
                <h4 class="text-theme">城市商品类目毛利率配置</h4>
                <catagory-city :showEdit="false" :showSearch="true" :showReturn="false" style="margin-bottom:20px;"></catagory-city>
            </div>
        </div>
    <el-card class="auth_data_card">
        <h4 class="text-theme">系统主流程定义</h4>
        <sxh-help-detail code="000101"></sxh-help-detail>
    </el-card>
    <el-card class="auth_data_card">
        <h4 class="text-theme">商品池数据权限定义</h4>
        <img src="/static/img/sys/prod_data_auth.png" />
        <div>
            <p>1、商品池分四个维度：总部、直购、省级、城市；</p>
            <p>2、各级账号只能编辑维护自己所在的商品池数据，比如：总部只能编辑总部账号创建的商品，武汉市账号只能编辑武汉账号创建的商品；</p>
            <p>3、商品的查询权限为树形管控模型，支持直系关系向上查询，不允许旁系查询。以城市(武汉)为例：可以向上看到武汉市商品池、湖北商品池、总部商品池，其他均不可见；</p>
        </div>
    </el-card>
    <el-card class="auth_data_card">
        <h4 class="text-theme">SGU池数据权限定义</h4>
        <img src="/static/img/sys/sgu_data_auth.png" />
        <div>
            <p>1、SGU池分四个维度：总部、直购、省级、城市；</p>
            <p>2、各级账号只能编辑维护自己所在的SGU池数据，比如：总部只能编辑总部账号创建的SGU，武汉市账号只能编辑武汉账号创建的SGU；</p>
            <p>3、SGU的查询权限为树形管控模型，支持直系关系向上查询，不允许旁系查询。以城市(武汉)为例：可以向上看到武汉市SGU池、湖北SGU池、总部SGU池，其他均不可见；</p>
            <p>4、总部账号可以查看直购SGU池，直购账号只允许看直购的SGU池；</p>
        </div>
    </el-card>
    <!-- <el-card>
      <sxh-cropper @success="imgCut" :option="{img:imgUrl,fixedNumber:[5,4]}"></sxh-cropper>
      <img :src="imgUrl" />
    </el-card>-->
</section>
</template>

<script>
import cityAuth from "@/components/usercenter/city-auth";
import catagoryCity from "@/components/client/level/category-city";

export default {
    name: "DataAuthDef",
    components: {
        cityAuth,
        catagoryCity
    },
    data() {
        return {
            imgUrl: null,
            user: this.$store.state.userInfo,
            tableData: {},
        };
    },
    computed: {
        account: function () {
            var user = this.user;
            var type = this.$cacheUtil.getVal("user_role_type", user.roleType, "");
            if (user.cityName > "") {
                return `${type} (${user.provinceName}-${user.cityName})`;
            } else if (this.user.provinceName > "") {
                return `${type} (${user.provinceName})`;
            }
            return type;
        }
    },
    methods: {
        imgCut(url) {
            this.imgUrl = url;
        }
    }
};
</script>

<style lang="less">
.auth_data_card {
    margin-bottom: 15px;
}
</style>
