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
            <router-link class="nav-link" :to="{ name : 'configuration' , params: { configuration: JSON.stringify(configuration) }}">Configuration </router-link>
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
      @updateConfiguration ="updateConfiguration"
  />
    <!--  -->

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { UserConfiguration } from '@/ts/types'

@Options({
  name: "AppView",
  
  data() { 
        return {
          discovery               : "",
          configuration           : new UserConfiguration("test") ,//`{ "sources" : [{ "id"  : "test", "url" : "https://openstack-192-168-101-49.vm.openstack.genouest.org/sparql/" }]}`,
          requestManagerStringify : ""
        }
  },
  
  watch: {
  },
  
  created() {
    this.configuration  = new UserConfiguration("test")
    this.configuration.type = "url"
    this.configuration.url  = "https://openstack-192-168-101-49.vm.openstack.genouest.org/sparql/"
    this.requestManagerStringify = JSON.stringify([this.configuration.jsonConfigurationSWDiscoveryString(),this.configuration.strategy,this.discovery])
  },
 
  methods : {
    updateConfiguration(configuration : string) {
      this.configuration = UserConfiguration.build(JSON.parse(configuration))
      this.requestManagerStringify = JSON.stringify([this.configuration.jsonConfigurationSWDiscoveryString(),this.configuration.strategy,this.discovery])
    }
  }
})
export default class App extends Vue {}
</script>

<style>
</style>
