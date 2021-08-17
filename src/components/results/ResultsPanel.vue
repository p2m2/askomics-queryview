<template>
<div id="results-panel">
    <vue-table-lite 
                    :is-static-mode="isStaticMode"
                    :has-checkbox="hasCheckbox"
                    :is-loading="isLoading" 
                    :is-re-search="isReSearch" 
                    :columns="columns" 
                    :rows="rows" 
                    :total="totalRecordCount" 
                    :sortable="isSortable" 
                    :messages="messages" 
                    @do-search="doSearch" 
                    @is-finished="tableLoadingFinish" 
                    @return-checked-row="updateCheckedRows" />

</div>
</template>

<script lang="ts">
import RequestManager from '@/ts/RequestManager';
import { Options, Vue } from 'vue-class-component';
import VueTableLite from 'vue3-table-lite'

@Options({
    name: "ResultsPanel",
    
    components : { VueTableLite },

    props: {
        rm : {
                type: String,
                required: false
        },
        
        isStaticMode : {
                type: Boolean,
                required: false,
                default: true
        },

        hasCheckbox : {
                type: Boolean,
                required: false,
                default: false
        },

        isSortable : {
                type: Object,
                required: false,
                default: {
                    order : "id",
                    sort : "asc"
                }
        },
    },

    data() { 
        return {
            laziestPages : [],
            rows : [],
            totalRecordCount : 2 ,

            messages : {
                    pagingInfo : "Showing {0}-{1} of {2}",
                    pageSizeChangeLabel: "Row count:",
                    gotoPageLabel: "Go to page:",
                    noDataAvailable: "No data",
                },
                    
            isLoading : false,
            isReSearch : false,
            isSortable : {
                    order : "id",
                    sort : "asc"
            },
        }
    },

    computed: {
        columns() {
            //const columns = 
            //this.resultsPage(0)
            return new RequestManager(this.rm).getColumnsResults() 
        }
    },

    mounted() {
        this.resultsPage(0)
    },

    methods: {

        resultsPage(indexLazyPage : number, numberOfResults : number) {
          if (this.columns.length == 0 ) {
                this.rows = []
          } 
          else 
            new RequestManager(this.rm).getCountAndLaziesPages(numberOfResults)
            .then( 
                (args : any) => {
                    
                    this.totalRecordCount = Object.values(args)[0] ;
                    
                    const laziestPages = Object.values(args)[1] as Array<any>;
                    
                    if (this.totalRecordCount>0 && laziestPages.length>0) {
                        
                        laziestPages[indexLazyPage]
                            .commit()
                            .raw()
                            .then( (response : any) => { 
                           // console.log(JSON.stringify(response,null,2));
                            this.rows = []
                            let URIinstance : Map<String,String> = new Map()
                            for (let i=0;i<response.results.bindings.length;i++) {
                                let row : any = {};
                                row['id'] = (indexLazyPage*10)+i
                                
                                const tabURI = [...new Set(this.columns
                                    .filter( (col : any) => col.node_id ).map( (col : any) => col.node_id))]
                                
                                tabURI.forEach((uri : any ) => {   
                                    /* value of instance only */
                                    URIinstance.set(uri,response.results.bindings[i][uri].value)
                                })

                                this.columns.forEach((col : any) => {              
                                    /* datatype only */
                                    if ( col.field != col.node_id) {
                                        let val ="<undefined>"

                                        const uriInstance : string = URIinstance.get(col.node_id) as string
                                        if (col.field === "uri" ) {
                                            val = uriInstance
                                        } else {
                                            console.log(JSON.stringify(response.results.datatypes[col.field][uriInstance]))
                                            if (response.results.datatypes[col.field] && response.results.datatypes[col.field][uriInstance]) {
                                                if (response.results.datatypes[col.field][uriInstance].length>0)
                                                    val = response.results.datatypes[col.field][uriInstance][0].value; 
                                            }
                                        }
                                        
                                        row[col.field] = val
                                    }
                                    
                                })
                                this.rows.push(row) ;
                            } 
                        })
                }})
        },
        
        doSearch(offset : number, limit : number, order : string, sort : string) {
            console.log("doSearch")
            console.log(offset,limit,order,sort)

            this.isLoading = true

            if (offset)
                this.isReSearch = true 
            else 
                this.isReSearch = false
            //console.log(offset)
            
            this.resultsPage(Math.floor(offset/10),limit)
            try {
                if (order) this.sortable.order = order;
            } catch (err) {
                console.warn(err)
            }

            try {
                if (sort) this.sortable.sort = sort;
            } catch (err) {
                console.warn(err)
            }
        },

        tableLoadingFinish() {
            console.log("tableLoadingFinish")
            //alert("DO tableLoadingFinish")
            this.isLoading = false;
        },

        updateCheckedRows() {
            console.log("updateCheckedRows")
        }        

    }
})

export default class ResultsPanel extends Vue {

}


</script>

<style>

</style>