<template>
  <div id="attributes-panel" class="attributesList">
    <div class="d-flex justify-content-end">
       <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
         
          <div>
            <div id="v-model-select-property" class="form-control" v-if="displayCommonAttributeButtons" >
              <select v-model="selected_filterProperty">
                <option :key="propFilter.id" :value="propFilter.id" v-for="propFilter in propertyFilterList">{{ propFilter.label }}</option>
              </select>
            </div>
          </div>
          
          <div>
            <button type="button" class="form-control btn btn-secondary" @click="removeNode" v-if="displayRemoveButton">Remove</button>
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
      :attribute="item"
      @updateAttribute="updateAttribute"
      />
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';

import AttributeBox from '../attribute/AttributeBox.vue'
import RequestManager from '@/ts/RequestManager'
/*
import UserIncrementManager from '@/ts/UserIncrementManager' */
import { FilterProperty } from '@/ts/types'
import { GraphBuilder } from '@/ts/GraphBuilder'


@Options({
  name: "AttributesPanel",
  emits: ["updateRequestManager","updateFilterProperty"],
  components : { AttributeBox },
  props : {
    requestString     : {
                          type: String,
                          required: true
                        },
    width             : Number,
    height            : Number,
  },

  created() {
   
  },

  mounted() {
    this.updateRequestString(this.requestString)
    let attributesList = document.querySelector<HTMLElement>('.attributesList')
    if ( attributesList ) {
      attributesList.style.height = this.height + "px"
      attributesList.style.width  = this.width + "px"
    }   
  },

  watch : {
    requestString(value) {
      this.updateRequestString(value) 
    
    },

    selected_filterProperty(value) {
      this.$emit('updateFilterProperty',JSON.stringify(value))
    } 
  },
  data () {
    return {
      propertyFilterList : [
        {
          id: FilterProperty.TO,
          label : "TO"
        },
        {
          id: FilterProperty.FROM,
          label : "FROM"
        },
        {
          id: FilterProperty.IS_A,
          label : "IS_A"
        },
        {
          id: FilterProperty.ALL,
          label : "ALL"
        },
      ],
      request : null,
      selected_filterProperty : FilterProperty.TO,
      attributeList: [],
      componentKey: 0,
    }
  },

  computed : {
    displayCommonAttributeButtons() {
      if (this.request) {
        return this.request.focusIsSelected()
      }
      return false
    },

    displayRemoveButton() {
      if (this.request) {
        return this.request.focusIsSelected() && !this.request.isFocusStart()
      }
        
      else
        return false
    }


  },

 
  methods: {
    
    updateRequestString(value : string) {

      this.request = new RequestManager(value,this)
      this.updateAttributeList()
    },

    updateAttributeList() {
      if (this.request.focusIsSelected()) { 
        GraphBuilder.buildAttributesBox(this.request).then(
          (response : Object[]) => {
            this.attributeList = response
          })
      } else {
        this.attributeList = [];
      }     
    },

    removeNode() {
      this.request.removeNode(this)
      this.updateAttributeList()
    },

    updateAttribute(event : string) {
      this.request.updateAttribute(JSON.parse(event))
      this.updateAttributeList()
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
