<template>
  <ConfigurationPanel 
     :configurations_list="config_list" 
     :requestManagerStringify="requestManagerStringify"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ConfigurationPanel from '@/components/configuration/ConfigurationPanel.vue'

@Options({
  name: "Configuration",
  components: {
    ConfigurationPanel
  },

  data() { 
        return {
          config_list: [ ]
        }
  },
  
  computed: {
    
    requestManagerStringify() {
      return require('lzbase62').decompress(this.$route.params.rm)
    }
  },

  methods : {
  }
})
export default class Configuration extends Vue {}
</script>