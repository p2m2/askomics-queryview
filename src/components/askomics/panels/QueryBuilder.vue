<template>
  <div id="askomics-panel">
      <div class="container"> 
          <hr/>
          <!-- waiting div -->
          <div class="row">
                <div class="col col-xs-6">
                  {graphFilters}
               </div>
               <div class="col col-xs-1">     
                <div class="form-check form-check-inline">
                    <input name="strategyRequest" value="askomics" class="form-check-input" type="radio" v-model="strategyInt">
                    <label class="form-check-label" for="strategyRequest">
                      AskOmics 
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input name="strategyRequest" value="data-driven" class="form-check-input" type="radio" v-model="strategyInt">
                    <label class="form-check-label" for="strategyRequest">
                      Data-Driven
                    </label>
                  </div>
                </div> 
                <div class="col col-xs-4">
                  {removeButton}
                </div>
             </div>
              <br />
              <div class="row">
                <div class="col col-xs-7">
                  <QueryGraphPanel 
                    v-model:updateComponent="update" 
                    v-model:request="request" 
                    @informationSelectedNode="selectedNodeEvent" 
                    @queryString="queryStringEvent" 
                    :width="750" 
                    :height="450" />
                </div>
              <div class="col col-xs-5">
                  <AttributesPanel 
                    v-model:updateComponent="update" 
                    v-model:request="request"
                    :selectedNode="selectedNode" 
                    @attributeBox="attributeBoxEvent"
                    :width="450" 
                    :height="450"
                   />
              </div>
        <!--
        {warningDiskSpace}
              <br />
              <ButtonGroup>
                {previewButton}
                {launchQueryButton}
              </ButtonGroup>
              <br /> <br />
              <div>
                {resultsTable}
              </div>
              <ErrorDiv status={this.state.status} error={this.state.error} errorMessage={this.state.errorMessage} customMessages={{"504": "Query time is too long, use Run & Save to get your results", "502": "Query time is too long, use Run & Save to get your results"}} />
        -->
         </div>
         <div class="row">
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
         </div>
     </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import "bootstrap/dist/css/bootstrap.min.css"
import QueryGraphPanel from './QueryGraphPanel.vue'
import AttributesPanel from './AttributesPanel.vue'
import RequestManager  from '@/ts/RequestManager'

@Options({
  components : {  
      QueryGraphPanel,AttributesPanel  
      },
  
  props : {
    config : String,
    strategy: {
      type: String,
      default : "data-driven"
    }
  },

  data () {
    return {
      update: "",
      request: null,
      strategyInt : this.strategy,
      selectedNode : null
    }
  },

  watch : {
      strategyInt: {
       handler : 'updateStrategy',
       immediate : false
      }
  },
  
  mounted() {
    this.request = new RequestManager(this.config)
    this.updateStrategy(this.strategy)
  },
  
  methods: {
    selectedNodeEvent(e : string) {
      console.log(" =============== selectedNodeEvent =================================",e)
      this.selectedNode = e
    },

    queryStringEvent(e: string) {
      console.log("query:",e)
    },

    attributeBoxEvent(e: string) {
      console.log("attributeBoxEvent:",e)
    },

    updateStrategy(value : string) { 
      switch (value) {
        case "askomics" : {
          this.request.setAskOmicsStrategy()
          break;
        }
        case "data-driven" : {
          this.request.setDataDrivenStrategy()
          break;
        }
        default : {
          this.request.setDataDrivenStrategy()
        }
      }
      this.update = value
    },
  }
  
})

export default class AskOmics extends Vue {

}

</script>

<style>
</style>
