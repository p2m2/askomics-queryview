<template>
  <div id="main-panel">
      <div class="container"> 
        bandeau
        <br/>
        <h2>Query Builder</h2>
        
          <hr/>
        
          <!-- waiting div -->
          <div class="row">
                <div class="col col-xs-7">
                  {graphFilters}
               </div>
                <div class="col col-xs-5">
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
                    <AttributesPanel />
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
import QueryGraphPanel from './QueryGraphPanel.vue'
import AttributesPanel from './AttributesPanel.vue'
import RequestManager  from '../../ts/RequestManager'

@Options({
  components : {  
      QueryGraphPanel,AttributesPanel  
      },
  data () {
    return {
      request: null
    }
  },
  mounted() {
    this.request = new RequestManager();
    this.request.startWithConfiguration(
      `
          {
          "sources" : [{
          "id"  : "metabolights",
          "url" : "https://metabolights.semantic-metabolomics.fr/sparql"
           }]}
          `
    );
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
