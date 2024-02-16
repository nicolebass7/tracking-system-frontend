<script setup>

import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tutorials = ref([]);
const user = Utils.getStore("user");

function directpage(name){
  if(name === 'Add Users'){
    router.push({ path: "addNewUser" });
  } else if (name === 'Maintain Users') {
    router.push({ path: "adminMaintainUsers" }); // Adjust the path according to your route configuration
  }
}

</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title
          >Hello, {{ user.fName }} {{ user.lName }}!</v-toolbar-title
        >
      </v-toolbar>
    </v-container>
  </div>

  <v-container fluid fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-row justify="center">
          <v-col v-for="(button, index) in buttons.slice(0, 2)" :key="index" cols="12" md="6">
            <v-btn
            color="primary"
            width="300px"
              size = "x-large"
              elevation="3"
              class="elevated-button; pa-4 mx-10"
            >
              {{ button }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col v-for="(button, index) in buttons.slice(2)" :key="index" cols="12" md="6">
            <v-btn
            @click = directpage(button) 
            color="primary"
            width="300px"
              size= "x-large"
              elevation="3"
              class="elevated-button; pa-4 mx-10"
            >
              {{ button }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      buttons: ['Asset List', 'Reports', 'Add Users', 'Maintain Users']
    };
  }
};
</script>

<style scoped>
.elevated-button {
  margin-bottom: 50px;
}
</style>

     
    
  
