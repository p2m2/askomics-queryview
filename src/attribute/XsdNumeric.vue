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

<script>
export default {
    name: 'XsdNumeric',
    props: { 
        'config' : {
            user : {
                admin : Boolean
            }
        },
        'attribute' : {
            id: Number,
            uri: String,
            range : String,
            label: String,
            visible: Boolean,
            negative: Boolean,
            linked: Boolean,
        } 
    },
    methods: {
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
}
</script>

<style lang="scss">

</style>