import { VContainer } from 'vuetify/lib/components';

<style scoped>

</style>
<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter} from "vue-router";
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


function searchUser() {
    displayedUsers.value = [];
    console.log("Search keyword is " + keyword.value);
    if(keyword.value != ""){
        users.value.forEach(user =>{
            if(user.schoolId != null){
                if(user.schoolId.toString().includes(keyword.value)){
                    console.log("id match")

                    displayedUsers.value.push(user);
                };
            };
            if(user.fullName != null){ 
                if(user.fullName.toLowerCase().includes(keyword.value.toLocaleLowerCase())){
                    console.log("name match")
                    displayedUsers.value.push(user)
                };
            };
        });
    };
    if(displayedUsers.value.length == 0){
        users.value.forEach(user =>{
            displayedUsers.value.push(user);
        })
        snackbar.value = true;
    };
};
function searchUserName (search) {
    let returnArr = [];
    for(let [key, value] of usersNames.entries()){
        if(value.toLowerCase().includes(search.value.toLowerCase())){
            returnArr.push(key);
        }
    }
    return returnArr;
}    


async function retrieveUsers () {
    await userServices.getAll()
    .then(async (response) =>{
        users.value = response.data;
        users.value.forEach(async element => {
            console.log(element);
            await setFullName(element);
            if(element.departmentId != null){
                retriveDepartment(element);
            } 
        });
        users.value.forEach(user =>{
            displayedUsers.value.push(user);   
             
        })
        console.log(displayedUsers);
        
       

    })
    .catch((e) => {
        message.value = e.response.data.message;

    });
    


};
async function retriveDepartments(){
    await departmentServices.getAll()
        .then(async (response) =>{
           
            departments.value = response.data;
            console.log(response.data)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
    
}
async function retriveDepartment (user) {
        await departmentServices.get(user.departmentId)
        .then((response) =>{
            user.department = response.data.name;
            console.log("Department is " + user.department)
        })
        .catch((e) =>{
            message.value = e.response.data.message;
        })
    
};
async function setFullName (user) {
        user.fullName = user.fName + " " + user.lName;
}


onMounted(
    async () => {
    await retrieveUsers();
         retriveDepartments();    
});



</script>
<script>
export default {
  data() {
    return {
      headers: [
                
                { title: 'Name', align: 'start', key: 'fullName', sortable: false, width: '10%' },
                { title: 'ID', align: 'end', key: 'schoolId', sortable: false, width: '10%'},
                { title: 'Role', align: 'end', key: 'roleType', sortable: false, width: '35%'},
                { title: 'Department', align: 'end', key: 'department', sortable: false, width: '10%' },
                { title: 'Edit User', align: 'end', key: 'edit', sortable: false, width: '10%' },
            ],
    };
  }
};
</script>
<style>
     v-data-table-virtual-header {
      height: 1000px;
    }
</style>
<template>
    <v-snackbar v-model="snackbar">
        No results for {{ keyword }}
        <template v-slot:actions>
            <v-btn
            color = "red"
            variant = "text"
            @click = "snackbar = false">
            Close
            </v-btn>
        </template>
    </v-snackbar>
    <div>
        <v-toolbar 
                color="#801529"
                dense
                :elevation="8"
                class="pa-2"
            >
            <v-toolbar-title>Users</v-toolbar-title>
            <v-text-field
                class="pa-6"
                v-model="keyword"
                prepend-inner-icon="mdi-magnify"
                label = "Search Users"
                variant="outlined"
                density="compact"
                hint="Search by name or ID"
                persistent-hint
                single-line
                @click:prepend-inner="searchUser()"
                v-on:keyup.enter="searchUser()"
            >
            </v-text-field>
        </v-toolbar>
    </div>
    <div>
        <v-data-table-virtual
            :items = displayedUsers
            :headers = headers
            density="compact"
            height="400"
            fixed-header
        >
        <!-- <template v-slot:headers=" { columns } "
            
        >
        <tr
           
        >
            <template v-for="column in columns" :key="column.key">
            <td>
                <span>{{ column.title }}</span>
            
            </td>
            </template>
        </tr>
        </template> -->

            <!--  <template v-slot:header.department>
                <v-select
                label = "Department"
                variant = "plain"
                density="compact"
                :items = departments
                item-title = "name"
                item-color = "#801529"
                chips
                clearable
                multiple
                bg-color="white"
                center-affix
                > 
                     <template v-slot:item="{departments, department}">
                        <v-list-item>
                            <v-btn v-bind="departments" v-text="name"></v-btn>
                        </v-list-item>    
                    </template>
                </v-select>
            </template> -->
            <template v-slot:item.edit>
                <v-btn @click = "viewUser(user)"
                        prepend-icon = "mdi-pencil"
                        >
                    
                    </v-btn>
            </template>
            
        </v-data-table-virtual>
    </div>
        
</template>



    <!-- <v-container>
        <v-card
            class="mx-auto"
            max-width="1100"
        >
            <v-toolbar 
                    color="#801529"
                    dense
                    :elevation="8"
                >
                <v-toolbar-title>Users</v-toolbar-title>
                <v-card-text>
                    <b>{{ message }}</b> 
                </v-card-text> 
                <v-spacer></v-spacer>
                <v-text-field 
                    class="pa-6"
                    v-model="keyword"
                    prepend-inner-icon="mdi-magnify"
                    label = "Search Users"
                    variant="outlined"
                    density="compact"
                    hide-details
                    single-line
                    @click:prepend-inner="searchUser()"
                    v-on:keyup.enter="searchUser()"
                >
            </v-text-field>
            </v-toolbar>
                   
            
            <template v-for="(user) in displayedUsers" : key="user.id">
                
                <v-card variant="outlined">
                    <template v-slot:title >
                        <p v-text = usersNames.get(user.id)></p>
                    </template>
                    <template v-slot:subtitle>
                        {{user.category}}
                    </template>
                    <template v-slot:text>
                        {{user.status}}
                        <v-divider></v-divider>
                        
                    </template>
                    <v-card-actions>
                        <v-btn @click = "viewRequest(request)"
                        prepend-icon = "mdi-pencil"
                        >
                        Review
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </template>
            <v-card color="#801529">
                <v-card-title >
                    Accepted Requests
                </v-card-title>
                </v-card>

                <template v-for="(request) in acceptedRequests" : key="request.id">
                
                <v-card variant="outlined">
                    <template v-slot:title >
                        <p v-text=usersNames.get(request.studentId)></p>
                    </template>
                    <template v-slot:subtitle>
                        {{request.category}}
                    </template>
                    <template v-slot:text>
                        {{request.status}}
                        <v-divider></v-divider>
                        
                    </template>
                    <v-card-actions>
                        <v-btn @click = "viewRequest(request)"
                        prepend-icon = "mdiClipboard"
                        >
                        Review
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </template>
                <v-card color="#801529">
                <v-card-title >
                    Rejected Requests
                </v-card-title>
                </v-card>

                <template v-for="(request) in rejectedRequests" : key="request.id">
                
                <v-card variant="outlined">
                    <template v-slot:title >
                        <p v-text=usersNames.get(request.studentId)></p>
                    </template>
                    <template v-slot:subtitle>
                        {{request.category}}
                    </template>
                    <template v-slot:text>
                        {{request.status}}
                        <v-divider></v-divider>
                        
                    </template>
                    <v-card-actions>
                        <v-btn @click = "viewRequest(request)"
                        prepend-icon = "mdiClipboard"
                        >
                        Review
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </template> 
        </v-card>
    </v-container> -->
