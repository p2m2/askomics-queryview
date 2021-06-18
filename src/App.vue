<template>
  <div id="app">
    {{ msg }}
      <MainPanel/>
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
          msg: 'Welcome to Your Vue.js App'
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
