<script setup>
import { ref, onMounted } from "vue";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import addUserServices from "../services/addUserServices";
import departmentServices from "../services/departmentServices";
const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
const departments = ref([]);
const message = ref("");
console.log('user', user.userId);

const addUser = ref({
  id: null,
  lName: "",
  fName: "",
  email: "",
  roleType: "",
  schoolId: "",
  departmentId: "",
  departmentName:"",
  
});

async function getAllDepartments(){
  await departmentServices.getAll()
  .then((response) => {
    departments.value = response.data;
   
     
    console.log(response.data);
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
}


async function saveUser() {
    const data = {
    schoolId: addUser.value.schoolId,
    fName: addUser.value.fName,
    lName: addUser.value.lName,
    email: addUser.value.email,
    roleType: addUser.value.roleType,
    departmentId: addUser.value.departmentId

  };

    console.log('addUser', addUser)
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
  await getAllDepartments();
  
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Add New User</v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>

      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="addUser.fName"
          id="fName"
          :counter="50"
          label="First Name "
          required
        ></v-text-field>
        <v-text-field
          v-model="addUser.lName"
          id="lName"
          :counter="50"
          label="Last Name "
          required
        ></v-text-field>
        <v-text-field
          v-model="addUser.email"
          id="email"
          :counter="50"
          label="Email "
          required
        ></v-text-field>
        <v-text-field
          v-model="addUser.schoolId"
          id="addUserId"
          :counter="7"
          label="School ID" 
          required
        ></v-text-field> 


<select v-model="addUser.roleType">
  <option disabled value="">Select Role Type</option>
  <option>Admin</option>
  <option>Manager</option>
  <option>User</option>
</select><br><br>

<v-select :items=departments v-model="addUser.departmentId"  item-value="id" item-title="name">
  <option disabled value="">Select department</option>

</v-select><br><br>

   
        <v-btn
          :disabled="!valid"
          color="green"
          class="mr-4"
          @click="saveUser"
        >
          Save
        </v-btn>

        <v-btn color="white" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>
<style scoped>

  
  select {
  background-color: white;
  border: thin solid grey;
  border-radius: 4px;
  display: inline-block;
  font: inherit;
  line-height: 20px;
  padding: 8px 56px 8px 16px;
  background-image:
    linear-gradient(45deg, transparent 50%, gray 50%),
    linear-gradient(135deg, gray 50%, transparent 50%),
    linear-gradient(to right, #ccc, #ccc);
  background-position:
    calc(100% - 20px) 16px,
    calc(100% - 15px) 16px,
    calc(100% - 40px) 8px;
  background-size:
    5px 5px,
    5px 5px,
    1px 24px;
  background-repeat: no-repeat;
 
}




</style>
