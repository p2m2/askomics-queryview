<template>
<div id="askomics-text-box">
<table>
<tr>
    <td>
        <select v-on:blur="updateFilterValue" v-model="attribute.operator">
            <option v-for="option in optionsOprator" v-bind:key="option.value" v-bind:value="option.value">
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

    name: "XsdNumeric",

    emits: ["updateAttribute"],

    props: { 
        attribute : Object as () => AskOmicsViewAttributes 
    },
    
    data() { 
        return {
            optionsOprator: [
                { text: '=', value: AttributeOperator.EQUAL },
                { text: '<', value: AttributeOperator.INF },
                { text: '<=', value: AttributeOperator.INFEQUAL },
                { text: '>', value: AttributeOperator.SUP },
                { text: '>=', value: AttributeOperator.SUPEQUAL },
                { text: '!=', value: AttributeOperator.NOTEQUAL }
            ],
            filterValue: '',
        }
    },

    methods: {
        updateFilterValue() {
            if (this.attribute.filterValue && this.attribute.filterValue.length>0)
                this.$emit('updateAttribute',JSON.stringify(this.attribute))
        }
    },
})

export default class XsdNumeric extends Vue {
  attribute!: AskOmicsViewAttributes
}

</script>

<style>

</style>