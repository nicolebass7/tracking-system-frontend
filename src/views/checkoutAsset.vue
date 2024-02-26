<script setup>
import { ref, onMounted } from "vue";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
//const departments = ref([]);
const message = ref("");
console.log('user', user.userId);

const checkoutAsset = ref({
  id: null,
  assetType: "",
  model: "",
  startDate: "",
  endDate: "",
  name: "",
  returning: "",
  assetSerialNum:"",
  
  
});

// async function getAllDepartments(){
//   await departmentServices.getAll()
//   .then((response) => {
//     departments.value = response.data;
   
     
//     console.log(response.data);
//     })
//     .catch((e) => {
//       message.value = e.response.data.message;
//     });
// }


async function saveInfo() {
    const data = {
    assetType: checkoutAsset.value.assetType,
    model: checkoutAsset.value.model,
    startDate: checkoutAsset.value.startDate,
    endDate: checkoutAsset.value.endDate,
    name: checkoutAsset.value.name,
    returning: checkoutAsset.value.returning,

  };

   
    console.log('data', data)

  await addUserServices.create(data)
    .then((response) => {
      addUser.value.id = response.data.id;
      console.log("add " + response.data);
      router.push({name: "AdminHomePage"})
      
      
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};


const cancel = () => {
  router.push({ name: "AdminHomePage" });
};


const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}


function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}



onMounted(async () => {
  user.value = Utils.getStore("user");
  //await getAllDepartments();
  
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Checkout Asset</v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>
      <br />

      <v-form ref="form" v-model="valid" lazy validation>

        <v-responsive
        max-width="800">

        <v-row>
        <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.name"
          id="name"
          :counter="50"
          label="Name"
          required
        ></v-text-field></v-col>
        <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.model"
          id="model"
          :counter="50"
          label="Asset Model "
          required
        ></v-text-field></v-col>
        <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.startDate"
          id="startDate"
          :counter="50"
          label="startDate "
          required
        ></v-text-field></v-col>
        <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.endDate"
          id="endDate"
          :counter="7"
          label="endDate" 
          required
        ></v-text-field></v-col>
        <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.assetSerialNum"
          id="name"
          :counter="50"
          label="Asset Serial Number "
          required
        ></v-text-field></v-col>


<v-select class="select" :items=departments v-model="saveInfo.AssetType"  item-value="id" item-title="name" label="AssetType">
 
</v-select>
<v-col
          cols="12"
          sm="6"
        >
<v-checkbox
            v-model="ex4"
            label="Return Asset"
            value="ReturnAsset"
            hide-details
          ></v-checkbox></v-col>

</v-row>   </v-responsive>

   
        <v-btn
          :disabled="!valid"
          color="green"
          class="mr-4"
          @click="saveInfo" 
        >
          Save
        </v-btn>
        <v-btn  class="cancel" @click="cancel">Cancel</v-btn>
        
        
      </v-form>
    </v-container>
  </div>
</template>
<style scoped>


.select {
      max-width: 400px;
      
    }

</style>
