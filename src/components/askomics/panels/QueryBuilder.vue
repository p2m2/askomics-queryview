<template>
  <div id="askomics-panel">
      <div class="container"> 
          <hr/>
          <!-- waiting div -->
          
              <br />
              <div class="row">
                
              <div class="col col-xs-7">
                  <QueryGraphPanel 
                    v-model:requestString="currentQuery"
                    @updateRequestManager="updateQuery"
                    @requestManagerBusy="requestBusy = JSON.parse($event)"
                    @requestManagerBusyPercent="requestBusyPercent = JSON.stringify(JSON.parse($event)*100)"
                    @requestManagerBusyEvent="requestBusyEvent"
                    :width="750" 
                    :height="450" />
              </div>
              
              <div class="col col-xs-5">
                  <AttributesPanel 
                    v-model:requestString="currentQuery"
                    @updateRequestManager="updateQuery"
                    :width="450" 
                    :height="450"
                   />
              </div>
              
         </div>
         <div class="row">


           <div class="d-flex flex-row mb-3">
              <div class="p-2 bd-highlight">
              <button type="button" class="form-control btn btn-primary" @click="back">&lt;&lt;</button>
             </div>
             <div class="p-2 bd-highlight">
              <button type="button" class="form-control btn btn-primary" @click="forward">&gt;&gt;</button>
             </div>
             
             <div class="p-2 bd-highlight">
              <button type="button" class="form-control btn btn-primary" @click="getResults">Results</button>
             </div>

             <div class="p-2 bd-highlight">
              <button type="button" class="form-control btn btn-primary" @click="forward">URL</button>
             </div>

            <div class="p-2 bd-highlight">
             <font-awesome-icon icon="spinner" size="2x" spin v-if="requestBusy" />
             </div>
          </div>
                
          <div class="progress" v-if="requestBusy">
                <div class="progress-bar" role="progressbar" :style="'width: '+requestBusyPercent+'%'" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                  {{ requestBusyPercent }} {{ requestBusyEvent }}
                </div>
          </div> 
         </div>
     </div>
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import "bootstrap/dist/css/bootstrap.min.css"
import router from '@/router/index';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


import QueryGraphPanel from './QueryGraphPanel.vue'
import AttributesPanel from './AttributesPanel.vue'

[ faSpinner ].map(icon => library.add(icon)) ;

@Options({
  name: "QueryBuilder",
  
  components : {  
      library,FontAwesomeIcon, QueryGraphPanel,AttributesPanel
      },
  
  emits: ["updateQuery"],
  
  props : {
    query :  String
  },
 
  data () {
    return {
      currentQuery       : this.query,
      requestBusy        : false,
      requestBusyPercent : "0",
      requestBusyEvent   : ""
    }
  },
   
  watch : {
    requestBusy : 'prepareRequestBusy',
    requestBusyPercent : 'prepareRequestBusy'
  } ,
  
  methods: {
    
    prepareRequestBusy() {
      if (!this.requestBusy || this.requestBusyPercent == "100") {
        this.requestBusyPercent = "0"
        this.requestBusyEvent = ""
      }
    },

    updateQuery(value : string) {
      this.currentQuery = value
      this.$emit('updateQuery',value)
    },

    attributeBoxEvent(e: string) {
      console.log("attributeBoxEvent:",e)
    },

    /* https://router.vuejs.org/guide/essentials/navigation.html*/

    getResults() {
      router.push({ name : 'results' , params: { rm: this.currentQuery }})
    } ,

    back() {

    } ,

    forward() {

    }
  }
  
})

export default class AskOmics extends Vue {

}

</script>

<style>
</style>
