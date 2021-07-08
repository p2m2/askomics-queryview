<template>
  <div id="configuration-panel">
      <div class="container"> 
          <hr/>
          <!-- waiting div -->
          <div class="row">
                <div class="col col-xs-6">
                sssss
               </div>
               <div class="col col-xs-1">     
                <div class="form-check form-check-inline">
                    <input name="strategyRequest" value="askomics" class="form-check-input" type="radio" v-model="strategyInt">
                    <label class="form-check-label" for="strategyRequest">
                      AskOmics 
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input name="strategyRequest" value="data-driven" class="form-check-input" type="radio" v-model="strategyInt">
                    <label class="form-check-label" for="strategyRequest">
                      Data-Driven
                    </label>
                  </div>
                </div> 
                <div class="col col-xs-4">
                  ddd
                </div>
             </div>
     </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import "bootstrap/dist/css/bootstrap.min.css"
import { UserConfiguration } from '@/ts/types'

@Options({
  name: "ConfigurationPanel",
  components : {  
      },
  emits: ["updateConfigurationEvent"],
  props : {
    /*
      `{
              "sources" : [{
              "id"  : "metabolights",
              "url" : "https://metabolights.semantic-metabolomics.fr/sparql"
              }]}`,
           `{
              "sources" : [{
              "id"  : "local",
              "url" : "http://localhost:8890/sparql"
            }]}`
    */
    configurations_list : {
      type    : Array,
      default : () => []
      },
     strategy: {
      type    : String,
      default : "data-driven"
    }
  },

  data () {
    return {
    strategyInt: this.strategy,
    configuration: null 
    }
  },

  watch : {
    strategyInt: {
       handler : 'updateStrategy',
       immediate : false
      }
  },
  
  mounted() {
    this.configuration          = new UserConfiguration("metabolights")
    this.configuration.strategy = this.strategy
    this.configuration.url      = "https://askomics-metabolights-192-168-100-98.vm.openstack.genouest.org/virtuoso/sparql"
    this.configuration.mimetype = "application/sparql-query"
  },
  
  methods: {

    updateStrategy(value : string) {
      this.configuration.strategy = value
      this.$emit('updateConfigurationEvent',this.configuration.jsonConfigurationSWDiscoveryString())
    },
  }
  
})

export default class ConfigurationPanel extends Vue {

}

</script>

<style>
</style>
