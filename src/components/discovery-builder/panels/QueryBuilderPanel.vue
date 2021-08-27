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
                <font-awesome-icon icon="spinner" size="2x" spin v-if="requestBusy" />
        
                <div class="progress" v-if="requestBusy">
                      <div class="progress-bar" role="progressbar" :style="'width: '+requestBusyPercent+'%'" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                        {{ requestBusyPercent }} {{ requestBusyEvent }}
                      </div>
                </div>
                </div>
                </div> 
         </div>
     </div>
 
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import "bootstrap/dist/css/bootstrap.min.css"

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


import QueryGraphPanel from './QueryGraphPanel.vue'
import AttributesPanel from './AttributesPanel.vue'
import { FilterProperty } from '@/ts/types';

[ faSpinner ].map(icon => library.add(icon)) ;


@Options({
  name: "QueryBuilderPanel",
  
  components : {  
      library,FontAwesomeIcon, QueryGraphPanel,AttributesPanel
      },
  
  emits: ["updateRequestManager"],
  
  props : {
    requestString :  String
  },
 
  data () {
    return {
      currentQuery       : this.requestString,
      requestBusy        : false,
      requestBusyPercent : "0",
      requestBusyEvent   : "",
      filterProperty     : FilterProperty.TO,
    }
  },
   
  watch : {
    requestBusy : 'prepareRequestBusy',
    
    requestBusyPercent : 'prepareRequestBusy',

    requestString() {
      this.currentQuery = this.requestString
    }

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
      this.$emit('updateRequestManager',this.currentQuery)
    },

    attributeBoxEvent(e: string) {
      console.log("attributeBoxEvent:",e)
    },
  }
})

export default class QueryBuilderPanel extends Vue {

}

</script>

<style>
.modal-body{
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}
</style>
