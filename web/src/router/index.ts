import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../views/Home/index.vue")
  },
  {
    path: "/panel/:rid",
    component: () => import("../views/Panel/index.vue")
  },
  {
    path: "/setting",
    component: () => import("../views/Setting/index.vue")
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
