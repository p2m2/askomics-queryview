<template>
  <ConfigurationPanel :configurations_list="config_list" :strategy="strategy" @updateConfigurationEvent="updateConfiguration" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ConfigurationPanel from '@/components/configuration/ConfigurationPanel.vue'

@Options({
  name: "ConfigurationView",
  components: {
    ConfigurationPanel
  },
  emits: ["updateConfigurationEvent"],
  data() { 
        return {
          config_list: [ 
            `{
              "sources" : [{
              "id"  : "metabolights",
              "url" : "https://metabolights.semantic-metabolomics.fr/sparql"
              }]}`,
           `{
              "sources" : [{
              "id"  : "local",
              "url" : "http://localhost:8890/sparql"
            }]}`],

          strategy : "data-driven"
        }
  },
  
  methods : {
    updateConfiguration(configuration : string) {
      console.log("1....UPDATE CONFIG.................")
      this.$emit('updateConfigurationEvent',configuration)
    }
  }
})
export default class Configuration extends Vue {}
</script>