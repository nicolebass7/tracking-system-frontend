import { VContainer } from 'vuetify/lib/components';

<style scoped></style>
<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter } from "vue-router";
import userServices from "../services/userServices";
import departmentServices from "../services/departmentServices"


const router = useRouter();
const users = ref([]);
const displayedUsers = ref([]);
const departments = ref([]);
const normalUsers = ref([]);
const managerUsers = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);
const roles = ref([]);
const selectedRoles = ref([]);
const selectedDepartments = ref([]);
const roleChangeConfirm = ref(false);
const confirmRole = ref("");
const changeRoleUser = ref("");

function searchUser() {
    displayedUsers.value = [];
    console.log("Search keyword is " + keyword.value);
    if (keyword.value != "") {
        users.value.forEach(user => {
            if (user.schoolId != null) {
                if (user.schoolId.toString().includes(keyword.value)) {
                    console.log("id match")

                    displayedUsers.value.push(user);
                };
            };
            if (user.fullName != null) {
                if (user.fullName.toLowerCase().includes(keyword.value.toLocaleLowerCase())) {
                    console.log("name match")
                    displayedUsers.value.push(user)
                };
            };
        });
    };
    if (displayedUsers.value.length == 0) {
        users.value.forEach(user => {
            displayedUsers.value.push(user);
        })
        snackbar.value = true;
    };
};
function filter () {
    displayedUsers.value = [];
    //var filterList = [];

    // filterList.push(filterDepartments());
    // filterList.push(filterRoles()); 
  
    filterDepartments().forEach(e => {
        if(!displayedUsers.value.includes(e)) displayedUsers.value.push(e);
    });
    filterRoles().forEach(e => {
        if(!displayedUsers.value.includes(e)) displayedUsers.value.push(e);
    });
    console.log(displayedUsers.value);
    
    if (displayedUsers.value.length == 0) {
        users.value.forEach(user => {
            displayedUsers.value.push(user);
        })
    };
}

function filterDepartments() {
    var returnedUsers = [];
    var departmentId = null;
    users.value.forEach(user => {
        selectedDepartments.value.forEach(async department => {
            departments.value.forEach(e => {
                console.log(e.name + " = " + department + " " + e.id);

                if (e.name == department) {
                    console.log("true");
                    departmentId = e.id
                };
            })
            console.log("selected departmentID: " + departmentId);
            console.log("selected user departmentID" + user.departmentId);
            if (user.departmentId == departmentId) {
                returnedUsers.push(user);
                console.log(user);
            };
        })
    })
    return returnedUsers;

}
function filterRoles() {
    var returnedUsers = [];
    users.value.forEach(user => {
        selectedRoles.value.forEach(role => {
            if(user.roleType == role){
                returnedUsers.push(user);
            }
        })
    })
    return  returnedUsers;

}
function searchUserName(search) {
    let returnArr = [];
    for (let [key, value] of usersNames.entries()) {
        if (value.toLowerCase().includes(search.value.toLowerCase())) {
            returnArr.push(key);
        }
    }
    return returnArr;
}

function confirmChangeRole(item, roleType){
    roleChangeConfirm.value = true;
    confirmRole.value = roleType;
    changeRoleUser.value = item;


}
async function cancelConfirm(){
    await retrieveUsers()
    .then(() =>{
        filter();
        roleChangeConfirm.value= false;
    })
}
async function changeRole() {
    const requestData ={
        roleType: confirmRole.value.toLowerCase(),
    }
    console.log(changeRoleUser.value.id)
    console.log(requestData)
    await userServices.update(changeRoleUser.value.id, requestData)
    .then(() => {
        roleChangeConfirm.value = false;
        roles.value = [];
        users.value.forEach(user => {
            if(!roles.value.includes(user.roleType)){
                roles.value.push(user.roleType);
            }
        })
        for(var i=0; i < selectedRoles.value.length; i++){
            if(!roles.value.includes(selectedRoles.value[i])){
                selectedRoles.value.splice(i, 1);
            };
        }
        filter();
        
    })
    .catch((e) =>{
        message.value = e.response;

    });
   // roleChangeConfirm.value = false;
    
}

