import { VContainer } from 'vuetify/lib/components';

<style scoped></style>
<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter } from "vue-router";
import specificAssetServices from "../services/specificAssetServices";
import buildingServices from "../services/buildingServices";


const router = useRouter();
const users = ref([]);
const displayedSpecificAsset = ref([]);
const building = ref([]);
const normalUsers = ref([]);
const managerUsers = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);
const roles = ref([]);
const selectedRoles = ref([]);
const selectedDepartments = ref([]);

// function searchUser() {
//     displayedUsers.value = [];
//     console.log("Search keyword is " + keyword.value);
//     if (keyword.value != "") {
//         users.value.forEach(user => {
//             if (user.schoolId != null) {
//                 if (user.schoolId.toString().includes(keyword.value)) {
//                     console.log("id match")

//                     displayedUsers.value.push(user);
//                 };
//             };
//             if (user.fullName != null) {
//                 if (user.fullName.toLowerCase().includes(keyword.value.toLocaleLowerCase())) {
//                     console.log("name match")
//                     displayedUsers.value.push(user)
//                 };
//             };
//         });
//     };
//     if (displayedUsers.value.length == 0) {
//         users.value.forEach(user => {
//             displayedUsers.value.push(user);
//         })
//         snackbar.value = true;
//     };
// };
// function filter () {
//     displayedUsers.value = [];
//     //var filterList = [];

//     // filterList.push(filterDepartments());
//     // filterList.push(filterRoles()); 
  
//     filterDepartments().forEach(e => {
//         if(!displayedUsers.value.includes(e)) displayedUsers.value.push(e);
//     });
//     filterRoles().forEach(e => {
//         if(!displayedUsers.value.includes(e)) displayedUsers.value.push(e);
//     });
//     console.log(displayedUsers.value);
    
//     if (displayedUsers.value.length == 0) {
//         users.value.forEach(user => {
//             displayedUsers.value.push(user);
//         })
//     };
// }

// function filterDepartments() {
//     var returnedUsers = [];
//     var departmentId = null;
//     users.value.forEach(user => {
//         selectedDepartments.value.forEach(async department => {
//             departments.value.forEach(e => {
//                 console.log(e.name + " = " + department + " " + e.id);

//                 if (e.name == department) {
//                     console.log("true");
//                     departmentId = e.id
//                 };
//             })
//             console.log("selected departmentID: " + departmentId);
//             console.log("selected user departmentID" + user.departmentId);
//             if (user.departmentId == departmentId) {
//                 returnedUsers.push(user);
//                 console.log(user);
//             };
//         })
//     })
//     return returnedUsers;

// }
// function filterRoles() {
//     var returnedUsers = [];
//     users.value.forEach(user => {
//         selectedRoles.value.forEach(role => {
//             if(user.roleType == role){
//                 returnedUsers.push(user);
//             }
//         })
//     })
//     return  returnedUsers;

// }
// function searchUserName(search) {
//     let returnArr = [];
//     for (let [key, value] of usersNames.entries()) {
//         if (value.toLowerCase().includes(search.value.toLowerCase())) {
//             returnArr.push(key);
//         }
//     }
//     return returnArr;
// }



async function retrieveSpecificAssets(specificAssets) {
    await specificAssetServices.getAll()
        .then((response) => {
            specificAssets = response.data;
            console.log(response.data);
            
        })
        .catch((e) => {
            message.value = e.data.message;
        })

};

async function retriveBuilding() {
    await buildingServices.getAll()
        .then(async (response) => {

            building.value = response.data;
            console.log(response.data)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });

}



onMounted(
    async () => {
        await retrieveSpecificAssets();
        await retriveBuilding();
    });



</script>
<script>
export default {
    data() {
        return {
            headers: [

                { title: 'id', align: 'start', key: 'id' , width: '10%' },
                { title: 'Asset Type', align: 'center', key: 'asset.name', sortable: false, width: '10%' },
                { title: 'Building', align: 'start', key: 'building', sortable: false, width: '35%' },
                { title: 'Room', align: 'center', key: 'room', sortable: false, width: '10%' },
                { title: 'Asset Details', align: 'center', key: 'edit', sortable: false, width: '10%' },
            ],
            filterCats: [
                { title: "Asset Type" },
                { title: "Building" },
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
            <v-btn color="red" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
    <div>
        <v-card
        class="mx-auto"
        flat    
        max-width="1000"
        >
        <!-- <v-toolbar color="#801529" dense :elevation="8" class="pa-3">
            <v-toolbar-title>Users</v-toolbar-title> -->
            <v-card-item>
            <v-toolbar  class="pa-6 ma-3" color="white" density="prominent" height="15">
                <v-text-field class="mx-auto" v-model="keyword"  prepend-inner-icon="mdi-magnify" label="Search by Asset Type or Building"
                    variant="outlined" density="compact" single-line rounded
                    @click:prepend-inner="searchUser()" v-on:keyup.enter="searchUser()">
                </v-text-field>
            <v-menu :close-on-content-click="false"
                    
                >
                <template v-slot:activator="{ props }">
                    <v-btn class="mx-6" height="40" v-bind="props" color="#801529" variant="elevated">
                        Filters
                    </v-btn>
                </template>
                <v-card min-width="300">
                    <v-list>
                        <v-list-item v-for="(item, index) in filterCats" :key="index">
                            <v-select v-if="item.title == 'Departments'" v-model="selectedDepartments" label="Department"
                                :items="departments" item-title="name" @update:modelValue="filter()" multiple>
                            </v-select>
                            <v-select v-model="selectedRoles" v-if="item.title == 'building'" @update:modelValue="filter()" label="building" :items="roles"
                                multiple>
                            </v-select>

                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-toolbar> 

        </v-card-item>
        <!-- </v-toolbar> -->
        </v-card>
    </div>
    <div>

        <v-data-table-virtual :items=displayedSpecificAsset :headers=headers density="comfortable" fixed-header>


            <!-- <template v-slot:item.edit>
                <v-btn @click="viewUser(user)" prepend-icon="mdi-pencil">

                </v-btn>
            </template> -->

        </v-data-table-virtual>
    </div>
</template>