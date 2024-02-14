<script setup>
import { ref, onMounted } from "vue";
import PersonServices from "../services/personServices";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const persons = ref({});
const message = ref({});


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
     
    

        <v-btn color="error" class="mr-4" @click="exit()"> Exit </v-btn>
     
    </v-container>
  </div>
</template>
