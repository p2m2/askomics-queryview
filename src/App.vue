<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
     <div class="container-fluid">
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
          <li class="nav-item">
          <!--  <router-link class="nav-link" aria-current="page" 
            :to="{ path : '/' , props: { configuration : userConfig }}" 
            >AskOmics Query Builder </router-link> -->

            <router-link class="nav-link" aria-current="page" @update="test"
            :to="{ name : 'askomics' , params: { query: requestManagerStringify }}" 
            >AskOmics Query Builder </router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/results">Results </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/configuration">Configuration </router-link>
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
      @update="updateStringify"
  />

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: "AppView",
  
  data() { 
        return {
          requestManagerStringify : JSON.stringify([
            `{
              "sources" : [{
              "id"  : "test",
              "url" : "https://openstack-192-168-101-49.vm.openstack.genouest.org/sparql/"
              }]}`,
            "data-driven",
            ""]),
        }
  },
  created() {
    console.log(" -- APP created ---")
    console.log(this.requestManagerStringify)
  },
  mounted() {
    console.log(" -- APP --- ")
    console.log(this.requestManagerStringify)
  },

  watch : {
    requestManagerStringify: 'updateRequestManagerStringify',
  },

  methods : {
    updateStringify(value : string) {
      this.requestManagerStringify = value
    },
  }
})
export default class App extends Vue {}
</script>

<style>
</style>
