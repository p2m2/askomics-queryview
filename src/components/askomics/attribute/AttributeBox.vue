<template>

  <div :id="attributeInt.id" class="attribute-box">
    <label class="attr-label">{{ attributeInt.label }}</label>
    <div className="attr-icons">
        <font-awesome-icon @click="closeLink" :icon="['fas', 'link']" v-if="attributeInt.linked" />
        <font-awesome-icon @click="openLink" :icon="['fas', 'unlink']" v-else />
        <font-awesome-icon @click="closeEye" :icon="['fas', 'eye']" v-if="attributeInt.visible" />
        <font-awesome-icon @click="openEye" :icon="['fas', 'eye-slash']" v-else />
       <!-- <font-awesome-icon :icon="['fas', 'question-circle']" /> -->
    </div>
    
    <div v-if="attributeInt.range == 'uri'">
      <URIBox>
      </URIBox>
    </div>
    
    <div v-else-if="attributeInt.range == 'xsd:string'">
        <XsdString
          v-bind:attribute="attributeInt"
        ></XsdString>
    </div>
    <div v-else-if="['xsd:numeric','xsd:double','xsd:float','xsd:integer'].includes(attributeInt.range)">
        <XsdNumeric
          v-bind:attribute="attributeInt"
        ></XsdNumeric>
    </div>
    <div v-else>
        {{ attributeInt.range }} is not supported !
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
  
  emits: ["updateAttribute"],

  props: { 
      attribute : {
        type : Object as () => AttributeSpec, 
        required: true
      }
  },

  methods: {
      toggleLinkAttribute: () => { console.log( "click 1 !") },
      
      openEye(){ 
        this.attributeInt.visible = true
        this.$emit('updateAttribute',JSON.stringify(this.attributeInt))
      },
      
      closeEye() {
        this.attributeInt.visible = false
        this.$emit('updateAttribute',JSON.stringify(this.attributeInt))
      },

      openLink() {
        this.attributeInt.linked = true
        this.$emit('updateAttribute',JSON.stringify(this.attributeInt))
      },

      closeLink() {
        this.attributeInt.linked = false
        this.$emit('updateAttribute',JSON.stringify(this.attributeInt))
      },

      toggleOptional: () => { console.log( "click 3 !") }
  },
  data () {
    return {
      attributeInt : this.attribute
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
