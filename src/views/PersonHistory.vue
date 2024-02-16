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


const exit = () => {
  router.push({ name: "ManagementHomePage" });
};

async function retrievePerson(){
  await PersonServices.get(props.id)
  .then((response) => {
    Person.value = response.data;
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
        <v-btn color="error" class="mr-4" @click="exit()"> Exit </v-btn>
     
    </v-container>
    
  </div>
</template>
