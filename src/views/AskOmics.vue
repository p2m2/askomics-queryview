<template>
{{ userConfig }}
    <QueryBuilder :userConfig="userConfig" :query="query" @updateQuery="updateQuery" />
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
  props : {
    configuration : {
      type : String,
      default : () => "{}"
    },
    query : {
      type : String,
      default : () => ""
    }
  },

  data() {
    return {
      userConfig : ""
    }
  },
  mounted() {
    if ( this.configuration && this.configuration.length>0) {
      this.userConfig = JSON.parse(this.configuration)
    }
    //if (this.query && this.query.length>0) {
        //alert("MOUNTED:"+this.query)
    //}
    
  },
  methods : {
    updateQuery(query : string) {
      this.$emit('updateQuery',query)
      //alert("SEND:"+query)
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