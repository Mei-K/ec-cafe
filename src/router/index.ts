import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/itemList",
    component: () => import("../views/itemList.vue"),
  },
  {
    path: "/registerUser",
    component: () => import("../views/RegisterUser.vue"),
  },
  {
    path: "/cartList",
    component: () => import("../views/cartList.vue"),
  },
  {
    path: "/itemDetail/:id",
    component: () => import("../views/itemDetail.vue"),
  },
  {
    path: "/loginUser",
    component: () => import("../views/loginUser.vue"),
  },
  {
    path: "/",
    component: () => import("../views/Home.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
