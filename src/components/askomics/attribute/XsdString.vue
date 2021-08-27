<template>
<div id="askomics-text-box">
<table>
<tr>
    <td>
        <select v-model="typeSearch">
            <option v-for="option in optionsTypeSearch" v-bind:key="option.value" v-bind:value="option.value">
                {{ option.text }}
            </option>
        </select>
    </td>
    <td>
        <select v-model="typeCompare">
            <option v-for="option in optionsTypeCompare" v-bind:key="option.value" v-bind:value="option.value">
                {{ option.text }}
            </option>
        </select>
    </td>
    <td>
        <input v-model="filterValue" placeholder="edit me">
    </td>
</tr>
</table>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { AskOmicsViewAttributes } from 'src/ts/types';

@Options({

    emits: ["updateAttribute"],

    props: {
        attributeInt : {
            type : Object as () => AskOmicsViewAttributes ,
            required: true
            }
    },

    data() { 
        return {
            attribute : this.attributeInt,
            typeSearch: 'contains',
            optionsTypeSearch: [
                { text: 'Contains', value: 'contains' },
                { text: 'Exact', value: 'equal' },
                { text: 'Regex', value: 'regex' },
                { text: 'Starts', value: 'strStarts' },
                { text: 'Ends', value: 'strEnds' }
            ],
            typeCompare: 'false',
            optionsTypeCompare: [
                { text: '=', value: 'false' },
                { text: '!=', value: 'true' }
            ],
            filterValue: '',
        }
    },

    mounted() {
        this.attribute = this.attributeInt
    },
    
    methods: {
        update() {
            this.attribute.filterValue = this.filterValue
            this.attribute.typeSearch  = this.typeSearch
            this.attribute.negative = this.typeCompare == "true"
        }
    },

    
    watch : {

        filterValue() {
            this.update()
            this.$emit('updateAttribute',JSON.stringify(this.attribute))
        }
    }
})

export default class XsdString extends Vue {
  attribute!: AskOmicsViewAttributes
}


</script>

<style>

</style>