<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
     <div class="container-fluid">
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
          <li class="nav-item">
          <!--  <router-link class="nav-link" aria-current="page" 
            :to="{ path : '/' , props: { configuration : userConfig }}" 
            >AskOmics Query Builder </router-link> -->

            <router-link class="nav-link" aria-current="page"
            :to="{ name : 'askomics' , params: { query: requestManagerStringify }}" 
            >AskOmics Query Builder </router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/results">Results </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name : 'configuration' , params: { strategy: strategy }}">Configuration </router-link>
          </li>
        </ul>
        
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      
      </div>
    </div>
  </nav>

  <!-- Extraneous non-emits event listeners  -->

  <router-view 
      @updateDiscovery="discovery = $event"
      @updateConfigurationFile="configurationFile = $event"
      @updateStrategy="strategy = $event"
  />

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: "AppView",
  
  data() { 
        return {
          discovery : "",
          configurationFile : `{ "sources" : [{ "id"  : "test", "url" : "https://openstack-192-168-101-49.vm.openstack.genouest.org/sparql/" }]}`,
          strategy : "data-driven",
          requestManagerStringify : ""
        }
  },
  
  watch: {
    
    strategy : function() {
      console.log("OK Strategy")
      console.log(this.discovery)
      this.requestManagerStringify = JSON.stringify([this.configurationFile,this.strategy,this.discovery])
    },

    configurationFile : function() {
      alert("OK configurationFile")
      this.requestManagerStringify = JSON.stringify([this.configurationFile,this.strategy,this.discovery])
    }

  },

  created() {
    this.requestManagerStringify = JSON.stringify([this.configurationFile,this.strategy,this.discovery])
  },
 
  methods : {
  }
})
export default class App extends Vue {}
</script>

<style>
</style>
