<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
     <div class="container-fluid">
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
          <li class="nav-item">
          <!--  <router-link class="nav-link" aria-current="page" 
            :to="{ path : '/' , props: { configuration : userConfig }}" 
            >AskOmics Query Builder </router-link> -->

            <router-link class="nav-link" aria-current="page" 
            :to="{ name : 'askomics' , params: { configuration: userConfig , query: queryString}}" 
            >AskOmics Query Builder </router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/results">Results </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/configuration">Configuration </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/about">About </router-link>
          </li>
        </ul>
        
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      
      </div>
    </div>
  </nav>

  <!-- Extraneous non-emits event listeners  -->

  <router-view 
      @updateConfigurationEvent="userConfig = $event" 
      @updateQuery="queryString = $event" 
  />

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: "AppView",
  data() { 
        return {
          userConfig : "",
          queryString : ""
        }
  },
  
  watch : {
    userConfig: 'updateConfiguration',
    queryString: 'updateQueryString',
  },

  methods : {
    updateConfiguration(s: string) {
      console.log(" UPPPPPPPPPPPP UserConfiguration )))))))))))))))))))))")
      console.log(s)
    },
    updateQueryString(s: string) {
      console.log(" UPPPPPPPPPPPP QUERY STRING )))))))))))))))))))))")
      console.log(s)
    }
  }
})
export default class App extends Vue {}
</script>

<style>
</style>
