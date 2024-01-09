<script setup>
import agreementServices from "../services/agreementServices";
import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const agreement = ref([]);
const user = Utils.getStore("user");
const message = ref("Do you agree for the information you are about to share can be shared with faculty and staff on campus to better help you?");

const props = defineProps({
  label: {
      type: String,
      default: ''
    },
   
});

const nextPage = () => {
  router.push({ name: "Accommodations Background" });

};
    
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title
          >Hello, {{ user.fName }} {{ user.lName }}!</v-toolbar-title
        >
      </v-toolbar>
      <br /><br />
      <v-card>
        <v-card-title> Agreement </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <div>
          <input
          id="checkbox-1"
          type="checkbox"
          v-model="agreement"
          
          />
          <label for="checkbox-1"> I agree </label>
          
          <br /><br />
          <v-btn id="button" color="success" class="mr-4" @click="nextPage"> Continue </v-btn>

        </div>
      </v-card>
    </v-container>
  </div>
</template>
