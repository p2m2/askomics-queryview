<template>
  <div id="attributes-panel">    
    <attributeBox
      v-for="item in attributeList" :key="item.id"
      v-bind:config="config"
      v-bind:attribute="item"/>
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';

import AttributeBox from '../attribute/AttributeBox.vue'

@Options({
  components : { AttributeBox },
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
  }
})

export default class AttributesPanel extends Vue {

}
</script>

<style>
</style>
