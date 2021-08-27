<template>
  <div id="console-panel">
      <div class="container"> 
        <pre class="code"> {{ console }} </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RequestManager from '@/ts/RequestManager'

@Options({
  name: "Console",
  
  components: { 
  },

  emits: ["updateDiscovery"],
 
  data () {
    return {
    }
  },

  computed: {
    console() {
        var old = console.log;
        let innerHTML = ""

        console.log = function (message) {
          
          let m = message
          /* remove color . @todo : create a console with color */
          for (let i=0;i<=47;i++) 
            m = m.replace("\x1b["+i+"m","")

          innerHTML += m  + '\n';
        }

        let currentQuery = require('lzbase62').decompress(this.$route.params.rm)

        

        new RequestManager(currentQuery,this).getDiscovery().console()
        console.log = old
        return innerHTML
    }
  }
})
export default class Console extends Vue {}
</script>

<style lang="css">
pre.code {
        font-family: Consolas, Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, sans-serif;
        background-color: #eee;
        text-align: left;
        overflow: auto;
        font-size: 13px;
        padding: 5px;
        width: 1250px ;
        padding-bottom: 20px ;
        max-height: 600px;
        margin-bottom: 1em;
        display: block;
        color: #393318;
        white-space: pre;
}

</style>