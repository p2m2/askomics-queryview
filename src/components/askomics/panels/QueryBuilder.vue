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
                    v-model:requestString="queryUp"
                    @updateRequestManager="updateQuery"
                    :width="750" 
                    :height="450" />
                </div>
              <div class="col col-xs-5">
                  <AttributesPanel 
                    v-model:requestString="queryUp"
                    @updateRequestManager="updateQuery"
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
      queryUp : ""
    }
  },
  
  created() {
    this.queryUp = this.query
  },
  
  mounted() {
    this.queryUp = this.query
  },
  
  methods: {
    updateQuery(value : string) {
      this.queryUp = value
      this.$emit('updateQuery',this.queryUp)
    },

    queryStringEvent(requestManagerStringify: string) {
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
