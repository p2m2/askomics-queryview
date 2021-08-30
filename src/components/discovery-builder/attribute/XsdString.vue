<template>
<div id="askomics-text-box">
<table>
<tr>
    <td>
        <select v-on:blur="updateFilterValue" v-model="attribute.negative">
            <option v-for="option in optionsTypeCompare" v-bind:key="option.value" v-bind:value="option.value">
                {{ option.text }}
            </option>
        </select>
    </td>

    <td>
        <select v-on:blur="updateFilterValue" v-model="attribute.operator">
            <option v-for="option in optionsTypeSearch" v-bind:key="option.value" v-bind:value="option.value">
                {{ option.text }}
            </option>
        </select>
    </td>
   
    <td>
        <input v-on:blur="updateFilterValue" v-model="attribute.filterValue" placeholder="edit me">
    </td>
</tr>
</table>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { AskOmicsViewAttributes, AttributeOperator  } from '@/ts/types';

@Options({

    name: "XsdString",

    emits: ["updateAttribute"],

    props: {
        attribute : {
            type : Object as () => AskOmicsViewAttributes ,
            required: true
            }
    },
    data() { 
        return {
            optionsTypeSearch: [
                { text: 'Contains', value: AttributeOperator.CONTAINS },
                { text: 'Exact', value: AttributeOperator.EQUAL },
           //     { text: 'Regex', value: AttributeOperator.REGEXP },
                { text: 'Starts', value: AttributeOperator.STRSTARTS },
                { text: 'Ends', value: AttributeOperator.STRENDS }
            ],
            optionsTypeCompare: [
                { text: '', value: false },
                { text: 'NOT', value: true }
            ],
        }
    },

    methods: {
        updateFilterValue() {
            if (this.attribute.filterValue && this.attribute.filterValue.length>0)
                this.$emit('updateAttribute',JSON.stringify(this.attribute))
        }
    },
})

export default class XsdString extends Vue {
  attribute!: AskOmicsViewAttributes
}


</script>

<style>

</style>