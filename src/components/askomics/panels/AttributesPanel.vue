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
  emits: ["updateRequestManager"],
  components : { AttributeBox },
  props : {
    requestString     : {
                          type: String,
                          required: true
                        },
    width             : Number,
    height            : Number,
  },
  watch : {
    requestString(value) {
      console.log("HOUPSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",value)
     this.updateRequestString(value) 
    }
  },
  data () {
    return {
      request : null,
      attributeList: []
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
    updateRequestString(value : string) {
      console.log(" 2 -- update requestString --- ")
      this.request = new RequestManager(value)
      GraphBuilder.buildAttributesBox(this.request).then(
        (response : Object[]) => {
          
          console.log(" --------attributeList")
          console.log(response)
          this.attributeList = response;
         
        })
    },
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
