<template>
  <div id="app">
    <MainPanel :config="config" :strategy="strategy" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MainPanel from '@/components/MainPanel.vue'

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
export default class AskOmics extends Vue {}
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