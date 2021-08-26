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
                    v-model:filterProperty="filterProperty"
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
                    @updateFilterProperty="filterProperty = JSON.parse($event)"
                    :width="450" 
                    :height="450"
                   />
              </div>
              
         </div>
         <div class="row">
          <div class="col">
            <div class="btn-group" role="group" aria-label="tools graph">
              <button type="button" class="form-control btn btn-primary" @click="back" v-if="backwardActive">
                <font-awesome-icon icon="backward" />  
              </button>
              <button type="button" class="form-control btn btn-primary disabled" v-else disabled>
                 <font-awesome-icon icon="backward" />  
              </button>

              <button type="button" class="form-control btn btn-primary" @click="forward" v-if="forwardActive">
                 <font-awesome-icon icon="forward" />  
              </button>
              <button type="button" class="form-control btn btn-primary disabled"  v-else disabled>
                 <font-awesome-icon icon="forward" />  
              </button>

              <button type="button" class="form-control btn btn-primary" @click="getResults">
                <font-awesome-icon icon="poll" />  
              </button>            
              
              <button type="button" class="form-control btn btn-primary" @click="copyPermalinkQueryBuilderToClipBoard">
                <font-awesome-icon icon="clipboard" />
              </button>

              <button type="button" class="form-control btn btn-primary" @click="copyPermalinkQueryBuilderToClipBoard">
                <font-awesome-icon icon="clipboard-list" />
              </button>

              <button type="button" class="form-control btn btn-danger" @click="clear">Clear</button>
            </div>
            </div>  
          <div class="col col-xs-5">
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
 
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import "bootstrap/dist/css/bootstrap.min.css"
import router from '@/router/index';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBackward, faForward, faSpinner, faClipboard, faClipboardList, faPoll } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


import QueryGraphPanel from './QueryGraphPanel.vue'
import AttributesPanel from './AttributesPanel.vue'
import { FilterProperty } from '@/ts/types';
import RequestManager from '@/ts/RequestManager'

[ faBackward, faForward, faSpinner, faClipboard, faClipboardList, faPoll ].map(icon => library.add(icon)) ;

@Options({
  name: "QueryBuilder",
  
  components : {  
      library,FontAwesomeIcon, QueryGraphPanel,AttributesPanel
      },
  
  emits: ["updateRequestManager","updateQuery"],
  
  props : {
    query :  String
  },
 
  data () {
    return {
      currentQuery       : this.query,
      requestBusy        : false,
      requestBusyPercent : "0",
      requestBusyEvent   : "",
      filterProperty     : FilterProperty.TO,
      forwardActive      : false,
      backwardActive     : false,
    }
  },
   
  watch : {
    requestBusy : 'prepareRequestBusy',
    requestBusyPercent : 'prepareRequestBusy'
  } ,

  created() {
  },
  
  mounted() {
  },

  computed : {
  },

  methods: {
    
    prepareRequestBusy() {
      if (!this.requestBusy || this.requestBusyPercent == "100") {
        this.requestBusyPercent = "0"
        this.requestBusyEvent = ""
      }
    },

    updateQuery(value : string) {
      this.currentQuery = value
      this.updateHistoryButton() 
      this.$emit('updateQuery',this.currentQuery)
    },

    attributeBoxEvent(e: string) {
      console.log("attributeBoxEvent:",e)
    },

    /* https://router.vuejs.org/guide/essentials/navigation.html*/

    getResults() {
      router.push({ name : 'results' , params: { rm: require('lzbase62').compress(this.currentQuery) }})
    } ,

    updateHistoryButton() {
      this.forwardActive  = RequestManager.forwardIsActive()
      this.backwardActive = RequestManager.backwardIsActive()
    },

    back() {
      this.updateQuery(RequestManager.backward())
      this.updateHistoryButton() 
    } ,

    forward() {
      this.updateQuery(RequestManager.forward())
      this.updateHistoryButton() 
    },

    copyPermalinkQueryBuilderToClipBoard() {
        const compressed = require('lzbase62').compress(this.currentQuery);
        const url = document.location.origin+process.env.BASE_URL+"query/"+compressed
        const vue = this
        navigator.clipboard.writeText(url).then(function() {
            /* clipboard successfully set */
            vue.$toast.success("query builder url to clipboard !"); 
          }, function(e:Event) {
            /* clipboard write failed */
            vue.$toast.error("query builder url to clipboard failed !"); 
             console.error(e)
          });
    },

    clear() {
      let r = new RequestManager(this.currentQuery,this)
      r.clear()
      this.updateQuery(r.serialized())
      this.$toast.info("clear session !"); 
    },

  }
  
})

export default class AskOmics extends Vue {

}

</script>

<style>
.modal-body{
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}
</style>
