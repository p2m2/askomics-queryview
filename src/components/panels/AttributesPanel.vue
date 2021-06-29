<template>
  <div id="attributes-panel" class="attributesList">
    
    <URIBox
          v-bind:config="config"
    >
    </URIBox>
    
    <attributeBox
      v-for="item in attributeList" :key="item.id"
      v-bind:config="config"
      v-bind:attribute="item"/>
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';

import AttributeBox from '@/components/attribute/AttributeBox.vue'
import URIBox from '@/components/attribute/URIBox.vue'
import RequestManager from '@/ts/RequestManager'
import UserIncrementManager from '@/ts/UserIncrementManager'
import { AskOmicsViewNode } from '@/ts/types'

@Options({
  components : { AttributeBox , URIBox },
  props : {
    selectedNode    : String,
    request         : RequestManager,
    width           : Number,
    height          : Number,
  },
  watch : {
    selectedNode : 'updateAttributeList'
  },
  data () {
    return {
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
  },
  mounted() {
    let attributesList = document.querySelector<HTMLElement>('.attributesList')
    if ( attributesList ) {
      attributesList.style.height = this.height + "px"
      attributesList.style.width  = this.width + "px"
    }
  },
  methods: {
    updateAttributeList(selectedNode : string) {
      console.log(" ------------ updateAttributeList -------------------------")
      const node = JSON.parse(selectedNode)
      UserIncrementManager.attributeList(this.request,node as AskOmicsViewNode).then(
        (response : Object[]) => {
          
          console.log(" --------attributeList")
          console.log(response)
          this.attributeList = response;
         
        }
      )
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
