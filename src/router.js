import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import AdminHomePage from "./views/AdminHomePage.vue";
import ManagementHomePage from "./views/ManagementHomePage.vue";
import UserHomePage from "./views/UserHomePage.vue";
import addNewUser from "./views/addNewUser.vue";



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
    
  ],   
  
});

export default router;