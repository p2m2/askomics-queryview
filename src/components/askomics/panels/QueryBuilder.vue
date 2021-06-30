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
import {AskOmicsViewNode, Graph3DJS, ObjectState, UserConfiguration} from '@/ts/types'

@Options({
  name: "QueryBuilder",
  components : {  
      QueryGraphPanel,AttributesPanel  
      },
  emits: ["updateQuery"],
  props : {
    userConfig : {
      type    : Object,
      require : true,
      default : () => {}
    }, 
    query : {
      type : String,
      default : (props : any) => { 
        return new RequestManager(new UserConfiguration(props.userConfig.id,"","")) 
        }
    }
  },
  data () {
    return {
      request: null,
      graph : {
        nodes : [ AskOmicsViewNode.something(ObjectState.CONCRETE).getObject() ],
        links : []
      },
      selectedNode : null,
    }
  },
  
  watch: {
    userConfig: {
       handler : 'updateConfiguration',
       immediate : false
      }
  },

  created() {
    console.log("MOUNT QUERY BUILDER")
    console.log("------------------------")
    this.request = new RequestManager(this.userConfig as UserConfiguration)

    if (this.query && this.query.length>0) {
      const tab = JSON.parse(this.query)
      //alert("DISCOVERY:"+tab[0])
      this.request.parse(tab[0])
      //this.request.getDiscovery().console()
      //console.log(JSON.stringify(tab[1]))
      this.graph = tab[1] as Graph3DJS
    }
    
    
  },
  
  methods: {
    updateConfiguration(userConfig : UserConfiguration) {
      console.log("************************** USER CONFIG QUERY BUILDER ************************ ")
      console.log(userConfig)
    },
    selectedNodeEvent(e : string) {
      console.log(" =============== selectedNodeEvent =================================",e)
      this.selectedNode = e
    },

    queryStringEvent(value: string) {
      console.log("queryStringEvent")
      console.log(this.request.getDiscovery().getSerializedString)
      //alert("DISCOVERY:"+this.request.getDiscovery().getSerializedString)
      this.$emit('updateQuery',JSON.stringify([this.request.getDiscovery().getSerializedString,JSON.parse(value)]))
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
