<template>
<div id="results-panel">

    {{ 
        requestManager.serialized()
    }}
</div>
</template>

<script lang="ts">
import RequestManager from '@/ts/RequestManager';
import { Options, Vue } from 'vue-class-component';

@Options({
    name: "ResultsPanel",

    props: {
        rm : String
    },

    methods: {
    },

    data() { 
        return {
           
        }
    },

    computed: {
        requestManager() {
            return new RequestManager(this.rm)
        }
    },
})

export default class ResultsPanel extends Vue {

}


</script>

<style>

</style>