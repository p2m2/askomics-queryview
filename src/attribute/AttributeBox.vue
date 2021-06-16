<template>

  <div id="my-test-box" class="attribute-box">
    <label class="attr-label">{{ attribute.label }}</label>
    <div className="attr-icons">
        <font-awesome-icon :icon="['fas', 'link']" />
        <font-awesome-icon :icon="['fas', 'eye']" />
        <font-awesome-icon :icon="['fas', 'question-circle']" />
    </div>
    <div v-if="attribute.range == 'xsd:string'">
        <XsdString
          v-bind:config="config"
          v-bind:attribute="attribute"
        ></XsdString>
    </div>
    <div v-else-if="['xsd:numeric','xsd:double','xsd:float','xsd:integer'].includes(attribute.range)">
        <XsdNumeric
          v-bind:config="config"
          v-bind:attribute="attribute"
        ></XsdNumeric>
    </div>
    <div v-else>
        {{ attribute.range }} is not supported !
    </div>
</div>
</template>

<script>

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faEye, faLink, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import XsdString from './XsdString.vue'
import XsdNumeric from './XsdNumeric.vue'

[ faLink, faCircle, faQuestionCircle, faEye ].map(icon => library.add(icon)) ;


export default {
  name: 'attributeBox',
  components : { library,FontAwesomeIcon, XsdString, XsdNumeric },
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
      toggleLinkAttribute: () => { console.log( "click 1 !") },
      toggleVisibility: () => { console.log( "click 2 !") },
      toggleOptional: () => { console.log( "click 3 !") }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">

div.attribute-box {
  margin: 5px;
  padding: 5px;
  border-radius: 10px;

  border: 1px solid #c5c5c5;
  background: #f6f6f6;
  font-weight: normal;
  color: #454545;
}

label.attr-label {
  font-weight: 700;
}

div.attr-icons {
  float: right;
}
i.attr-icon {
  padding-right: 8px;
  cursor: pointer;
}
</style>
