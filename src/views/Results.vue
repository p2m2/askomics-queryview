<template>
  <ResultsPanel :rm="rm" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ResultsPanel from '@/components/results/ResultsPanel'

@Options({
  name: "ResultsView",
  components: {
    ResultsPanel
  },

  data() { 
        return {
        }
  },
  
  computed: {
    rm() {
      return this.$route.params.rm
    }
  },

  methods : {
  }
})
export default class Results extends Vue {}
</script>