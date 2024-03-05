<script setup>
import { ref, onMounted } from "vue";
import SpecificAssetServices from "../services/specificAssetServices";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const specificAssets = ref({});
const message = ref({});
const tab = ref(null)

const props = defineProps({
  id: {
    required: true,
  },
});


const back = () => {
  router.push({ name: "AssetList" });
};

async function retrieveSpecificAsset(){
  await SpecificAssetServices.get(props.id)
  .then((response) => {
    specificAssets.value = response.data;
    retrieveAsset(asset.id);
    retrieveMake(asset.makeId);
    retrieveModel(asset.modelId);
    console.log("here: ", response.data);
  })
  .catch((e) => {
    message.value = e.response.data.message;
  });
};

async function retrieveAsset(asset) {
    await assetServices.get(asset.assetId)
        .then((response) => {
            generalAssets.value.set(response.data.id, response.data)
            console.log(generalAssets.value)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}

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
  await retrieveSpecificAsset();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ make.name }} {{ model.name }} </v-toolbar-title>
      </v-toolbar>
      <br />
      
      <br />
      <v-card>
        <v-tabs
          v-model="tab"
          bg-color="primary"
        >
          <v-tab value="one">Maintenance</v-tab>
          <v-tab value="two">More Details</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="one">
        <v-card-text>
          <v-responsive
        max-width="800">

        <v-row>
      
          <v-col
          cols="12"
          sm="6">
          <v-text-field
            label="Serviced Date:"
            placeholder="02/12/2024"
          ></v-text-field>
          </v-col>
          <v-col
          cols="12"
          sm="6">
          <v-text-field
            label="Serviced By:"
            placeholder="Nicole Bass"
          ></v-text-field>
            </v-col>
            <v-col
          cols="12"
          sm="6">
          <span>Comments:  </span>
          <p>{{ comments }}</p>
          <textarea class= "wrap" id="grievances" placeholder="Type comments here..."></textarea></v-col>
          </v-row>
          </v-responsive>
        </v-card-text>
          
      </v-window-item>
            
            <v-window-item value="two">

              <v-card-text>
          <v-responsive
        max-width="800">

        <v-row>
          <v-col
            cols="12"
            sm="6">
          <v-text-field
            label="Equiment Description:"
            placeholder="FY2006 - Third Shipment"
          ></v-text-field></v-col>    
          <v-col
            cols="12"
            sm="6">
          <v-text-field
            label="Equiment Purchase Date:"
            placeholder="01-01-2024"
          ></v-text-field></v-col>      
          <v-col
          cols="12"
          sm="6">
          <v-text-field
            label="Equiment Memory:"
            placeholder="1 GB DDR2 PC2400 SDRAM"
          ></v-text-field>
          </v-col>
          <v-col
          cols="12"
          sm="6">
          <v-text-field
            label="Equiment HardDrive:"
            placeholder="60GB EIDE/ATA 100 7200 rpm"
          ></v-text-field>       
            </v-col>
            <v-col
            cols="12"
            sm="6">
            <v-text-field
            label="Equiment Processor:"
            placeholder="2.13 GHz Intel Pentium M"
          ></v-text-field></v-col>
          <v-col
            cols="12"
            sm="6">
          <v-text-field
            label="Equiment Features:"
            placeholder="14.1' SXGA TFT LCD"
          ></v-text-field></v-col>
          <v-col
            cols="12"
            sm="6">
          <v-text-field
            label="Equiment Accessories:"
            placeholder="65-Watt AC Power Adapter"
          ></v-text-field></v-col>
          
          </v-row>
          </v-responsive>
        </v-card-text>
              
            </v-window-item>

          </v-window>
        </v-card-text>
      </v-card>   
     
    
      <br />
        <v-btn color="error" class="mr-4" @click="back()"> Back </v-btn>
     
    </v-container>
    
  </div>
</template>
<style scoped>


textarea {
    white-space: pre-line;
    width: 450px;
    height: 150px;
    border:3px solid #CCC;
    border-radius: 4px;
    resize: both;
  
}

.wrap {
    position: relative;
    display: inline-block;
}
  
.wrap:after {
    content:"";
    border-top: 2px solid #555;
    width:16px;
    transform: rotate(-45deg);
    background:transparent;
    position: absolute;
    right: 1px;
    bottom: 14px;
    pointer-events: none;
    border-radius:25%;
}


</style>

