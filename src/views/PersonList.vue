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
                console.log(element);
                await setFullName(element);
                
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

async function setFullName(person) {
    person.fullName = person.fName + " " + person.lName;
}

const viewAssets = (person) => {
    console.log(person)
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