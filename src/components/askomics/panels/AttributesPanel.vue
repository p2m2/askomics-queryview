<template>
  <div id="attributes-panel" class="attributesList">
    
    <attributeBox
      v-for="item in attributeList" :key="item.id"
      v-bind:attribute="item"/>
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';

import AttributeBox from '../attribute/AttributeBox.vue'
import RequestManager from '@/ts/RequestManager'
/*
import UserIncrementManager from '@/ts/UserIncrementManager'
import { AskOmicsViewNode } from '@/ts/types'*/
import { GraphBuilder } from '@/ts/GraphBuilder'

@Options({
  name: "AttributesPanel",
  components : { AttributeBox },
  props : {
    selectedNodeId    : String,
    request           : RequestManager,
    width             : Number,
    height            : Number,
  },
  watch : {
    selectedNodeId : 'updateAttributeList'
  },
  data () {
    return {
      attributeList: [ 
        /*{
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
                }*/
                ]
    }
  },
  mounted() {
    let attributesList = document.querySelector<HTMLElement>('.attributesList')
    if ( attributesList ) {
      attributesList.style.height = this.height + "px"
      attributesList.style.width  = this.width + "px"
    }
    if(this.request)
      GraphBuilder.buildAttributesBox(this.request,this.selectedNodeId)
  },
  
  methods: {
    updateAttributeList(selectedNodeId : string) {
      console.log(" ------------*************************************** updateAttributeList -------------------------")
      console.log(selectedNodeId)
       GraphBuilder.buildAttributesBox(this.request,this.selectedNodeId).then(
        (response : Object[]) => {
          
          console.log(" --------attributeList")
          console.log(response)
          this.attributeList = response;
         
        })
        
       /*
      const node = JSON.parse(selectedNodeId)
      UserIncrementManager.attributeList(this.request,node as AskOmicsViewNode).then(
        (response : Object[]) => {
          
          console.log(" --------attributeList")
          console.log(response)
          this.attributeList = response;
         
        }
      )*/
    }
  }
})

export default class AttributesPanel extends Vue {

}
</script>

<style>
.attributesList {
  display: 'block' ;
  overflow-y:auto  ;
}
</style>
