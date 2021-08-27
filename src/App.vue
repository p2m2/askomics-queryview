<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
     <div class="container-fluid">
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              aria-current="page"
              :to="{ 
                name : 'askomics' , 
                params: { 
                  rm: require('lzbase62').compress(requestManagerStringify) 
                  }
              }"
            >Query Builder</router-link>
          </li>
          
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :to="{ 
                name : 'results' , 
                params: { 
                  rm: require('lzbase62').compress(requestManagerStringify) 
                }
              }">Results</router-link>
          </li>

           <li class="nav-item">
            <router-link 
              class="nav-link" 
              :to="{ 
                name : 'console' , 
                params: { 
                    rm: require('lzbase62').compress(requestManagerStringify) 
                  }
              }">Console</router-link>
          </li>

          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :to="{ 
                name : 'configuration' , 
                params: { 
                  rm: require('lzbase62').compress(requestManagerStringify) 
                }
              }">Configuration</router-link>
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
      @updateRequestManager="requestManagerStringify = $event"
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
import router from '@/router/index';
import RequestManager from './ts/RequestManager';

@Options({
  name: "AppView",
  
  data() { 
        return {
          requestManagerStringify : ""
        }
  },
  
  created() {
    /* If user have a permalink -- management */
    const url_split = window.location.href.split("/query/")
   
    if (url_split.length>1) {
       /* form http://..../query/XXXXXXX */
      const compress_data = url_split[url_split.length-1]
      this.requestManagerStringify = require('lzbase62').decompress(compress_data)      

      router.push({ name : 'askomics' , params: { query: compress_data }})

    } else {
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
    }

    
  },
 
  methods : {
  }
  
})
export default class App extends Vue {}
</script>

<style>
</style>
