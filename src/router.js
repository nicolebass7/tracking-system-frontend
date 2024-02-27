import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import AssetList from "./views/AssetList.vue"
import AdminMaintainUsers from "./views/AdminMaintainUsers.vue"
import AdminHomePage from "./views/AdminHomePage.vue";
import ManagementHomePage from "./views/ManagementHomePage.vue";
import UserHomePage from "./views/UserHomePage.vue";
import addNewUser from "./views/addNewUser.vue";
import addAsset from "./views/addAsset.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
    
    {
      path: "/adminMaintainUsers",
      name: "adminMaintainUsers",
      component: AdminMaintainUsers,
    },
    {
      path: "/AssetList",
      name: "AssetList",
      component: AssetList,
    },
    {
      path: "/AdminHomePage",
      name: "AdminHomePage",
      component: AdminHomePage,

    },
    {
      path: "/ManagementHomePage",
      name: "ManagementHomePage",
      component: ManagementHomePage,
    },
    {
      path: "/UserHomePage",
      name: "UserHomePage",
      component: UserHomePage,
    },

    {
    path: "/addNewUser",
    name: "addNewUser",
    component: addNewUser,
    props: true,
  },
  {
    path: "/addAsset",
    name: "addAsset",
    component: addAsset,
  },
    
  ],   
  
});

export default router;