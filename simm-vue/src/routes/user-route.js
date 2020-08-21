import processDef from "@/components/usercenter/process-def";
import authDef from "@/components/usercenter/data-auth-def";
import businessDataChart from "@/components/usercenter/business-data-chart";
import cmdView from "@/components/base/prod/category/adjust-controls/cmd-detail";
export default {
    routes: [
        {
            path: "/user/processdef",
            component: processDef,
            name: "processDef",
            description: "用户中心-流程定义",
        }, {
            path: "/user/authdef",
            component: authDef,
            name: "authDef",
            description: "用户中心-数据权限定义",
        }, {
            path: "/syscmd/view/:id",
            component: cmdView,
            name: "cmdView",
            description: "系统指令-详情预览",
        },{
            path: "/user/businessDataChart",
            component: businessDataChart,
            name: "businessDataChart",
            description: "用户中心-业务数据图表",
        }
    ]
}