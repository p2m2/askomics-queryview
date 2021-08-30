<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
     <div class="container-fluid">
      
      <div class="collapse navbar-collapse">
       
          <div class="btn-group" role="group" aria-label="tools graph">
              <button type="button" class="form-control btn btn-primary" 
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="SPARQL Endpoint/RDF Files/ Query Builder Confiuration."
              @click="configuration">
                 <font-awesome-icon icon="sliders-h" />  
              </button>

              <button type="button" class="form-control btn btn-primary" 
              @click="back" 
              data-toggle="tooltip" 
              data-placement="bottom"
              title="Undo last action, go back."
              v-if="backwardActive">
                <font-awesome-icon icon="backward" />  
              </button>
              <button type="button" class="form-control btn btn-primary disabled" 
              data-toggle="tooltip" 
              data-placement="bottom"
              title="Undo last action, go back."
              v-else disabled>
                 <font-awesome-icon icon="backward" />  
              </button>

              <button type="button" class="form-control btn btn-primary" 
              @click="forward" 
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="Retrieve the canceled action, go forward."
              v-if="forwardActive">
                 <font-awesome-icon icon="forward" />  
              </button>
              <button type="button" class="form-control btn btn-primary disabled"  
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="Retrieve the canceled action, go forward."
              v-else disabled>
                 <font-awesome-icon icon="forward" />  
              </button>

              <button type="button" class="form-control btn btn-primary" 
              @click="builder"
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="Build the query."
              >

                 <font-awesome-icon icon="project-diagram" />  
              </button>

              <button type="button" class="form-control btn btn-primary" 
              @click="getResults"
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="Display the query results."
              >
                <font-awesome-icon icon="poll" />  
              </button> 
              
              <button type="button" class="form-control btn btn-info" 
              @click="console"
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="Information about the current query (discovery internal state)."
              >
                <font-awesome-icon icon="terminal" />
              </button>

              <button type="button" class="form-control btn btn-success" 
              @click="copyPermalinkQueryBuilderToClipBoard"
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="Copy a permalink to save the current query."
              >
                <font-awesome-icon icon="clipboard-list" />
              </button>

              <button type="button" class="form-control btn btn-danger" @click="clear"
              data-toggle="tooltip" 
              data-placement="bottom" 
              title="Delete the current request and start a new session."
              >Clear</button>
            </div>

         
        <!--
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      -->
      </div>
    </div>
  </nav>

  <!-- Extraneous non-emits event listeners  -->

  <router-view 
      @updateRequestManager="requestManagerStringify = $event"
  />
    <!--  -->

 <div class="card-footer">
     
     <a href="https://github.com/p2m2/askomics-queryview" target="_blank" >beta-0.0.3</a> 
     <br/>
     <a href="https://p2m2.github.io/discovery/" target="_blank">@p2m2/discovery</a>
 </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { UserConfiguration } from '@/ts/types'

import router from '@/router/index';

import RequestManager from './ts/RequestManager';


import { library } from '@fortawesome/fontawesome-svg-core';
import { faBackward, faForward, faSpinner, 
          faClipboard, faClipboardList, faPoll, 
          faTerminal, faSlidersH, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

[ faBackward, faForward, faSpinner, faClipboard, faClipboardList, faPoll, faTerminal, faSlidersH, faProjectDiagram ].map(icon => library.add(icon)) ;

@Options({
  name: "AppView",

  components : {  
      library,FontAwesomeIcon
    },

  data() { 
        return {
          requestManagerStringify : "",
          forwardActive      : false,
          backwardActive     : false
        }
  },

  created() {
    /* If user have a permalink -- management */
    let uri = window.location.search
    let params = new URLSearchParams(uri);

    if (params.has("hash")) {
       /* form http://..../query/XXXXXXX */
      const compress_data = params.get("hash")
      this.requestManagerStringify = require('lzbase62').decompress(compress_data)      
      this.builder()

    } else {
      this.setDefaultStartRequestManager()
      this.configuration()
    }
    
  },

  watch: {
     requestManagerStringify() {
       this.updateHistoryButton()
     }
  },
 
  methods : {

    setDefaultStartRequestManager() {
      let configuration  = new UserConfiguration("default_rdf_source")
      
      configuration.mimetype = "application/sparql-query"
      configuration.url      = "https://askomics-metabolights-192-168-100-98.vm.openstack.genouest.org/virtuoso/sparql"
      configuration.strategy = "data-driven" 
      
      /*
      this.configuration.type      = "file"
      this.configuration.url       = "https://raw.githubusercontent.com/p2m2/database-files/master/ttl/Metabolights_studies.ttl"
      this.configuration.mimetype  = "text/turtle"
      this.configuration.strategy  = "data-driven" 
    */
      this.requestManagerStringify = RequestManager.getDefault(configuration,this).serialized()
    },
    
    updateRequestManagerStringify(value : string) {
      this.requestManagerStringify = value
      router.replace({ params: { rm: require('lzbase62').compress(this.requestManagerStringify) }})
    },
    
    updateHistoryButton() {
      this.forwardActive  = RequestManager.forwardIsActive()
      this.backwardActive = RequestManager.backwardIsActive()
    },

    back() {
      this.updateRequestManagerStringify(RequestManager.backward())
      this.updateHistoryButton()
      this.$toast.info("backward"); 
    } ,

    forward() {
      this.updateRequestManagerStringify(RequestManager.forward())
      this.updateHistoryButton()
      this.$toast.info("forward"); 
    },

     /* https://router.vuejs.org/guide/essentials/navigation.html*/
     
    builder() {
      router.push({ name : 'builder' , params: { rm: require('lzbase62').compress(this.requestManagerStringify) }})
    },

    getResults() {
      router.push({ name : 'results' , params: { rm: require('lzbase62').compress(this.requestManagerStringify) }})
    } ,

    console() {
      router.push({ name : 'console' , params: { rm: require('lzbase62').compress(this.requestManagerStringify) }})
    },

    configuration() {
      router.push({ name : 'configuration' , params: { rm: require('lzbase62').compress(this.requestManagerStringify) }})
    },

    copyPermalinkQueryBuilderToClipBoard() {
        const compressed = require('lzbase62').compress(this.requestManagerStringify);
        const url = document.location.origin+process.env.BASE_URL+"?hash="+compressed
        const vue = this
        navigator.clipboard.writeText(url).then(function() {
            /* clipboard successfully set */
            vue.$toast.success("query builder url to clipboard !"); 
          }, function(e:Event) {
            /* clipboard write failed */
            vue.$toast.error("query builder url to clipboard failed !"); 
             console.error(e)
          });
    },

    clear() {
      let r = new RequestManager(this.requestManagerStringify,this)
      r.clear()
      this.updateRequestManagerStringify(r.serialized())
      this.$toast.info("clear session !"); 
    }
  }

})
export default class App extends Vue {}
</script>

<style>
</style>
