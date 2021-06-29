<template>
  <div id="app">
     <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="#">Query<span class="sr-only">(current)</span></a>
                
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
              </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
    </nav>
    <MainPanel :config="config" :strategy="strategy" />
      
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MainPanel from './components/panels/MainPanel.vue'

@Options({
  components: {
    MainPanel
  },
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
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
