import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Agreement from "./views/AgreementPage.vue";
import Accommodations from "./views/AccommodationsBackground.vue";
import newRequest from "./views/newRequest.vue";
import AdminMaintainUsers from "./views/AdminMaintainUsers.vue"
import ViewRequest from "./views/ViewRequest.vue"


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
      path: "/AccommodationsBackground",
      name: "Accommodations Background",
      component: Accommodations,
    },
    
  ],   
  
});

export default router;