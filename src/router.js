import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
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
      path: "/addNewUser",
      name: "addNewUser",
      component: addNewUser,
      props: true,
    },

   
    {
      path: "/AccommodationsBackground",
      name: "Accommodations Background",
      component: Accommodations,
    },
    
  ],   
  
});

export default router;