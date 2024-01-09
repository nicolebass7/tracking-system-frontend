import { VContainer } from 'vuetify/lib/components';

<style scoped>

</style>
<script setup>


import { reactive, ref, onMounted } from "vue";
import { useRouter} from "vue-router";
import requestServices from "../services/requestServices";
import studentServices from "../services/studentServices"

const router = useRouter();
const requests = ref([]);
const displayedRequests = ref([]);
const rejectedRequests = ref([]);
const acceptedRequests = ref([]);

const message = ref("");
const studentNames = reactive(new Map());
const keyword = ref("");
const snackbar = ref(false); 

const viewRequest = (request) => {
    router.push({name: "viewRequest", params: { id: request.id}});
}
function searchRequest() {
    displayedRequests.value = [];
    rejectedRequests.value = [];
    acceptedRequests.value = [];
    console.log("Search keyword is " + keyword.value);
    requests.value.forEach(request =>{
        if(keyword.value == request.studentId){
            if(request.status == "rejected"){
                rejectedRequests.value.push(request);
            }
            else if(request.status == "accepted"){
                acceptedRequests.value.push(request);

            }
            else{
                displayedRequests.value.push(request);
            } 
        }
        /*if(keyword.value == request.category){
            if(request.status != "rejected"){
                displayedRequests.value.push(request);
            }
            else{
                rejectedRequests.value.push(request);
            }
        }*/
        
    })
    let nameRet = searchStudentName(keyword);
    if(nameRet.length != 0){
        nameRet.forEach(id =>{
            requests.value.forEach(request =>{
                if(id == request.studentId){
                    if(request.status == "rejected"){
                        rejectedRequests.value.push(request);
                    }
                    else if(request.status == "accepted"){
                        acceptedRequests.value.push(request);

                    }
                    else{
                        displayedRequests.value.push(request);
                    } 
                }
            })
        
    })
    }
    if(displayedRequests.value.length == 0 && rejectedRequests.value.length == 0 && acceptedRequests.value.length == 0){
        requests.value.forEach(request =>{
            if(request.status == "rejected"){
                rejectedRequests.value.push(request);
            }
            else if(request.status == "accepted"){
                acceptedRequests.value.push(request);

            }
            else{
                displayedRequests.value.push(request);
            }
        })
        snackbar.value = true;
    }
}
    


async function retrieveRequests () {
    await requestServices.getAll()
    .then(async (response) =>{
        requests.value = response.data;
        requests.value.forEach(request =>{
            if(request.status == "rejected"){
                rejectedRequests.value.push(request)
                
            }
            else if (request.status == "accepted"){
                acceptedRequests.value.push(request)

            }
            else{
                displayedRequests.value.push(request);    
            }
        })
        
        requests.value.forEach(async element => {
            retriveStudent(element.studentId);
            
        });

    })
    .catch((e) => {
        message.value = e.response.data.message;

    });
    


};
async function retriveStudent (studentId) {
        studentServices.get(studentId)
        .then((response) =>{
            let studentName = response.data.fName + " " + response.data.lName;
            let id = response.data.id;
            studentNames.set(id, studentName );
        })
        .catch((e) =>{
            message.value = e.response.data.message;
        })
    
};
function searchStudentName (search) {
    let returnArr = [];
    for(let [key, value] of studentNames.entries()){
        if(value.toLowerCase().includes(search.value.toLowerCase())){
            returnArr.push(key);
        }
    }
    return returnArr;
}

onMounted(async () => {
    await retrieveRequests();    
});

</script>
<script>
</script>
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
    <v-container>
        <v-card
            class="mx-auto"
            max-width="1100"
        >
            <v-toolbar 
                    color="#801529"
                    dense
                    :elevation="8"
                >
                <v-toolbar-title>Requests</v-toolbar-title>
                <v-card-text>
                    <b>{{ message }}</b> 
                </v-card-text> 
                <v-spacer></v-spacer>
                <v-text-field 
                    class="pa-6"
                    v-model="keyword"
                    prepend-inner-icon="mdi-magnify"
                    label = "Search Accomodation"
                    variant="outlined"
                    density="compact"
                    hide-details
                    single-line
                    @click:prepend-inner="searchRequest()"
                    v-on:keyup.enter="searchRequest()"
                >
            </v-text-field>
            </v-toolbar>
                   
            
            <template v-for="(request) in displayedRequests" : key="request.id">
                
                <v-card variant="outlined">
                    <template v-slot:title >
                        <p v-text=studentNames.get(request.studentId)></p>
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
                        <p v-text=studentNames.get(request.studentId)></p>
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
                        <p v-text=studentNames.get(request.studentId)></p>
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
    </v-container>
</template>