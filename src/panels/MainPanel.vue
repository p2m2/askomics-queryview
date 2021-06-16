<template>
  <div id="main-panel">
      <BContainer>    
   bandeau
   <br/>
   <h2>Query Builder</h2>
        
    <hr />
    <!-- waiting div -->
    <BRow>
          <BCol xs="7">
            {graphFilters}
          </BCol>
          <BCol xs="5">
            {removeButton}
          </BCol>
        </BRow>
        <br />
        <BRow>
            <BCol xs="7">
             <QueryGraphPanel v-bind:width="500" v-bind:height="400" /> 
          </BCol>
          <BCol xs="5">
            <div class="attributes-list">
               <AttributesPanel />
            </div>
          </BCol>
        </BRow>
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
   </BContainer>    
  </div>
</template>

<script>
import QueryGraphPanel from './QueryGraphPanel.vue'
import AttributesPanel from './AttributesPanel.vue'
import { BContainer,BRow, BCol } from 'bootstrap-vue'

export default {
  name: 'MainPanel',
  components : {  
      BContainer, BRow, BCol,
      QueryGraphPanel,AttributesPanel  
      },
  data () {
    return {
      something: [ ],
       config: {
                    user: {
                        admin : true
                    }
                },
      attributeList: [ {
                    id: 5,
                    uri: "rdf:something",
                    range : "xsd:string",
                    label: "TestLabel",
                    visible: false,
                    negative: false,
                    linked: false,
                },
                {
                    id: 8,
                    uri: "rdf:something",
                    range : "xsd:integer",
                    label: "TestLabelNumeric",
                    visible: false,
                    negative: false,
                    linked: false,
                },
                {
                    id: 888,
                    uri: "rdf:something",
                    range : "unkown!!!!",
                    label: "TestLabelNumeric",
                    visible: false,
                    negative: false,
                    linked: false,
                }]
    }
  }
}
</script>

<style lang="scss">
.attributes-list {
    display: 'block' ;
    overflow-y: 'auto' ;
    height: 100px ;
}
</style>
