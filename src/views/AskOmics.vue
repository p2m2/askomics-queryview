<template>
    <QueryBuilder v-model:query="query" @updateRequestManager="updateQuery" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import QueryBuilder from '@/components/askomics/panels/QueryBuilder.vue'

@Options({
  name: "AskOmics",
  
  components: {
    QueryBuilder 
  },

  emits: ["updateRequestManager"],
 
  computed: {
    query() {
      return require('lzbase62').decompress(this.$route.params.rm)
    }
  },

  methods : {
    updateQuery(requestManagerString : string) {
      this.$emit('updateRequestManager',requestManagerString)
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