async function retrieveUsers() {
    await userServices.getAll()
        .then(async (response) => {
            users.value = response.data;
            users.value.forEach(async element => {
                console.log(element);
                await setFullName(element);
                if (element.departmentId != null) {
                    retriveDepartment(element);
                }
            });
            users.value.forEach(user => {
                displayedUsers.value.push(user);
                if (!roles.value.includes(user.roleType))
                    roles.value.push(user.roleType);

            })
            console.log(roles);
            console.log(displayedUsers);



        })
        .catch((e) => {
            message.value = e.response.data.message;

        });



};
async function retriveDepartments() {
    await departmentServices.getAll()
        .then(async (response) => {

            departments.value = response.data;
            console.log(response.data)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retriveDepartment(user) {
    await departmentServices.get(user.departmentId)
        .then((response) => {
            user.department = response.data.name;
            console.log("Department is " + user.department)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        })

};
async function setFullName(user) {
    user.fullName = user.fName + " " + user.lName;
}


onMounted(
    async () => {
        await retrieveUsers();
        await retriveDepartments();
        
    });



</script>
<script>
export default {
    data() {
        return {
            headers: [

                { title: 'Name', align: 'start', key: 'fullName' , width: '30%' },
                { title: 'Role', align: 'center', key: 'roleType', width: '15%' },
                { title: 'ID', align: 'center', key: 'schoolId', sortable: false, width: '25%' },
                { title: 'Department', align: 'center', key: 'department', width: '30%' },
               // { title: 'Change Role', align: 'center', key: 'edit', sortable: false, width: '15%' },
            ],
            roleChoices: [

                'admin',
                'manager',
                'user',
                'inactive',
            ],
            filterCats: [
                { title: "Departments" },
                { title: "Role Type" },
            ],


        };
    }
};
</script>
<style>
    
</style>
<template>
    <v-snackbar v-model="snackbar">
        No results for {{ keyword }}
        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
    <div>
        
   
        
        <!-- <v-toolbar color="#801529" dense :elevation="8" class="pa-3">
            <v-toolbar-title>Users</v-toolbar-title> -->
            
    
        <v-card
        class="mx-auto pa-6"
        flat
        max-width="1250px">
            <v-app-bar  class="pa-6 mx-auto" color="white" density="prominent" height="15" :elevation="2" flat>
        
                <v-app-bar-title>User List</v-app-bar-title>
                <v-text-field class="mx-auto" bg-color="white" v-model="keyword"  prepend-inner-icon="mdi-magnify" label="Search by name or ID"
                    variant="outlined" density="compact" single-line rounded
                    @click:prepend-inner="searchUser()" v-on:keyup.enter="searchUser()">
                </v-text-field>
            <v-menu :close-on-content-click="false"
                    
                >
                <template v-slot:activator="{ props }">
                    <v-btn class="mx-6" height="40" v-bind="props" color="#811429" variant="elevated">
                        Filters
                    </v-btn>
                </template>
                <v-card min-width="300">
                    <v-list>
                        <v-list-item v-for="(item, index) in filterCats" :key="index">
                            <v-select v-if="item.title == 'Departments'" v-model="selectedDepartments" label="Department"
                                :items="departments" item-title="name" @update:modelValue="filter()" multiple>
                            </v-select>
                            <v-select v-model="selectedRoles" v-if="item.title == 'Role Type'" @update:modelValue="filter()" label="Role Type" :items="roles"
                                multiple>
                            </v-select>

                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
       
    
    </v-app-bar>
    

  
    <v-card class="pa-6 mx-6">
      
      
        <v-card-item max-width="1250px" location="center">
        <v-data-table-virtual :items=displayedUsers :headers=headers density="comfortable" fixed-header>


            <template v-slot:item.roleType ="{ item }">
                <v-select v-model= item.roleType
                 :items="roleChoices" @update:modelValue="confirmChangeRole(item, item.roleType)" variant="plain">

                </v-select>
            </template>

        </v-data-table-virtual>
        </v-card-item>
    </v-card>
</v-card>


    </div>

    <v-overlay
        v-model="roleChangeConfirm"
        class="align-center justify-center"
      >
        <v-card class="pa-6">
            <v-card-title>Confirm change of {{ changeRoleUser.fullName }} to {{ confirmRole }} role</v-card-title>
            <v-card-actions>
            <v-btn @click="changeRole()"
            class="mx-6"
            variant="flat"
            color="green"
            min-width="150"
            min-height="40"
            >
                Confirm
            </v-btn>
            <v-btn
            @click="cancelConfirm()"
            class="mx-6"
            variant="outlined"
            min-width="150"
            min-height="40"
            >
                Cancel
            </v-btn>
        </v-card-actions>
        </v-card>
      </v-overlay>
</template>