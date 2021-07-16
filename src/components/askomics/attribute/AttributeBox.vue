<template>

  <div id="my-test-box" class="attribute-box">
    <label class="attr-label">{{ attribute.label }}</label>
    <div className="attr-icons">
        <font-awesome-icon :icon="['fas', 'link']" v-if="attribute.linked" />
        <font-awesome-icon :icon="['fas', 'unlink']" v-else />
        <font-awesome-icon :icon="['fas', 'eye']" v-if="attribute.visible" />
        <font-awesome-icon :icon="['fas', 'eye-slash']" v-else />
        <font-awesome-icon :icon="['fas', 'question-circle']" />
    </div>
    
    <div v-if="attribute.range == 'uri'">
      <URIBox>
      </URIBox>
    </div>
    
    <div v-else-if="attribute.range == 'xsd:string'">
        <XsdString
          v-bind:attribute="attribute"
        ></XsdString>
    </div>
    <div v-else-if="['xsd:numeric','xsd:double','xsd:float','xsd:integer'].includes(attribute.range)">
        <XsdNumeric
          v-bind:attribute="attribute"
        ></XsdNumeric>
    </div>
    <div v-else>
        {{ attribute.range }} is not supported !
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { AttributeSpec } from '@/ts/types';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faEye, faEyeSlash, faLink, faUnlink, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import URIBox from './URIBox.vue'
import XsdString from './XsdString.vue';
import XsdNumeric from './XsdNumeric.vue';

[ faLink, faUnlink, faCircle, faQuestionCircle, faEye, faEyeSlash ].map(icon => library.add(icon)) ;


@Options({
  components : { 
    library,FontAwesomeIcon, XsdString, XsdNumeric,URIBox
    },
  props: { 
      attribute : Object as () => AttributeSpec 
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
})

export default class AttributeBox extends Vue {
  attribute!: AttributeSpec
}

</script>

<style>

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
