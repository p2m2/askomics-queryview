<template>
  <div id="board">
     <QueryBuilder v-model:config="config" v-model:strategy="strategy" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import QueryBuilder from './askomics/panels/QueryBuilder.vue'

@Options({
  components: {
    QueryBuilder
  },
  
  props : {
    config : String,
    strategy: {
      type: String,
      default : "data-driven"
    }
  },

  data() { 
        return {
        }
  }
})
export default class QueryBoard extends Vue {}
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
