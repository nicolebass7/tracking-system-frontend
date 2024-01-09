<script setup>
import { ref, onMounted } from "vue";
import requestServices from "../services/requestServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import studentServices from "../services/studentServices";

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
console.log('user', user.userId);

const student = ref({
  id: null,
  lName: "",
  fName: "",
  studentId: "",
  studentIdFK: "",
  grievances:"",
  semester:"",
  category: "",
  status: "pending"
});
async function getStudentInfo(){
  await studentServices.getUserId(user.userId)
  .then((response) => {
    student.value.studentIdFK = response.data[0].id;
    student.value.fName = response.data[0].fName;
    student.value.lName = response.data[0].lName;
    student.value.studentId = response.data[0].studentId;
    console.log('student', response.data[0])
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
}

async function saverequest() {
    const data = {
    studentId: student.value.studentIdFK,
    grievances: student.value.grievances,
    semester: student.value.semester,
    category: student.value.category,
    status: student.value.status

  };

    console.log('student', student)
    console.log('data', data)

  await requestServices.create(data)
    .then((response) => {
      student.value.id = response.data.id;
      console.log("add " + response.data);
      router.push({name: "Accommodations Background"})
      
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};


const cancel = () => {
  router.push({ name: "Accommodations Background" });
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

onMounted(() => {
  user.value = Utils.getStore("user");
  getStudentInfo();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Request Form</v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>

      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="student.fName"
          id="fName"
          :counter="50"
          label="First Name "
          readonly
          required
        ></v-text-field>
        <v-text-field
          v-model="student.lName"
          id="lName"
          :counter="50"
          label="Last Name "
          readonly
          required
        ></v-text-field>
        <v-text-field
          v-model="student.studentId"
          id="studentId"
          :counter="7"
          label="Student ID"
          readonly
          required
        ></v-text-field> 


<select v-model="student.semester">
  <option disabled value="">Please select one</option>
  <option>2023FA</option>
  <option>2024SP</option>
 
</select><br>

  <v-radio-group inline v-model="student.category">
  <v-radio label="Academic" value="academic" ></v-radio>
  <v-radio label="Chapel" value="chapel" ></v-radio>
  <v-radio label="Housing" value="housing" ></v-radio>
   <v-radio label="Meals" value="meals " ></v-radio>
</v-radio-group>

        <span>Requests:  </span>
          <p>{{ grievances }}</p>
          <textarea class= "wrap" id="grievances" v-model="student.grievances" placeholder="Type your grievances here..."></textarea>
        <br><br>

    
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saverequest"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
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
