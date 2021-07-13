<template>
    <QueryBuilder v-model:query="query" @updateQuery="updateQuery" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import QueryBuilder from '@/components/askomics/panels/QueryBuilder.vue'

@Options({
  name: "AskOmicsView",
  components: {
    QueryBuilder 
  },
  emits: ["updateQuery"],
 
  computed: {
    query() {
      return this.$route.params.query
    }
  },

  created() {
    console.log("AskOmicsView CREATED !!!!!!!!!!!!!!!!!!")
    console.log(JSON.stringify(this.query))
  },
  
  mounted() {
      console.log("AskOmicsView MOUNTED..............")
      console.log(JSON.stringify(this.query))
      console.log(this.query)
  },
  methods : {
    updateQuery(query : string) {
      this.$emit('updateQuery',query)
     // alert("SEND:"+query)
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