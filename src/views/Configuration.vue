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
          config_list: [ ],
          strategy : "data-driven"
        }
  },
  
  methods : {
    updateConfiguration(configuration : string) {
      this.$emit('updateConfigurationEvent',configuration)
    }
  }
})
export default class Configuration extends Vue {}
</script>