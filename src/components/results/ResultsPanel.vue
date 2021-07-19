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
/*
columns : [
                {
                    label: "ID",
                    field: "id",
                    width: "3%",
                    sortable: true,
                    isKey: true
                },{
                    label: "Name",
                    field: "name",
                    width: "10%",
                    sortable: true,
                    display(row : any) {
                        return (
                        '<a href="#" data-id="' + row.user_id + '" class="is-rows-el name-btn">' + row.name + "</button>"
                        );
                    }
                },
                {
                    label: "Email",
                    field: "email",
                    width: "15%",
                    sortable: true,
                },
                {
                    label: "",
                    field: "quick",
                    width: "10%",
                    display(row : any) {
                        return (
                        '<button type="button" data-id="' + row.user_id + '" class="is-rows-el quick-btn">Button</button>'
                        );
                    }
                }],
            rows : [
                 {
                    id: 1,
                    name: "TEST1"
                    },
                    {
                    id: 2,
                    name: "TEST2"
                    }], */
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
            const columns = new RequestManager(this.rm).getColumnsResults() 
            this.resultsPage(0)

            return columns
        }
    },

    methods: {

        resultsPage(indexLazyPage : number, numberOfResults : number) {
            console.log("resultsPage ==================================>>>>>>>>>>>>>>"+indexLazyPage)
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
                            //console.log(JSON.stringify(response,null,2));
                            this.rows = []
                            
                            for (let i=0;i<response.results.bindings.length;i++) {
                                this.columns.forEach((col : any) => {
                                    let row : any = {};
                                    console.log(col)
                                    row['id'] = (indexLazyPage*10)+i
                                    row[col.field] = response.results.bindings[i][col.field].value
                                    console.log(JSON.stringify(row))
                                    this.rows.push( row) ;
                                })
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

//            if (order)
//                this.sortable.order = order;
//            if (sort)
//                this.sortable.sort = sort;
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