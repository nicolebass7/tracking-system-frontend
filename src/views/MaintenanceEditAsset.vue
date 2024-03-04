<script setup>
import { ref, onMounted } from "vue";
import PersonServices from "../services/personServices";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const persons = ref({});
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

async function retrievePerson(){
  await PersonServices.get(props.id)
  .then((response) => {
    persons.value = response.data;
  })
  .catch((e) => {
    message.value = e.response.data.message;
  });
};



onMounted(async () => {
  await retrievePerson();
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
          <v-tab value="one">Maintenance</v-tab>
          <v-tab value="two">More Details</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="one">
        <v-card-text>
          <v-text-field
            label="Serivced Date"
          ></v-text-field>
          <v-text-field
            label="Serviced By:"
            placeholder="Nicole Bass"
          ></v-text-field>
          <span>Comments:  </span>
          <p>{{ comments }}</p>
          <textarea class= "wrap" id="grievances" placeholder="Type comments here..."></textarea>
        </v-card-text>
      </v-window-item>
            
            <v-window-item value="two">
              
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

