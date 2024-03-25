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

import assetDataServices from "../services/assetDataServices";
import assetStatusServices from "../services/assetStatusServices";



const router = useRouter();
const assets = ref([]);
const displayedAssets = ref([]);
const makes = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);
const roles = ref([]);
const selectedStatus = ref([]);
const selectedModel = ref([]);
const selectedMake = ref([]);
const selectedAssetType = ref([]);
const assetTypes = ref([]);
const generalAssets = ref(new Map());
const assetStatus = ref(new Map());
const archivingAsset = ref(Object);
const ArchiveChangeConfirm = ref(false);
const confirmRole = ref("");
const changeRoleUser = ref("");

function directpage(name){
  if(name === 'Add Asset'){
    router.push({ path: "/AddAsset" });}}


    function searchAsset() {
    displayedAssets.value = []; // Change displayedUsers to displayedAssets
    console.log("Search keyword is " + keyword.value);
    if (keyword.value != "") {
        assets.value.forEach(asset => { // Change users to assets
            if (asset.serialNumber != null && asset.serialNumber.toString().includes(keyword.value)) {
                console.log("Serial number match");
                displayedAssets.value.push(asset);
            }
            else if (asset.assetType != null && asset.assetType.toLowerCase().includes(keyword.value.toLowerCase())) {
                console.log("Asset type match");
                displayedAssets.value.push(asset);
            }
            else if (asset.make != null && asset.make.toLowerCase().includes(keyword.value.toLowerCase())) {
                console.log("Make match");
                displayedAssets.value.push(asset);
            }
            else if (asset.model != null && asset.model.toLowerCase().includes(keyword.value.toLowerCase())) {
                console.log("Model match");
                displayedAssets.value.push(asset);
            }
        });
    }
    if (displayedAssets.value.length == 0) {
        assets.value.forEach(asset => {
            displayedAssets.value.push(asset);
        })
        snackbar.value = true;
    };
};
function filter () {
    displayedAssets.value = [];
  
    filterAssetType().forEach(e => {
        if(!displayedAssets.value.includes(e)) displayedAssets.value.push(e);
    });
    // filterStatus().forEach(e => {
    //     if(!displayedStatus.value.includes(e)) displayedStatus.value.push(e);
    // });
    // filterMake().forEach(e => {
    //     if(!displayedStatus.value.includes(e)) displayedStatus.value.push(e);
    // });
    // filterModel().forEach(e => {
    //     if(!displayedStatus.value.includes(e)) displayedStatus.value.push(e);
    // });
    console.log(displayedAssets.value);
    
    if (displayedAssets.value.length == 0) {
        assets.value.forEach(assets => {
            displayedAssets.value.push(assets);
        })
    };
}

function filterAssetType() {
    var returnedAssets = [];
    var assetTypeId = null;
    assets.value.forEach(specificAsset => {
        selectedAssetType.value.forEach(async assetType => {
            assetTypes.value.forEach(type => {
                console.log(type.name + " = " + assetType + " " + type.id);

                if (type.name == assetType) {
                    console.log("true");
                    assetTypeId = type.id
                };
            })
            if (specificAsset.assetId == assetTypeId) {
                returnedAssets.push(specificAsset);
                console.log(specificAsset);
            };
        })
    })
    return returnedAssets;

}
function filterStatus() {
    var returnedStatus = [];
    asset.value.forEach(user => {

        selectedRoles.value.forEach(role => {
            if(user.roleType == role){
                returnedUsers.push(user);
            }
        })
    })

    return  returnedStatus;


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
                if(!generalAssets.value.has(asset.assetId)){
                    await retrieveAsset(asset);
                }
                var generalAsset = generalAssets.value.get(asset.assetId);
                console.log(generalAsset);

                asset.description = generalAsset.description;
                asset.archived = generalAsset.archived;
                await retrieveMake(generalAsset.makeId, asset);

                await retrieveModel(generalAsset.modelId, asset); 
                await retriveType(generalAsset.assetTypeId, asset);
                var generalAsset = generalAssets.value.get(asset.id)
                await retrieveAssetData(generalAsset.assetTypeId, generalAsset);
                await retrieveAssetStatus(asset.id);
                if(retrieveAssetStatus)
                displayedAssets.value.push(asset);

            });
            console.log(assets.value);
            console.log(displayedAssets.value);



        })
        .catch((e) => {
            message.value = e.response.data.message;

        });



};
async function retrieveAssetStatus(assetId){
    await assetStatusServices.getForAsset(assetId)
        .then((response) => {
            assetStatus.value.set(assetId, response.data);
            
        })
        .catch((e) => {
            message.value = e.response.data.message;
        })
}
async function retrieveAsset(asset) {
    await assetServices.get(asset.assetId)
        .then((response) => {
            generalAssets.value.set(response.data.id, response.data)
            console.log(generalAssets.value)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retrieveMake(makeId, asset) {
    await makeServices.get(makeId)
        .then((response) => {
            asset.make = response.data.make;            
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retrieveModel(modelId, asset) {
    await modelServices.get(modelId)
        .then((response) => {
            asset.model = response.data.model;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retriveType(assetTypeId, asset) {
    console.log(assetTypeId);
    await typeServices.get(assetTypeId)
        .then((response) => {
            asset.assetType = response.data.name;
           
        })
        .catch((e) => {
            message.value = e.response;
        })

};
async function retrieveTypes() {
  await typeServices.getAll()
  .then((response) =>{
    assetTypes.value = response.data;
  }
  
  )
}

async function retrieveAssetData(typeId, generalAsset) {
    console.log(typeId)
    await assetDataServices.getForType(typeId)
        .then((response) => {
            console.log(response.data);
            generalAsset.dataFields =  response.data;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}

const viewDetails = (specificAsset) => {
    console.log('specificAsset:', specificAsset);
    router.push({name: "ViewEditAsset", params: {id: specificAsset.id}})
}

onMounted(
    async () => {
        await retrieveSpecificAssets();
        await retrieveTypes();
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

                { title: 'Check in/out', align: 'center', key: 'edit', sortable: false, width: '10%' },
                { title: 'View Details', align: 'center', key: 'edit', sortable: false, width: '10%' },


            ],
            
            filterCats: [
                { title: "Asset Type" },
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

                            <v-select v-if="item.title == 'Asset Type'" v-model="selectedAssetType" label="Asset Type"
                                :items="assetTypes" item-title="name" @update:modelValue="filter()" multiple>
                            </v-select>
                            <v-select v-model="selectedStatus" v-if="item.title == 'Status'" @update:modelValue="filter()" label="Status" :items="status"
                                multiple>
                            </v-select>
                            <v-select v-model="selectedMake" v-if="item.title == 'Make'" @update:modelValue="filter()" label="Make" :items="assetMake"
                                multiple>
                            </v-select>
                            <v-select v-model="selectedModel" v-if="item.title == 'Model'" @update:modelValue="filter()" label="Model" :items="assetModel"
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

          <template v-slot:item.view = "{item}">
                <v-btn @click="viewDetails(item)" prepend-icon="mdi-pencil">

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