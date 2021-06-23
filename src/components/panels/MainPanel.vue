<template>
  <div id="main-panel">
      <div class="container"> 
        bandeau
        <br/>
        <h2>Query Builder</h2>
        
          <hr/>
        
          <!-- waiting div -->
          <div class="row">
                <div class="col col-xs-6">
                  {graphFilters}
               </div>
               <div class="col col-xs-1">
                <div class="form-check form-check-inline">
                    <input v-on:click="request.setAskOmicsStrategy()" name="strategyRequest" value="askomics" class="form-check-input" type="radio" checked>
                    <label class="form-check-label" for="strategyRequest">
                      AskOmics 
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input v-on:click="request.setDataDrivenStrategy()" name="strategyRequest" value="data-driven" class="form-check-input" type="radio">
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
                  <QueryGraphPanel v-bind:request="request" v-bind:width="500" v-bind:height="400" />
                  </div>
                <div class="col col-xs-5">
                  <div class="attributes-list">
                    <AttributesPanel v-bind:request="request"/>
                  </div>
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
     </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import "bootstrap/dist/css/bootstrap.min.css"
import QueryGraphPanel from './QueryGraphPanel.vue'
import AttributesPanel from './AttributesPanel.vue'
import RequestManager  from '../../ts/RequestManager'

@Options({
  components : {  
      QueryGraphPanel,AttributesPanel  
      },
  
  props : {
    config : String
  },

  data () {
    return {
      request: null,
      strategyRequest: ""
    }
  },
  
  mounted() {
    this.request = new RequestManager(this.config)
    this.request.setAskOmicsStrategy()
  }
})

export default class MainPanel extends Vue {

}

</script>

<style>
.attributes-list {
    display: 'block' ;
    overflow-y: 'auto' ;
    height: 100px ;
}
</style>
