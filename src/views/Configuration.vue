<template>
  <ConfigurationPanel :configurations_list="config_list" v-model:configuration="configuration" @updateConfigurationEvent="updateConfiguration" />
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
  emits: ["update"],
  data() { 
        return {
          config_list: [ ]
        }
  },
  
  computed: {
    configuration() {
      return UserConfiguration.build(JSON.parse(this.$route.params.configuration))
    }
  },

  methods : {
    updateConfiguration(configuration : string) {
      this.$emit('update',configuration)
    }
  }
})
export default class Configuration extends Vue {}
</script>