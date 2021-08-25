<template>
  <div id="configuration-panel">
      <div class="container"> 
          <hr/>
          
          <div class="row">
            <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <select v-model="selectedimetype" class="form-control">
                    <option v-for="option in optionsMimetype" :key="option.text" v-bind:value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  </div>
                  <input type="text" v-model="selectedEndpoint" class="form-control" @change='updateConfiguration' placeholder="http://" list="browsers" aria-label="Endpoint">
                  <datalist id="browsers">
                    <option v-for="item in configurationsList" :key="item" v-bind:value="item.endpoint"/>
                  </datalist>
                </div>
        
          </div>
          
          <div class="row" >
            <div class="input-group mb-3" >
              <div>
                  <label class="form-control" for="sel1">Strategy:</label>
              </div>
              
              <div class="form-check form-check-inline">
                    <input name="strategyRequest" value="askomics" class="form-check-input" type="radio" v-model="selectedStrategy" @change='updateConfiguration'>
                    <label class="form-check-label" for="strategyRequest">
                      AskOmics 
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input name="strategyRequest" value="data-driven" class="form-check-input" type="radio" v-model="selectedStrategy" @change='updateConfiguration'>
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
  emits: ["updateConfiguration"],
  props : { 
    configuration: Object,
    configurationsList : {
      type    : Array,
      default : () => [
        {
          title    : "PeakForest",
          endpoint : "https://peakforest.semantic-metabolomics.fr/sparql",
          type     : "url",
          mimetype : "application/sparql-query"
        },
        {
          title    : "Metabolomics Endpoint - Metabolights",
          endpoint : "https://metabolights.semantic-metabolomics.fr/sparql",
          type     : "url",
          mimetype : "application/sparql-query"
        },
        {
          title    : "FORUM Endpoint - Metabolism Knowledge Network Portal",
          endpoint : "https://forum.semantic-metabolomics.fr/sparql/",
          type     : "url",
          mimetype : "application/sparql-query"
        },
        {
          title    : "Genostack - Metabolights",
          endpoint : "https://askomics-metabolights-192-168-100-98.vm.openstack.genouest.org/virtuoso/sparql",
          type     : "url",
          mimetype : "application/sparql-query"
        },
        {
          title    : "Metabolights_studies.ttl",
          endpoint : "https://raw.githubusercontent.com/p2m2/database-files/master/ttl/Metabolights_studies.ttl",
          type     : "file",
          mimetype : "text/turtle"
        },
        {
          title    : "Metabolights_studies_askomics.ttl",
          endpoint : "https://raw.githubusercontent.com/p2m2/database-files/master/ttl/Metabolights_studies_askomics.ttl",
          type     : "file",
          mimetype : "text/turtle"
        }
      ]
      },
     strategy: {
      type    : String,
      default : "data-driven"
    }
  },

  data () {
    return {
        selectedimetype: 'application/sparql-query',
        optionsMimetype: [
            { text: 'SPARQL', value: 'application/sparql-query' },
            { text: 'Turtle', value: 'text/turtle' }
          ],
        selectedStrategy: this.strategy,
        selectedEndpoint : "" 
    }
  },
  
  mounted() {

    if (this.configurationsList.length <= 0) {
      throw "devel : None configuration list is finded."
    }
     
    let configuration : UserConfiguration  

    if (! this.configuration ) {
      configuration = this.getUserConfiguration(this.configurationsList[0])
    } else {
      configuration = this.configuration
    }


    this.selectedimetype  = configuration.mimetype
    this.selectedEndpoint = configuration.url
    this.selectedStrategy = configuration.strategy
  },
  
  methods: {

    getUserConfiguration(configObj : any) {
      let configuration = new UserConfiguration(configObj.title)
      configuration.mimetype = configObj.mimetype
      
      switch (configObj.type) {
        case "url" : {
          configuration.url      = configObj.endpoint
          break ;
        }
        case "file" : {
          configuration.file     = configObj.endpoint
          break ;
        }
        case "content" : {
          configuration.content  = configObj.endpoint
          break ;
        }
        default : {
          configuration.url      = configObj.endpoint
        }
      }
      return configuration
    } ,
    
    updateConfiguration(event : Event) {
      console.log("update:",event)
      
      const confL = this.configurationsList.filter( (config : any) => config.endpoint == this.selectedEndpoint )

      let configuration : UserConfiguration

      if (confL.length>0) {
        configuration = this.getUserConfiguration(confL[0])
      } else {
        /* User definition */
        configuration           = new UserConfiguration("defined-by-user")
        configuration.url       = this.selectedEndpoint
        configuration.mimetype  = this.selectedimetype
      }
      
      configuration.strategy = this.selectedStrategy

      this.$emit('updateConfiguration',JSON.stringify(configuration))
    }
  }
  
})

export default class ConfigurationPanel extends Vue {

}

</script>

<style>
</style>
