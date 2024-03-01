import { VContainer } from 'vuetify/lib/components';

<style scoped></style>
<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter } from "vue-router";
import assetServices from "../services/assetServices";
import specificAssetServices from "../services/specificAssetServices";
import makeServices from "../services/makeServices";
import modelServices from "../services/modelServices";
import typeServices from "../services/assetTypeServices";



const router = useRouter();
const assets = ref([]);
const displayedAssets = ref([]);
const makes = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);
const roles = ref([]);
const selectedRoles = ref([]);
const selectedDepartments = ref([]);
const archivingAsset = ref(Object);
const ArchiveChangeConfirm = ref(false);
const confirmRole = ref("");
const changeRoleUser = ref("");

function directpage(name){
  if(name === 'Add Asset'){
    router.push({ path: "/AddAsset" });}}

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
function archive(asset){
    archivingAsset.value = asset;
    ArchiveChangeConfirm.value = true
    
}
async function archiveConfirm() {
    if (archivingAsset.value.archived == true) {
        var archiveVal = true;
        console.log("Status should change to true")
    }
    else {
        var archiveVal = false;
    }
    const requestData = {
        archived: archiveVal,
    }
    console.log(requestData)
    await assetServices.update(archivingAsset.value.id, requestData)
    .then((response) => {
        console.log("Archived")
        console.log(response)
    })
    .catch((e) =>{
        message.value = e.response;

    });
    ArchiveChangeConfirm.value = false;
}

async function cancelArchive(){
    
    assets.value.forEach(asset => {
        if(asset.id == archivingAsset.value.id){
            if(archivingAsset.value.archived == false){
                asset.archived = true;
            }
            else asset.archived = false;
        }
    });
    ArchiveChangeConfirm.value = false;
}

async function retrieveSpecificAssets() {
    await specificAssetServices.getAll()
        .then(async (response) => {
            assets.value = response.data;
        
            assets.value.forEach(async asset => {
                console.log(asset);
                retrieveAsset(asset);
                retrieveMake(asset);
                retrieveModel(asset);
                retriveType(asset);
                displayedAssets.value.push(asset);


            });
            console.log(assets.value);
            console.log(displayedAssets.value);



        })
        .catch((e) => {
            message.value = e.response.data.message;

        });



};
async function retrieveAsset(asset) {
    await assetServices.get(asset.assetId)
        .then((response) => {

            asset.description = response.data.description;
            console.log(response.data.name)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retrieveMake(asset) {
    await makeServices.get(asset.makeId)
        .then((response) => {

            asset.make = response.data.make;
            console.log(response.data.name)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retrieveModel(asset) {
    console.log(asset)
    await modelServices.get(asset.modelId)
        .then((response) => {

            asset.model = response.data.model;
            console.log(response.data.name);
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retriveType(asset) {
    await typeServices.get(asset.assetTypeId)
        .then((response) => {
            asset.assetType = response.data.name;
            console.log("Asset Type is " + asset.assetType)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        })

};



onMounted(
    async () => {
        await retrieveAssets();
        
    });



</script>
<script>
export default {
    data() {
        return {
          headers: [
                { title: 'Serial #', align: 'start', key: 'serialNumber', sortable: false, width: '10%' },
                { title: 'Asset Type', align: 'start', key: 'assetType' , width: '30%' },
                { title: 'Make', align: 'start', key: 'make', width: '15%' },
                { title: 'Model', align: 'start', key: 'model', sortable: false, width: '10%' },
                { title: 'Status', align: 'center', key: 'status', sortable: false, width: '10%' },
                { title: 'Edit Asset', align: 'center', key: 'edit', sortable: false, width: '10%' },
                { title: 'View Details', align: 'center', key: 'edit', sortable: false, width: '10%' },


            ],
            
            filterCats: [
                { title: "Asset Type" },
                { title: "Status" },
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
        
                <v-app-bar-title>Specific Asset List</v-app-bar-title>
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
                    <v-btn 
                    @click="directpage('Add Asset')"
                    class="mx-6" 
                    height="40"  
                    color="#801529" 
                    variant="elevated">
                        Add Asset 
                </v-btn>
                </template>
                
                <v-card min-width="300">
                    <v-list>
                        <v-list-item v-for="(item, index) in filterCats" :key="index">
                            <v-select v-if="item.title == 'Asset Type'" v-model="selectedDepartments" label="Asset Type"
                                :items="departments" item-title="name" @update:modelValue="filter()" multiple>
                            </v-select>
                            <v-select v-model="selectedRoles" v-if="item.title == 'Status'" @update:modelValue="filter()" label="Status" :items="roles"
                                multiple>
                            </v-select>

                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
       
    
    </v-app-bar>
    

  
    <v-card class="pa-6 mx-6">
      
      
        <v-card-item max-width="1250px" location="center">
        <v-data-table-virtual :items=displayedAssets :headers=headers density="comfortable" fixed-header>

          <template v-slot:item.edit>
                <v-btn @click="viewUser(user)" prepend-icon="mdi-pencil">

                </v-btn>
            </template>
            <template v-slot:item.archive="{ item }">
               <v-switch
                v-model="item.archived"
                @update:modelValue="archive(item)"
                >
                
               </v-switch> 
               
            </template>

        </v-data-table-virtual>
        </v-card-item>
    </v-card>
</v-card>


</div>

    <v-overlay
        v-model="ArchiveChangeConfirm"
        class="align-center justify-center"
      >
        <v-card class="pa-6">
            <v-card-title>Confirm change of {{ archivingAsset.model }} {{ archivingAsset.make }} to {{ archivingAsset.archived }}</v-card-title>
            <v-card-actions>
            <v-btn @click="archiveConfirm()"
            class="mx-6"
            variant="flat"
            color="green"
            min-width="150"
            min-height="40"
            >
                Confirm
            </v-btn>
            <v-btn
            @click="cancelArchive()"
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