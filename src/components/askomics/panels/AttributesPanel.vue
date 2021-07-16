<template>
  <div id="attributes-panel" class="attributesList">
      <div class="d-flex justify-content-start" v-if="displayButtons">
          <button type="button" class="btn btn-secondary" @click="removeNode" >Remove</button>
      </div>
                
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
     this.updateRequestString(value) 
    }
  },
  data () {
    return {
      request : null,
      displayButtons : false,
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
      
      this.request = new RequestManager(value)
      
      this.displayButtons = this.request.focusIsSelected()

      if (this.request.focusIsSelected()) { 
        GraphBuilder.buildAttributesBox(this.request).then(
          (response : Object[]) => {
            this.attributeList =  response;
            this.attributeList.unshift({id : "uri", uri : "uri", range: "uri", label : "URI" })
          
          })
      } else {
        this.attributeList = [];
      }
    },
    removeNode() {
      alert("Remove !!!")
      this.request.removeNode(this)
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
