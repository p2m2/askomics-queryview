<template>
  <ConfigurationPanel :configurations_list="config_list" v-model:configuration="configuration" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ConfigurationPanel from '@/components/configuration/ConfigurationPanel.vue'
import { UserConfiguration } from '@/ts/types'

@Options({
  name: "ConfigurationView",
  components: {
    ConfigurationPanel
  },

  data() { 
        return {
          config_list: [ ]
        }
  },
  
  computed: {
    configuration() {
      if (this.$route.params.configuration)
        return UserConfiguration.build(JSON.parse(this.$route.params.configuration))
      else 
        return undefined
    }
  },

  methods : {
  }
})
export default class Configuration extends Vue {}
</script>