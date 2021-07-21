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

  emits: ["updateDiscovery"],
 
  computed: {
    query() {
      return this.$route.params.query
    }
  },

  methods : {
    updateQuery(config_strategy_query : string) {
      const r = JSON.parse(config_strategy_query)
      this.$emit('updateDiscovery',r[2])
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