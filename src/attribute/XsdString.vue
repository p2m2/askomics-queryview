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

<script>
export default {
    name: 'XsdString',
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
            typeSearch: 'A',
            optionsTypeSearch: [
                { text: 'Exact', value: 'A' },
                { text: 'Regex', value: 'B' }
            ],
            typeCompare: 'A',
            optionsTypeCompare: [
                { text: '=', value: 'A' },
                { text: '!=', value: 'B' }
            ],
            filterValue: '',
        }
    }
}
</script>

<style lang="scss">

</style>