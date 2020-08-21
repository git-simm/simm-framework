import DashView from "./components/Dash.vue";
import LoginView from "./components/Login.vue";
import NotFoundView from "./components/404.vue";
import BlankPage from "./components/blank.vue";
import IndexPage from "./components/Index.vue";
import erpRoute from "./routes/erp-route";
import orderRoute from "./routes/order-route";
import prodRoute from "./routes/prod-route";
import reportsRoute from "./routes/reports-route";
import settingRoute from "./routes/setting-route";
import settleRoute from "./routes/settle-route";
import sguRoute from "./routes/sgu-route";
import skuRoute from "./routes/sku-route";
import supplyClientRoute from "./routes/supply-client-route";
import supplyRoute from "./routes/supply-route";
import userRoute from "./routes/user-route";
//dash路由值
var dashRoutes = [
  ...erpRoute.routes,
  ...orderRoute.routes,
  ...prodRoute.routes,
  ...reportsRoute.routes,
  ...settingRoute.routes,
  ...settleRoute.routes,
  ...sguRoute.routes,
  ...skuRoute.routes,
  ...supplyClientRoute.routes,
  ...supplyRoute.routes,
  ...userRoute.routes
];
// Routes
const routesList = [
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/",
    component: DashView,
    meta: { requiresAuth: true },
    children: [
      ...[
        {
          path: "index",
          component: IndexPage,
          name: "首页",
        },
        {
          path: "/blank",
          component: BlankPage,
          name: "空白页",
        },
      ],
      ...dashRoutes,
    ],
  },
  {
    // not found handler
    path: "*",
    component: NotFoundView,
  },
];
/**
 * 获取需要缓存的路由信息
 * @param {*} routes 
 */
let getKeepAliveRoutes = routes => {
  var arr = [];
  routes.forEach(r => {
    if ((r.meta || {}).keepAlive) {
      r.meta.compName = r.component.name;
      arr.push(r.component.name);
    }
    if ((r.children || []).length > 0) {
      var children = getKeepAliveRoutes(r.children);
      children.forEach(child => {
        arr.push(child);
      })
    }
  });
  return arr;
}
let keepAlives = getKeepAliveRoutes(routesList);
export const routes = routesList;
export const keepAliveRoutes = keepAlives;
