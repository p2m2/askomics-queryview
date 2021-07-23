<template>
<div id="askomics-text-box">
<table>
<tr>
    <td>
        <select v-model="operator">
            <option v-for="option in optionsOprator" v-bind:key="option.value" v-bind:value="option.value">
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
import { AskOmicsViewAttributes } from 'src/ts/types'

@Options({
    props: { 
        attribute : Object as () => AskOmicsViewAttributes 
    },
    
    methods : {
    
    },

    data() { 
        return {
            operator: '=',
            optionsOprator: [
                { text: '=', value: '=' },
                { text: '<', value: '<' },
                { text: '>', value: '>' },
                { text: '>=', value: '>=' },
                { text: '!=', value: '!=' }
            ],
            filterValue: '',
        }
    }
})

export default class XsdNumeric extends Vue {
  attribute!: AskOmicsViewAttributes
}

</script>

<style>

</style>