<script setup>
import {ref, onMounted} from "vue";
import requestServices from '../services/requestServices';
import studentServices from "../services/studentServices";
import accommodationRequestServices from "../services/accommodationRequestServices";
import accommodationServices from "../services/accommodationServices";
import { useRouter } from "vue-router";


const router = useRouter();
const Request = ref({});
const Student = ref({});
const message = ref("");
const Accommodations = ref([]);
const displayedAccommodations = ref([]);
const selectedAccommodations = ref([]);
const props = defineProps({
  id: {
    required: true,
  },
});

const requests = () => {
    router.push({name: "adminAccomList"});
}
const retriveStudentName = () => {
    studentServices.get(Request.value.studentId)
        .then((response) =>{
            Student.value = response.data;
        })
        .catch((e) =>{
            message.value = e.response.data.message;
        })
}

async function removeAccommocations(i, item){
    selectedAccommodations.value.splice(i, 1)
    accommodationRequestServices.delete(props.id, item.id)
    .then(() => {
            console.log("removed")
        })
    .catch((e) => {
        message.value = e.response.data.message;
    });
}
async function saveAccommodation(item){
      const data = {
            requestId: props.id,
            accommodationId: item.id,
        };
        console.log(props.id)
        console.log(data)
        accommodationRequestServices.create(data)
        .then(() => {
            console.log("saved")
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
}
const acceptRequest = async () =>{
    console.log("accom", selectedAccommodations)
    const requestData ={
        status: "accepted",
    }
    await requestServices.update(props.id, requestData)
    .then(() => {
        console.log(props.id);
        router.push({ name: "adminAccomList" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
}
    


const rejectRequest = async () => {
    const data = {
        status: "rejected",
        comments: Request.value.comments 
    };
    console.log(props.id);
    console.log(data);
    await requestServices.update(props.id, data)
    .then(() => {
        router.push({ name: "adminAccomList" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
}
async function retrieveRequest(){
  await requestServices.get(props.id)
  .then((response) => {
    Request.value = response.data;
    console.log(Request.value);
    retrieveAccommodations(response.data.category);
  })
  .catch((e) => {
    message.value = e.response.data.message;
  });
};


async function retrieveSelectedAccommodations(){
    await accommodationRequestServices.getAllForRequest(props.id)
    .then((response) => {
        response.data.forEach(element =>  {
            Accommodations.value.forEach(accommodation =>{
                if(accommodation.id == element.accommodationId){
                    
                    selectedAccommodations.value.push(accommodation);
                    
                }
            })

        })

    })
    .catch((e) => {
        message.value = e.response.data.message;
    })
}
async function retrieveAccommodations(category){
    console.log(category);
    if(category != null){
        await accommodationServices.getAllForCategory(category)
        .then((response) => {
            Accommodations.value = response.data;
            displayedAccommodations.value = response.data;
            retrieveSelectedAccommodations();

        })
        .catch((e) => {
            message.value = e.response.data.message;
        })
    }else{
        await accommodationServices.getAll()
        .then((response) => {
            Accommodations.value = response.data;
            displayedAccommodations.value = response.data;
            retrieveSelectedAccommodations();

        })
        .catch((e) => {
            message.value = e.response.data.message;
        })
    }

}
function addAccommodation(item){
    selectedAccommodations.value.push(item);
    saveAccommodation(item);
}

onMounted(async () => {
  await retrieveRequest();
  retriveStudentName();
   
});
</script>

<template>
    <v-btn
    variant="text"
    prepend-icon="mdi-arrow-left"
    @click="requests()">
        Requests
    </v-btn>
    <v-card-text>
        <b>{{ message }}</b> 
    </v-card-text> 
    <v-container>
        <v-text> 
            <p class="text-h5">{{ Student.fName }} {{ Student.lName }}'s Request</p>
            <v-divider></v-divider>
            <div>Student ID: {{ Student.studentId }}</div>
            
        </v-text>
    </v-container>
    <v-container>
    <v-card
        class="mx-auto"
        width = "1000"
    >
        <v-card-text>
            <p class = "text-h4">
                {{ Request.category }} Request
            </p>
            <p class="text-subtitle-1 font-italic">{{ Request.status }}</p>
            <v-spacer></v-spacer>
            <p class="text-subtitle-1">{{ Request.semester }}</p>
            <v-divider></v-divider>
            <p class = "text-h5"> Student States:</p>
            <div>{{ Request.grievances }}</div>
        </v-card-text>
    </v-card>
    </v-container>
    <v-container
    align="center"
    >
    <v-card
    width = "500"
    min-height="50"
    class="mx-auto"
    color="#801529"
    title="Select Accommodations"
    >
    <v-row
    justify="start"
    >
        <v-col
            v-for="(accommodation, i) in selectedAccommodations" 
            :key = "accommodation.id"
            cols="auto"
            class="mx-1 pe-1 mb-1"
        >
            <v-chip
            :disabled="loading"
            closable
            density="defualt"
            elevation="3"
            class="pa-2"
            @click:close="removeAccommocations(i, accommodation)"
            close-icon="mdi-close"
            >
                {{ accommodation.name }}
            </v-chip>    
        </v-col>
    </v-row>
</v-card>
<v-spacer></v-spacer>

    <v-card
    width = "500"
    align="center"
    justify = "start"
    >
        <v-list>
            <template v-for="item in displayedAccommodations">
                <v-list-item
                v-if="!selectedAccommodations.includes(item)"
                :key="item.id"
                :disabled="loading"
                @click="addAccommodation(item)"
                >
                <v-list-item-title><h3  v-text="item.name"></h3></v-list-item-title>
                <v-list-item-text><p v-text="item.request"></p></v-list-item-text>
                </v-list-item>
            </template>
        </v-list>
        <v-toolbar
        class="mx-auto"
        width = "500"
        >
            
            <v-btn 
            color="green"
            @click="acceptRequest()"
            >
            Accept
            </v-btn>
            <v-spacer></v-spacer>
        
            <v-btn
            color="red">
            Reject
                <v-overlay
                    activator="parent"
                    class="align-center justify-center"
                >
                <v-card
                :width="800"
                :height="250"
                >
                    <v-container>
                    <v-textarea
                        v-model="Request.comments"
                        label="Comments"
                        id="comments"
                        :height="500"
                        :width="800"
                        no-resize
                        variant="outlined"
                        
                        placeholder="Enter reasons for rejection here">
                    </v-textarea>
                    </v-container>
                    <v-row 
                        justify="center" 
                        align="right"
                        >
                        <v-column>
                        <v-btn 
                        variant="tonal"
                        @click = "rejectRequest()"
                        >
                        Save
                        
                        </v-btn>
                        </v-column>
                    </v-row>
                </v-card>
        </v-overlay>
        </v-btn>
        
        
        
    </v-toolbar>
</v-card>
</v-container>   
</template>