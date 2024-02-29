<style scoped></style>
<script setup>


import { reactive, ref, onMounted, VueElement } from "vue";
import { useRouter } from "vue-router";
import specificAssetServices from "../services/specificAssetServices";
import assetStatusServices from "../services/assetStatusServices"



const router = useRouter();
const assets =ref([]);
const displayedAssets = ref([]);
const message = ref("");
const keyword = ref("");
const snackbar = ref(false);
const assetTypes = ref([]);
const selectedAssetType = ref([]);
const selectedStatus = ref([]);
const status = ref([]);
const assetStatuses = ref([]);
const asset = ref([]);

async function searchAsset() {
  displayedAssets.value = [];
  if (keyword.value.trim() !== "") {
    displayedAssets.value = assets.value.filter(
      asset =>
        asset.name.toLowerCase().includes(keyword.value.trim().toLowerCase()) ||
        asset.id.toString().includes(keyword.value.trim())
    );
    if (displayedAssets.value.length === 0) {
      snackbar.value = true;
    }
  } else {
    displayedAssets.value = assets.value;
    snackbar.value = true;
  }
}
function filter() {
  displayedAssets.value = [];
  filterAssets().forEach(asset => {
    if (!displayedAssets.value.includes(asset)) displayedAssets.value.push(asset);
  });
  if (displayedAssets.value.length === 0) {
    assets.value.forEach(asset => {
      displayedAssets.value.push(asset);
    });
  }
}

function filterAssets() {
  let returnedAssets = [...assets.value];
  if (selectedAssetType.length > 0) {
    returnedAssets = returnedAssets.filter(asset => selectedAssetType.includes(asset.assetType));
  }
  if (selectedStatus.length > 0) {
    returnedAssets = returnedAssets.filter(asset => selectedStatus.includes(asset.status));
  }
  return returnedAssets;
}

async function retrieveAssets() {
    console.log('here')
  await specificAssetServices.getAll()
  .then((response) => {
    console.log('assets',response.data)
    assets.value = response.data;
    assets.value.forEach (asset => {
        assetStatuses.value.push(retrieveStatus(asset))
    })
    displayedAssets.value = assets.value;
   
    assetTypes.value = [...new Set(assets.value.map(asset => asset.assetType))];
    status.value = [...new Set(assets.value.map(asset => asset.status))];
    })
    .catch((e) =>{
    message.value = e.response.data.message;
    });
}

async function retrieveStatus(specificAsset) {
  await assetStatusServices.getForAsset(specificAsset.id)
  .then ((response) => {
    console.log('asset', response.data)
    asset.value = response.data;
    }
  )
  .catch ((e) =>  {
    message.value = e.response.data.message;
  })
}

onMounted(async () => {
  await retrieveAssets();
});

</script>
<script>
export default {
    data() {
        return {
            headers: [
                { title: 'Serial #', align: 'start', key: 'Serial#', sortable: false, width: '10%' },
                { title: 'Asset Type', align: 'start', key: 'AssetType', sortable: false, width: '10%' },
                { title: 'Make', align: 'start', key: 'AssetName' , width: '10%' },
                { title: 'Model', align: 'center', key: 'model', sortable: false, width: '10%' },
                { title: 'Status', align: 'center', key: 'status', sortable: false, width: '10%' },
                { title: 'Edit Asset', align: 'center', key: 'edit', sortable: false, width: '10%' },
                { title: 'Notes', align: 'center', key: 'edit', sortable: false, width: '10%' },


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

            <v-card-item>
            <v-toolbar  class="pa-6 ma-3" color="white" density="prominent" height="15">
                <v-text-field class="mx-auto" v-model="keyword"  prepend-inner-icon="mdi-magnify" label="Search by name or ID"
                    variant="outlined" density="compact" single-line rounded
                    @click:prepend-inner="searchAsset()" v-on:keyup.enter="searchAsset()">
                </v-text-field>
                <v-btn class="mx-6" height="40"  color="#801529" variant="elevated">
                        Add Asset
                    </v-btn>
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
                            <v-select v-if="item.title == 'Asset Type'" v-model="selectedAssetType" label="Asset Type"
                                :items="Model" item-title="name" @update:modelValue="filter()" multiple>
                            </v-select>
                            <v-select v-if="item.title == 'Status'" v-model="model" label="Status"
                                :items="Model" item-title="name" @update:modelValue="filter()" multiple>
                            </v-select>

                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-toolbar> 
        </v-card-item>
        </v-card>
    </div>
    <div>

        <v-data-table-virtual :items=displayedAssets :headers=headers density="comfortable" fixed-header>


            <template v-slot:item.edit>
                <v-btn @click="viewUser(user)" prepend-icon="mdi-pencil">

                </v-btn>
            </template>

        </v-data-table-virtual>
    </div>
</template>