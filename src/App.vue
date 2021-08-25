<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
     <div class="container-fluid">
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
          <li class="nav-item">
          <!--  <router-link class="nav-link" aria-current="page" 
            :to="{ path : '/' , props: { configuration : userConfig }}" 
            >AskOmics Query Builder </router-link> -->

            <router-link 
              class="nav-link" 
              aria-current="page"
              :to="{ 
                name : 'askomics' , 
                params: { 
                  query: require('lzbase62').compress(requestManagerStringify) 
                  }
              }"
            >AskOmics Query Builder </router-link>
          </li>
          
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :to="{ 
                name : 'results' , 
                params: { 
                  rm: require('lzbase62').compress(requestManagerStringify) 
                }
              }">Results </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :to="{ 
                name : 'configuration' , 
                params: { 
                  configuration: require('lzbase62').compress(JSON.stringify(configuration)) 
                  }
              }">Configuration </router-link>
          </li>
        </ul>
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
      @updateDiscovery="discovery = $event"
      @updateConfiguration ="updateConfiguration"
  />
    <!--  -->

 <div class="card-footer">
     
     <a href="https://github.com/p2m2/askomics-queryview" target="_blank" >beta-0.0.1</a> 
     <br/>
     <a href="https://p2m2.github.io/discovery/" target="_blank">@p2m2/discovery</a>
 </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { UserConfiguration } from '@/ts/types'

@Options({
  name: "AppView",
  
  data() { 
        return {
          discovery               : "",
          configuration           : null,
          requestManagerStringify : ""
        }
  },
  
  watch: {
    discovery() {
      this.updateRequestManagerStringify()
    }
  },
  
  created() {
    /* If user have a permalink -- management */
    const url_split = window.location.href.split("/query/")
   
    if (url_split.length>1) {
       /* form http://..../query/XXXXXXX */
       
       const r = JSON.parse(require('lzbase62').decompress(url_split[url_split.length-1]))
       this.configuration  = new UserConfiguration("test")
        
      this.configuration.type = "url"
      this.configuration.url  = "https://askomics-metabolights-192-168-100-98.vm.openstack.genouest.org/virtuoso/sparql"
      this.configuration.strategy  = "data-driven" 
       //alert((r[0]))
       //this.configuration = UserConfiguration.build(r[0])
       //this.configuration.strategy = r[1]
       this.discovery = require('lzbase62').decompress(r[2])


    } else {
      this.configuration  = new UserConfiguration("test")
      
      this.configuration.type = "url"
      this.configuration.url  = "https://askomics-metabolights-192-168-100-98.vm.openstack.genouest.org/virtuoso/sparql"
      this.configuration.strategy  = "data-driven" 
      
      /*
      this.configuration.type      = "file"
      this.configuration.url       = "https://raw.githubusercontent.com/p2m2/database-files/master/ttl/Metabolights_studies.ttl"
      this.configuration.mimetype  = "text/turtle"
      this.configuration.strategy  = "data-driven" 
    */
    }

    this.updateRequestManagerStringify()
  },
 
  methods : {
    
    updateConfiguration(configuration : string) {
      this.configuration = UserConfiguration.build(JSON.parse(configuration))
      this.updateRequestManagerStringify()
    },

    updateRequestManagerStringify() {
      this.requestManagerStringify = 
        JSON.stringify([this.configuration.jsonConfigurationSWDiscoveryString(),this.configuration.strategy,this.discovery])
    }


  }
})
export default class App extends Vue {}
</script>

<style>
</style>
