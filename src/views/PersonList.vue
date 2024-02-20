import { VContainer } from 'vuetify/lib/components';

<style scoped></style>
<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter } from "vue-router";
import personServices from "../services/personServices"


const router = useRouter();
const persons = ref([]);
const displayedPersons = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);
// const roles = ref([]);
// const selectedRoles = ref([]);
// const selectedDepartments = ref([]);

function searchPerson() {
    displayedPersons.value = [];
    console.log("Search keyword is " + keyword.value);
    if (keyword.value != "") {
        persons.value.forEach(person => {
            if (person.schoolId != null) {
                if (person.schoolId.toString().includes(keyword.value)) {
                    console.log("id match")

                    displayedPersons.value.push(person);
                };
            };
            if (person.fullName != null) {
                if (person.fullName.toLowerCase().includes(keyword.value.toLocaleLowerCase())) {
                    console.log("name match")
                    displayedPersons.value.push(person)
                };
            };
        });
    };
    if (displayedPersons.value.length == 0) {
        persons.value.forEach(person => {
            displayedPersons.value.push(person);
        })
        snackbar.value = true;
    };
};
// function filter () {
//     displayedPersons.value = [];
//     //var filterList = [];

//     // filterList.push(filterDepartments());
//     // filterList.push(filterRoles()); 
  
//     filterDepartments().forEach(e => {
//         if(!displayedPersons.value.includes(e)) displayedPersons.value.push(e);
//     });
//     filterRoles().forEach(e => {
//         if(!displayedPersons.value.includes(e)) displayedPersons.value.push(e);
//     });
//     console.log(displayedPersons.value);
    
//     if (displayedPersons.value.length == 0) {
//         persons.value.forEach(person => {
//             displayedPersons.value.push(person);
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
function searchPersonName(search) {
    let returnArr = [];
    for (let [key, value] of personsNames.entries()) {
        if (value.toLowerCase().includes(search.value.toLowerCase())) {
            returnArr.push(key);
        }
    }
    return returnArr;
}


async function retrievePersons() {
    await personServices.getAll()
        .then(async (response) => {
            persons.value = response.data;
            persons.value.forEach(async element => {
                console.log(element);
                await setFullName(element);
                // if (element.departmentId != null) {
                //     retriveDepartment(element);
                // }
            });
            persons.value.forEach(person => {
                displayedPersons.value.push(person);
                

            })
            console.log(displayedPersons);



        })
        .catch((e) => {
            message.value = e.response.data.message;

        });



};
// async function retriveDepartments() {
//     await departmentServices.getAll()
//         .then(async (response) => {

//             departments.value = response.data;
//             console.log(response.data)
//         })
//         .catch((e) => {
//             message.value = e.response.data.message;
//         });


// }
// async function retriveDepartment(user) {
//     await departmentServices.get(user.departmentId)
//         .then((response) => {
//             user.department = response.data.name;
//             console.log("Department is " + user.department)
//         })
//         .catch((e) => {
//             message.value = e.response.data.message;
//         })

// };
async function setFullName(person) {
    person.fullName = person.fName + " " + person.lName;
}


onMounted(
    async () => {
        await retrievePersons();
        // await retriveDepartments();
    });



</script>
<script>
export default {
    data() {
        return {
            headers: [

                { title: 'Name', align: 'start', key: 'fullName' , width: '15%' },
                { title: 'ID', align: 'center', key: 'schoolId', sortable: false, width: '15%'  },
                { title: 'View Assets', align: 'center', key: 'view', sortable: false},
            ],
            // filterCats: [
            //     { title: "Departments" },
            //     { title: "Role Type" },
            // ],


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
    <br>
    <h2>View People's Assets</h2>
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
                <v-text-field class="mx-auto" v-model="keyword"  prepend-inner-icon="mdi-magnify" label="Search by name or ID"
                    variant="outlined" density="compact" single-line rounded
                    @click:prepend-inner="searchPerson()" v-on:keyup.enter="searchPerson()">
                </v-text-field>
            <!-- <v-menu :close-on-content-click="false"
                    
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
                            <v-select v-model="selectedRoles" v-if="item.title == 'Role Type'" @update:modelValue="filter()" label="Role Type" :items="roles"
                                multiple>
                            </v-select>

                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu> -->
        </v-toolbar> 

        </v-card-item>
        <!-- </v-toolbar> -->
        </v-card>
    </div>
     <div>

        <v-data-table-virtual :items=displayedPersons :headers=headers density="comfortable" fixed-header>

           <template v-slot:item.edit>
                <v-btn @click="viewAssets(asset)" prepend-icon="mdi-pencil">

                </v-btn>
            </template>

        </v-data-table-virtual>
    </div> 

</template> 

<style scoped>
h2 {
    text-align: center;
}
</style>