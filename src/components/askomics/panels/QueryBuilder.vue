<template>
  <div id="askomics-panel">
      <div class="container"> 
          <hr/>
          <!-- waiting div -->
          <div class="row">
                <div class="col col-xs-6">
                  {graphFilters}
               </div>
                <div class="col col-xs-4">
                  {removeButton}
                </div>
             </div>
              <br />
              <div class="row">
                
                <div class="col col-xs-7">
                  <QueryGraphPanel 
                    :request="request"
                    :graphStart="graph"
                    :selectedNodeStart="selectedNodeObject"
                    @informationSelectedNode="selectedNodeEvent" 
                    @queryString="queryStringEvent" 
                    :width="750" 
                    :height="450" />
                </div>
              <div class="col col-xs-5">
                  <AttributesPanel 
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
import { GraphBuilder } from '@/ts/GraphBuilder'

@Options({
  name: "QueryBuilder",
  
  components : {  
      QueryGraphPanel,AttributesPanel  
      },
  
  emits: ["updateQuery"],
  
  props : {
    query :  String
  },
  
  data () {
    return {
      request: null,
      graph : GraphBuilder.defaultGraph(),
      selectedNode : null,
    }
  },
  
  created() {
    console.log("MOUNT QUERY BUILDER")
    console.log("------------------------")
    this.request = new RequestManager(this.query)
    this.graph = GraphBuilder.build3DJSGraph(this.request)
  },
  
  methods: {
    
    update() {
      this.request = new RequestManager(this.query)
      this.graph = GraphBuilder.build3DJSGraph(this.request)
      this.selectedNode = this.request.getDiscovery().focus()
    },

    selectedNodeEvent(e : string) {
      console.log(" =============== selectedNodeEvent =================================",e)
      this.selectedNode = e
    },

    queryStringEvent(requestManagerStringify: string) {
      console.log("queryStringEvent")
      this.update()
      this.$emit('updateQuery',requestManagerStringify)
    },

    attributeBoxEvent(e: string) {
      console.log("attributeBoxEvent:",e)
    },
  }
  
})

export default class AskOmics extends Vue {

}

</script>

<style>
</style>
