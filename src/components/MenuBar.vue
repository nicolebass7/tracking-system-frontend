<script setup>
import ocLogo from "/NewOCLogo.png";
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter } from "vue-router";


const user = ref(null);
const title = ref("Asset Tracking System");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const router = useRouter();

const resetMenu = () => {
  user.value = null;
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }
};

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then((response) => {
      console.log(response);
      Utils.removeItem("user");
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
});
</script>

<template>
  <div>
    <v-app-bar app style = "background-color:#811429; color:white">

      <router-link :to="{ name: 'AdminHomePage' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>

      </router-link> 
           
      <v-toolbar-title>
        {{ title }}
        
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user">

        <v-btn v-if="user.roleType=='admin'" class="mx-2" :to="{ name: 'AssetList' }"> Specific Asset </v-btn>
        <v-btn v-if="user.roleType=='admin'" class="mx-2" :to="{ name: 'GeneralAsset' }"> General Asset </v-btn>
        <v-btn v-if="user.roleType=='admin'" class="mx-2" :to="{ name: 'adminMaintainUsers' }"> Maintain Users </v-btn>
        <v-btn v-if="user.roleType=='admin'" class="mx-2" :to="{ name: 'PersonList' }"> Persons List </v-btn>
        <v-btn v-if="user.roleType=='manager'" class="mx-2" :to="{ name: 'AssetList' }"> Specific Asset </v-btn>
        <v-btn v-if="user.roleType=='manager'" class="mx-2" :to="{ name: 'GeneralAsset' }"> General Asset </v-btn>
        <v-btn v-if="user.roleType=='manager'" class="mx-2" :to="{ name: 'adminMaintainUsers' }"> Maintain Users </v-btn>
        <v-btn v-if="user.roleType=='manager'" class="mx-2" :to="{ name: 'PersonList' }"> Persons List </v-btn>

      </div>
      <v-menu bottom min-width="200px" rounded offset-y v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
  
  
  
</template>