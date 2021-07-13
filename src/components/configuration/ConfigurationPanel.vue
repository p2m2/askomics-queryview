<template>
  <div id="configuration-panel">
      <div class="container"> 
          <hr/>
          
          <div class="row">
            <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">Action</a>
                      <a class="dropdown-item" href="#">Another action</a>
                      <a class="dropdown-item" href="#">Something else here</a>
                      <div role="separator" class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Separated link</a>
                    </div>
                  </div>
                  <input type="text" class="form-control" aria-label="Text input with dropdown button">
                </div>
        
          </div>

          <hr/>
          
          <div class="row" >
             <div class="col col-xs-4">
                  <label for="sel1">Strategy:</label>
              </div>
               <div class="col col-xs-6">     
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
  emits: ["update"],
  props : {
    configurations_list : {
      type    : Array,
      default : () => [

      ]
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
      this.$emit('update',JSON.stringify([this.configuration.jsonConfigurationSWDiscoveryString(),this.strategyInt]))
    },
  }
  
})

export default class ConfigurationPanel extends Vue {

}

</script>

<style>
</style>
