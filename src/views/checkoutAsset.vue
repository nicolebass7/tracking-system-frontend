<script setup>
import { ref, onMounted } from "vue";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import buildingServices from "../services/buildingServices";
import personServices from "../services/personServices.js";

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
const buildings = ref([]);
const persons = ref([]);
const message = ref("");
console.log('user', user.userId);

const checkoutAsset = ref({
  id: null,
  assetType: "",
  startDate: "",
  endDate: "",
  assetSerialNum:"",
  person:"",
  buildingName:"",
  room:"",
  
  
});

async function getAllPeople(){
  await personServices.getAll()
  .then((response) => {
    persons.value = response.data;
    persons.value.forEach(async element => {
                //console.log(element);
                await setFullName(element);
                
            });
   
     
    console.log(response.data);
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
}

async function setFullName(person) {
    person.fullName = person.fName + " " + person.lName;
}

async function saveInfo() {
    const data = {
    assetType: checkoutAsset.value.assetType,
    startDate: checkoutAsset.value.startDate,
    endDate: checkoutAsset.value.endDate,
    person: checkoutAsset.value.person,
    building: checkoutAsset.value.buildingName,
    room: checkoutAsset.value.room

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


async function getAllBuildings(){
  await buildingServices.getAll()
  .then((response) => {
    buildings.value = response.data;
   
     
    console.log(response.data);
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
}


const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}


function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

async function RadioButton() {
  if (person.checked) {
    building.disabled = true;
    person.disabled = false;
    console.log(person.data)
  } else {
    person.disabled = true;
    building.disabled = false;
  }
}


onMounted(async () => {
  user.value = Utils.getStore("user");
  await getAllBuildings();
  await getAllPeople();
  
  await RadioButton();
  
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title></v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>
      <h1>person:{{ person }}</h1>
      <br />

     

      <v-form ref="form" v-model="valid" lazy validation>
  
     
          <v-radio-group
          inline
          v-mpdel="person"
          >
            <v-radio
              color="indigo"
              label="person"
              value="person"
            ></v-radio>
            <v-radio
               color="indigo"
              label="building"
              value="building"
            ></v-radio>
            </v-radio-group>
        
       

        <v-responsive
        max-width="800">
      
        <v-row>    
          
          
          <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.AssetType"
          id="model"
          :counter="50"
          label="Asset Type "
          required
        ></v-text-field> </v-col>
        <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.assetSerialNum"
          id="model"
          :counter="50"
          label="Serial Number "
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
        <v-autocomplete
        :items=persons v-model="checkoutAsset.person"  item-value="id" item-title="name" label="Person"></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
        <v-autocomplete
        :items=buildings v-model="checkoutAsset.buildingName"  item-value="id" item-title="name" label="Building"></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
        <v-text-field
          v-model="saveInfo.room"
          id="name"
          :counter="50"
          label="Room"
          required
        ></v-text-field></v-col>
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

