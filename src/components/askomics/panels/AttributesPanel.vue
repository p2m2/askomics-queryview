<template>
  <div id="attributes-panel" class="attributesList">
    <div class="d-flex justify-content-end">
       <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
         
          <div>
            <div id="v-model-select-property" class="form-control" v-if="displayButtons">
              <select v-model="selected_property_search">
                <option value="IS_A">IS A</option>
                <option value="TO">TO</option>
                <option value="FROM">FROM</option>
              </select>
            </div>
          </div>
          
          <div>
            <button type="button" class="form-control btn btn-secondary" @click="removeNode" v-if="displayButtons">Remove</button>
            <button type="button" class="form-control btn btn-secondary" v-else disabled>Remove</button>
          </div>
          
          <!--
          <div class="btn-group" role="group">
            <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a class="dropdown-item" href="#">Dropdown link</a>
              <a class="dropdown-item" href="#">Dropdown link</a>
            </div>
          </div>-->
       </div>
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
      selected_property_search : "IS_A",
      attributeList: []
    }
  },

  computed : {
    displayButtons() {
      console.log("------------ DISPLAY BUTTON -----------------")
      
      if (this.request) {
        console.log(this.request.getDiscovery().focus())
        return this.request.focusIsSelected()
      }
        
      else
        return false
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
      console.log("............................................... update request string....................................................... ")
      this.request = new RequestManager(value)

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
