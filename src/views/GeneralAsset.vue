<style scoped></style>

<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter } from "vue-router";
import assetServices from "../services/assetServices";
import makeServices from "../services/makeServices";
import modelServices from "../services/modelServices";
import typeServices from "../services/assetTypeServices";
import assetDataServices from "../services/assetDataServices";



const router = useRouter();
const assets = ref([]);
const displayedAssets = ref([]);
const makes = ref([]);
const displayedMakes = ref([]);
const selectedMakes = ref([]);
const models = ref([]);
const displayedModels = ref([]);
const selectedModels = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);
const types = ref([]);
const displayedTypes = ref([]);
const selectedTypes = ref([]);
const dataFieldMap = ref(new Map());
const selectedAsset = ref(Object);
const ArchiveChangeConfirm = ref(false);
const showArchvied = ref(false);



function filterSearch() {
    var returnedAssets = [];
    console.log("Search keyword is " + keyword.value);
    if (keyword.value != "") {
        assets.value.forEach(asset => {
            if (asset.assetType != null) {
                if (asset.assetType.toLowerCase().includes(keyword.value.toLowerCase())) {
                    console.log("type match")

                    returnedAssets.push(asset);
                };
            };
            if (asset.make != null) {
                if (asset.make.toLowerCase().includes(keyword.value.toLocaleLowerCase())) {
                    console.log("make match")
                    returnedAssets.push(asset)
                };
            };
            if (asset.model != null) {
                if (asset.model.toLowerCase().includes(keyword.value.toLocaleLowerCase())) {
                    console.log("make match")
                    returnedAssets.push(asset)
                };
            };
            if(returnedAssets.length == 0){
                snackbar.value = true;
            }
            else{
                snackbar.value = false;
            }
        });
    };
    return returnedAssets;
};
function filter() {
    displayedAssets.value = [];

    filterTypes().forEach(e => {
        if (!displayedAssets.value.includes(e)) {
            displayedAssets.value.push(e);
        }
    });
    filterMakes().forEach(e => {
        if (!displayedAssets.value.includes(e)) {
            displayedAssets.value.push(e);
        }
    });
    filterModels().forEach(e => {
        if (!displayedAssets.value.includes(e)) {
            displayedAssets.value.push(e);
        }
    });

    filterSearch().forEach(e => {
        if (!displayedAssets.value.includes(e)) {
            displayedAssets.value.push(e);
        }
    })
    if (displayedAssets.value.length == 0) {
        assets.value.forEach(asset => {
            displayedAssets.value.push(asset);
        })
    };
    filterArchived();
    filterDisplayedModels();
};

function filterArchived() {

    if (showArchvied.value == false) {

        displayedAssets.value.forEach(asset => {
            if (asset.archived == true) {
                const indx = displayedAssets.value.findIndex(displayedAsset => displayedAsset == asset);
                displayedAssets.value.splice(indx, indx >= 0 ? 1 : 0);
            }
        });
        displayedTypes.value = [];
        types.value.forEach(type => {
            var included = false;
            displayedAssets.value.forEach(asset => {
                if (type.name == asset.assetType) {
                    included = true;
                }
            })

            if (included) {
                console.log(type);
                displayedTypes.value.push(type);
            }


        });
        displayedMakes.value = [];
        makes.value.forEach(make => {
            var included = false;
            displayedAssets.value.forEach(asset => {
                console.log(make.id + "=" + asset.makeId);
                if (make.id == asset.makeId) {
                    included = true;
                }
            })

            if (included) {
                displayedMakes.value.push(make);
            }


        })
        
    }
    else {
        displayedTypes.value = [];
        displayedMakes.value = [];
        types.value.forEach(type => {
            displayedTypes.value.push(type);
        });
        makes.value.forEach(make => {
            displayedMakes.value.push(make)
        });
    }
}
function filterDisplayedModels(){
    displayedModels.value = [];
        console.log(models.value);
        models.value.forEach(model => {
            console.log()
            var included = false;
            displayedAssets.value.forEach(asset => {
                if (model.id == asset.modelId) {
                    included = true;
                };
            });

            if (included) {
                console.log(model);
                displayedModels.value.push(model);
            };

        });
    
};
function filterTypes() {
    var returnedAssets = [];
    var typeId = null;
    assets.value.forEach(asset => {
        selectedTypes.value.forEach(type => {
            types.value.forEach(e => {

                if (e.name == type) {
                    typeId = e.id
                };
            })
            if (asset.assetTypeId == typeId) {
                returnedAssets.push(asset);
            };
        })
    })
    return returnedAssets;

}

