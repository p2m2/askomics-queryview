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


@Options({
  name: "ConfigurationPanel",
  components : {  
      },
  emits: ["updateConfigurationEvent"],
  props : {
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
      configuration: {
        strategy : this.strategy,
        endpoint : "https://metabolights.semantic-metabolomics.fr/sparql",
        type_endpoint : null
      }
    }
  },

  watch : {
    strategyInt: {
       handler : 'updateStrategy',
       immediate : false
      }
  },
  
  mounted() {
    //this.request = new RequestManager(this.config)
    //this.updateStrategy(this.strategy)
  },
  
  methods: {
    updateStrategy(value : string) {
      this.configuration["strategy"] = value
      this.$emit('updateConfigurationEvent',JSON.stringify(this.configuration))
    },
  }
  
})

export default class ConfigurationPanel extends Vue {

}

</script>

<style>
</style>
