<script setup>
import { ref, onMounted } from "vue";

import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const Person = ref({});


const props = defineProps({
  id: {
    required: true,
  },
});


const exit = () => {
  router.push({ name: "exit" });
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
        <v-toolbar-title>History</v-toolbar-title>
      </v-toolbar>
      <br />
     
      <br />
     

        <v-btn color="error" class="mr-4" @click="exit()"> Exit </v-btn>
     
    </v-container>
  </div>
</template>
