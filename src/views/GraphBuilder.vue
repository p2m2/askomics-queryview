<template>
    <QueryBuilderPanel v-model:requestString="requestString" @updateRequestManager="updateRequestString" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import QueryBuilderPanel from '@/components/askomics/panels/QueryBuilderPanel.vue'

@Options({
  name: "GraphBuilder",
  
  props : {
    rm :  String
  },

  components: {
    QueryBuilderPanel 
  },

  emits: ["updateRequestManager"],
 
  computed: {
    requestString() {
      return require('lzbase62').decompress(this.$route.params.rm)
    }
  },

  methods : {
    updateRequestString(requestManagerString : string) {
      this.$emit('updateRequestManager',requestManagerString)
    }
  }

})
export default class GraphBuilder extends Vue {}
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