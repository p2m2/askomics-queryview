<template>
  <nav class="navbar navbar-expand-lg navbar-light">
     <div class="container-fluid">
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/askomics">AskOmics Query Builder </router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/results">Results </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/configuration">Configuration </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/about">About </router-link>
          </li>
        </ul>
        
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      
      </div>
    </div>
  </nav>
  <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';


@Options({
  data() { 
        return {
          config:  `
          {
          "sources" : [{
          "id"  : "metabolights",
          "url" : "https://metabolights.semantic-metabolomics.fr/sparql"
           }]}
          `,
          config_local: ` 
           {
          "sources" : [{
          "id"  : "local",
          "url" : "http://localhost:8890/sparql"
           }]}`,

          strategy : "data-driven"
        }
  },
  methods : {
  }
})
export default class App extends Vue {}
</script>

<style>
</style>
