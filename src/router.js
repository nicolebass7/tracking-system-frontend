import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Agreement from "./views/AgreementPage.vue";
import AdminHomePage from "./views/AdminHomePage.vue";
import newRequest from "./views/newRequest.vue";
import ManagementHomePage from "./views/ManagementHomePage.vue";
import UserHomePage from "./views/UserHomePage.vue";
import ViewRequest from "./views/ViewRequest.vue"
import Accommodations from "./views/AccommodationsBackground.vue";
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
      path: "/viewRequest:id",
      name: "viewRequest",
      component: ViewRequest,
      props: true,
    },
    {
      path: "/request",
      name: "request",
      component: newRequest,
      props: true,
    },

    {
      path: "/agreement",
      name: "agreement",
      component: Agreement,
      
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
    
  ],   
  
});

export default router;