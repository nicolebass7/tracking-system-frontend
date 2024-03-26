<script setup>
import { ref, onMounted } from "vue";
import PersonServices from "../services/personServices";
import { useRouter } from "vue-router";
import assetStatusServices from "../services/assetStatusServices";
import assetServices from "../services/assetServices";

const router = useRouter();
const valid = ref(false);
const persons = ref({});
const assetStatus = ref({});
const displayCheckedOutAsset = ref([]);
const displayCheckedInAsset = ref([]);
const message = ref({});
const tab = ref(null)

const props = defineProps({
  id: {
    required: true,
  },
});


const back = () => {
  router.push({ name: "PersonList" });
};

async function retrievePerson(){
  await PersonServices.get(props.id)
  .then((response) => {
    persons.value = response.data;
  })
  .catch((e) => {
    message.value = e.response.data.message;
  });
};

async function retrieveAssetStatus(){
  await assetStatusServices.getForPerson(props.id)
  .then ((response) => {
      assetStatus.value = response.data;
      console.log('assetStatus', response);

      assetStatus.value.forEach(async assetStatus => {
        if(assetStatus.specificAsset.status == "checked-out") {
           
            assetStatus.fullName = assetStatus.specificAsset.asset.make.make + " " + assetStatus.specificAsset.asset.model.model;
            displayCheckedOutAsset.value.push(assetStatus.fullName);  

           console.log("displayCheckout", displayCheckedOutAsset);
        }

        if(assetStatus.specificAsset.status == "checked-in") {

          const dateFromDb = assetStatus.checkin;
          const dateForUi = new Date(dateFromDb).toLocaleDateString();
          
          assetStatus.fullName = assetStatus.specificAsset.asset.make.make + " " + assetStatus.specificAsset.asset.model.model + " " + "Checked-In date: " + dateForUi;
          displayCheckedInAsset.value.push(assetStatus.fullName);  

          console.log("displayCheckin", displayCheckedInAsset);
        }
      })

    }
  )
  .catch ((e) =>  {
    message.value = e.response.data.message;
  })
};


onMounted(async () => {
  await retrievePerson();
  await retrieveAssetStatus();
 
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ persons.fName }} {{ persons.lName }}</v-toolbar-title>
      </v-toolbar>
      <br />
      
      <br />
      <v-card>
        <v-tabs
          v-model="tab"
          bg-color="primary"
        >
          <v-tab value="checkedOutAssets">Current Assets</v-tab>
          <v-tab value="checkedInAssets">Past Assets</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="checkedOutAssets">
              <v-list :items="displayCheckedOutAsset"></v-list>
            </v-window-item>

            <v-window-item value="checkedInAssets">
              <v-list :items="displayCheckedInAsset"></v-list>
            </v-window-item>

          </v-window>
        </v-card-text>
      </v-card>   
     
    
      <br />
        <v-btn color="#a8dadc" class="mr-4" @click="back()"> Back </v-btn>
     
    </v-container>
    
  </div>
</template>
