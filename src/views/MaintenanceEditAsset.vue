<script setup>
import { ref, onMounted } from "vue";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import logMaintenanceServices from "../services/logMaintenanceServices";

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
const departments = ref([]);
const message = ref("");
console.log('user', user.userId);

const assetDetails = ref({
  id: null,
  name: "",
  date: "",
  type: "",
  comments:"",
  specficAssetId: "",
  
  
});
const props = defineProps({
  id: {
    required: true,
  },
});


async function retrieveSpecificAssets(specificAssets) {
    await specificAssetServices.get(props.id)
        .then((response) => {
            specificAssets = response.data;
            console.log(response.data);
            
        
        specificAssets.value.forEach(specificAssets => {
                displayedSpecificAsset.value.push(specificAssets);
                

            })
            console.log(displayedSpecificAsset);



        })
        .catch((e) => {
            message.value = e.response.data.message;

        });

    }




async function saveAssetInfo() {
    const data = {
        name: assetDetails.value.name,
        date: assetDetails.value.date,
        type: assetDetails.value.type,
        comments: assetDetails.value.comments,
        specficAssetId: assetDetails.value.specficAssetId,
    

  };

    console.log('data', data)

  await logMaintenanceServices.create(data)
    .then((response) => {
      addUser.value.id = response.data.id;
      console.log("add " + response.data);
      router.push({name: "MaintenanceAssetList"})
      
      
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};


const cancel = () => {
  router.push({ name: "MaintenanceAssetList" });
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
  await retrieveSpecificAssets();
  
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>view/edit Asset</v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>

      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="assetDetails.name"
          id="name"
          :counter="50"
          label="Name "
          required
          read-only
        ></v-text-field>
       
        <v-text-field
          v-model="assetDetails.date"
          id="date"
          :counter="50"
          label="Date "
          required
        ></v-text-field>
        



<v-select class="select" :items="['Fixed','Upgrade']"  v-model="assetDetails.type" label="Select Type">

</v-select>

<span>Comments:  </span>
          <p>{{ comments }}</p>
          <textarea class= "wrap" id="comments" v-model="student.grievances" placeholder="Type your grievances here..."></textarea>
        <br><br>



   
        <v-btn
          :disabled="!valid"
          color="green"
          class="mr-4"
          @click="saveAssetInfo" 
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