function filterMakes() {
    var returnedAssets = [];
    var makeId = null;
    assets.value.forEach(asset => {
        selectedMakes.value.forEach(make => {
            makes.value.forEach(e => {
                if (e.make == make) {
                    makeId = e.id;
                };
            })
            if (asset.makeId == makeId) {
                returnedAssets.push(asset);
            };
        })
    })
    return returnedAssets;
}

function filterModels() {
    var returnedAssets = [];
    var modelId = null;
    assets.value.forEach(asset => {
        selectedModels.value.forEach(model => {
            models.value.forEach(e => {
                if (e.model == model) {
                    modelId = e.id;
                };
            })
            if (asset.modelId == modelId) {
                returnedAssets.push(asset);
            };
        })
    })
    return returnedAssets;



}

function archive(asset) {
    selectedAsset.value = asset;
    ArchiveChangeConfirm.value = true

}
async function archiveConfirm() {
    if (selectedAsset.value.archived == true) {
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
    await assetServices.update(selectedAsset.value.id, requestData)
        .then((response) => {
            console.log("Archived")
            console.log(response)
        })
        .catch((e) => {
            message.value = e.response;

        });
    ArchiveChangeConfirm.value = false;
}

async function cancelArchive() {

    assets.value.forEach(asset => {
        if (asset.id == selectedAsset.value.id) {
            if (selectedAsset.value.archived == false) {
                asset.archived = true;
            }
            else asset.archived = false;
        }
    });
    ArchiveChangeConfirm.value = false;
}

async function retrieveAssets() {
    await assetServices.getAll()
        .then(async (response) => {
            assets.value = response.data;

            assets.value.forEach(async asset => {
                retrieveMake(asset);
                retrieveModel(asset);
                retriveType(asset);
                retrieveData(asset);
                if (!dataFieldMap.value.has(asset.assetTypeId)) {
                    retrieveDataFieldForType(asset);
                }
                displayedAssets.value.push(asset);


            });




        })
        .catch((e) => {
            message.value = e.response.data.message;

        });



};
async function retrieveData(asset) {
    await assetDataServices.getForType(asset.assetTypeId)
        .then((response) => {
            // console.log(response.data);
            asset.dataFields = response.data;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
}
async function retrieveMake(asset) {
    await makeServices.get(asset.makeId)
        .then((response) => {
            if(!makes.value.includes(response.data)){
                makes.value.push(response.data)
            }
            if (!displayedMakes.value.includes(response.data) && !asset.archived) {
                displayedMakes.value.push(response.data);
            }
            asset.make = response.data.make;
            // console.log(response.data.name)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retrieveModel(asset) {
    console.log(asset)
    await modelServices.get(asset.modelId)
        .then((response) => {
            if(!models.value.includes(response.data)){
                models.value.push(response.data)
                console.log(models.value)
            }
            if (!displayedModels.value.includes(response.data) && !asset.archived) {
                displayedModels.value.push(response.data);
            }
            asset.model = response.data.model;
            // console.log(response.data.name);
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });


}
async function retriveType(asset) {
    await typeServices.get(asset.assetTypeId)
        .then((response) => {
            asset.assetType = response.data.name;
            types.value.push(response.data);
            if (asset.archived == false) {
                displayedTypes.value.push(response.data)
            }
            // console.log("Asset Type is " + asset.assetType);
        })
        .catch((e) => {
            message.value = e.response.data.message;
        })
};

async function retrieveDataFieldForType(asset) {
    await assetDataServices.getForType(asset.assetTypeId)
        .then((response) => {
            dataFieldMap.value.set(asset.assetTypeId, response.data)
        })
        .catch((e) => {
            message.value = e.response.data.message;
        })

}


onMounted(
    async () => {
        await retrieveAssets();
        filter()
        // await retrive();

    });



</script>

<script>
export default {
    data() {
        return {
            headers: [

                { title: 'Asset Type', align: 'start', key: 'assetType', width: '30%' },
                { title: 'Make', align: 'center', key: 'make', width: '15%' },
                { title: 'Model', align: 'center', key: 'model', sortable: false, width: '25%' },
                { title: 'Archive Asset', align: 'center', key: 'archive', sortable: false, width: '15%' },
                { title: 'Modify Data Fields', align: 'center', key: 'modifyData', sortable: false, width: '15%' }
            ],
            roleChoices: [

                'admin',
                'manager',
                'user',
                'inactive',
            ],
            filterCats: [
                { title: "Asset Type" },
                { title: "Make" },
                { title: "Model" },

            ],


        };
    }
};
</script>

<style></style>

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


        <v-card class="mx-auto pa-6" flat max-width="1250px">
            <v-app-bar class="pa-6 mx-auto" color="white" density="prominent" height="15" :elevation="2" flat>

                <!-- <v-app-bar-title>General Asset List</v-app-bar-title> -->
                <v-app-bar-title>General Asset List</v-app-bar-title>

                <v-text-field class="mx-auto" bg-color="white" v-model="keyword" prepend-inner-icon="mdi-magnify"
                    label="Search by name or ID" variant="outlined" density="compact" single-line rounded
                    @click:prepend-inner="filter()" v-on:keyup.enter="filter()">
                </v-text-field>
                <v-menu :close-on-content-click="false">

                    <template v-slot:activator="{ props }">
                        <v-btn class="mx-6" height="40" v-bind="props" color="#811429" variant="elevated">
                            Filters
                        </v-btn>
                    </template>

                    <v-card min-width="300" class="mx-auto">
                        <v-checkbox class="pa-3" v-model="showArchvied" label="Show Archived"
                            @update:modelValue="filter()">

                        </v-checkbox>
                        <v-list>
                            <v-list-item v-for="(item, index) in filterCats" :key="index">
                                <v-select v-if="item.title == 'Asset Type'" v-model="selectedTypes" label="Type"
                                    :items="displayedTypes" item-title="name" @update:modelValue="filter()" multiple>
                                </v-select>
                                <v-autocomplete v-model="selectedMakes" v-if="item.title == 'Make'"
                                    @update:modelValue="filter()" label="Make" item-title="make" :items="displayedMakes" multiple>
                                </v-autocomplete>
                                <v-autocomplete v-model="selectedModels" v-if="item.title == 'Model'"
                                    @update:modelValue="filter()" label="Model" item-title="model" :items="displayedModels" multiple>
                                </v-autocomplete>

                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-menu>


            </v-app-bar>


            <v-card class="pa-6 mx-6">


                <v-card-item max-width="1250px" location="center">
                    <v-data-table-virtual :items=displayedAssets :headers=headers density="comfortable" fixed-header>


                        <template v-slot:item.archive="{ item }">
                            <v-switch v-model="item.archived" @update:modelValue="archive(item)">

                            </v-switch>

                        </template>


                    </v-data-table-virtual>
                </v-card-item>
            </v-card>
        </v-card>


    </div>

    <v-overlay v-model="ArchiveChangeConfirm" class="align-center justify-center">
        <v-card class="pa-6">
            <v-card-title>Confirm change of {{ selectedAsset.model }} {{ selectedAsset.make }} to {{
        selectedAsset.archived }}</v-card-title>
            <v-card-actions>
                <v-btn @click="archiveConfirm()" class="mx-6" variant="flat" color="green" min-width="150"
                    min-height="40">
                    Confirm
                </v-btn>
                <v-btn @click="cancelArchive()" class="mx-6" variant="outlined" min-width="150" min-height="40">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>


    