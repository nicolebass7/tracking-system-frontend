import { VContainer } from 'vuetify/lib/components';

<style scoped></style>
<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter } from "vue-router";
import personServices from "../services/personServices"

import { shallowRef } from 'vue'

  const dialog = shallowRef(false)


const router = useRouter();
const persons = ref([]);
const displayedPersons = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);

const addPerson = ref({
    id: null,
    fName: "",
    lName: "",
    schoolId: ""
})

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
                //console.log(element);
                await setFullName(element);
                
            });
            persons.value.forEach(person => {
                displayedPersons.value.push(person);
                

            })
            //console.log(displayedPersons);



        })
        .catch((e) => {
            message.value = e.response.data.message;

        });



};

async function setFullName(person) {
    person.fullName = person.fName + " " + person.lName;
}


async function savePerson() {
    const data = {
        fName: addPerson.value.fName,
        lName: addPerson.value.lName,
        schoolId: addPerson.value.schoolId
    };
    
    await personServices.create(data)
        .then((response) => {
            addPerson.value.id = response.data.id;
            location.reload();
        })
        .catch((e) => {
            message.value = e.response.data.message;

        });
   
};

const viewAssets = (person) => {
    //console.log(person)
    router.push({name: "PersonHistory", params: { id: person.id}});
}


onMounted(
    async () => {
        await retrievePersons();
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
     
            <v-app-bar class="pa-6 mx-auto" color="white" density="prominent" height="15" :elevation="2" flat>
              <v-app-bar-title>View People's Assets</v-app-bar-title>
                <v-text-field class="mx-auto" v-model="keyword"  prepend-inner-icon="mdi-magnify" label="Search by name or ID"
                    variant="outlined" density="compact" single-line rounded
                    @click:prepend-inner="searchPerson()" v-on:keyup.enter="searchPerson()">
                </v-text-field>
                <v-dialog
                    v-model="dialog"
                    max-width="600"
    >
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn
                            class="mx-6" 
                            height="40"  
                            color="#801529" 
                            variant="elevated"
                            text="Add Person"
                            v-bind="activatorProps"
                        ></v-btn>
                    </template>

                    <v-card
                        
                        title="Add Person"
                    >
                        <v-card-text>
                        <v-row dense>
                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                v-model="addPerson.fName"
                                label="First name"
                                required
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                v-model="addPerson.lName"
                                label="Last Name"
                            ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            md="4"
                            sm="6"
                            >
                            <v-text-field
                                v-model="addPerson.schoolId"
                                label="School Id"
                            ></v-text-field>
                            </v-col>
                        </v-row>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="green"
                            text="Save"
                            variant="tonal"
                            @click="(savePerson()), (dialog= false)"
                        ></v-btn>

                        <v-btn
                            text="Close"
                            variant="plain"
                            @click="dialog = false"
                        ></v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>    
                            
        </v-app-bar> 

       
        <v-card class="pa-6 mx-6">
            <v-card-item max-width="1250px" location="center" >
        <v-data-table-virtual :items=displayedPersons :headers=headers density="comfortable" fixed-header>

           <template v-slot:item.view = "{ item }">
                <v-btn @click="viewAssets(item)" prepend-icon="mdi-pencil">

                </v-btn>
            </template>

        </v-data-table-virtual>
    </v-card-item>
    </v-card>
    </v-card>
    </div> 

    

</template> 

<style scoped>
h2 {
    text-align: center;
}
</style>