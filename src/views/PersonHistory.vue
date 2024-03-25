<script setup>
import { ref, onMounted } from "vue";
import PersonServices from "../services/personServices";
import { useRouter } from "vue-router";
import assetStatusServices from "../services/assetStatusServices";
import specificAssetServices from "../services/specificAssetServices";

const router = useRouter();
const valid = ref(false);
const persons = ref({});
const assetStatus = ref({});
const specificAsset = ref({});
const asset = ref({});
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
      console.log('test',assetStatus.value[0].specificAsset.status);

      assetStatus.value.specificAsset.forEach(async asset => {
        if(asset.status == "checked-out") {

          console.log('test',asset.status);
          // await retrieveMake();
          // await retrieveModel();
          // displayCheckedOutAsset.value.push(asset);
        }
        console.log(asset);

        if(asset.status  == "checked-in") {
          await retrieveMake();
          await retrieveModel();
          displayCheckInAsset.value.push(asset);
        }
      })

    }
  )
  .catch ((e) =>  {
    message.value = e.response.data.message;
  })
};


async function retrieveMake(makeId, asset) {
    await makeServices.get(makeId)
        .then((response) => {
            asset.make = response.data.make;            
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retrieveModel(modelId, asset) {
    await modelServices.get(modelId)
        .then((response) => {
            asset.model = response.data.model;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}


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
          <v-tab value="one">Current Assets</v-tab>
          <v-tab value="two">Past Assets</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="one">
              One
            </v-window-item>

            <v-window-item value="two">
              Two
            </v-window-item>

          </v-window>
        </v-card-text>
      </v-card>   
     
    
      <br />
        <v-btn color="#a8dadc" class="mr-4" @click="back()"> Back </v-btn>
     
    </v-container>
    
  </div>
</template>
