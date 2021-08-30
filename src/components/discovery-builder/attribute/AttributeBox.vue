<template>

  <div :id="attribute.id" class="attribute-box">
    <label class="attr-label">{{ attribute.label }}</label>
    <div className="attr-icons">
        <font-awesome-icon @click="erase" :icon="['fas', 'eraser']" />
        <!-- <font-awesome-icon @click="closeLink" :icon="['fas', 'link']" v-if="attribute.linked" />
        <font-awesome-icon @click="openLink" :icon="['fas', 'unlink']" v-else /> -->

        <font-awesome-icon @click="closeEye" :icon="['fas', 'eye']" v-if="attribute.visible" />
        <font-awesome-icon @click="openEye" :icon="['fas', 'eye-slash']" v-else />
       <!-- <font-awesome-icon :icon="['fas', 'question-circle']" /> -->
    </div>
    
    <div v-if="attribute.range == 'uri'">
      <URIBox
        v-bind:attribute="attribute"
        @updateAttribute="$emit('updateAttribute',$event)"
      >
      </URIBox>
    </div>
    
    <div v-else-if="attribute.range == 'xsd:string'">
        <XsdString
          v-model:attribute="attribute"
          @updateAttribute="$emit('updateAttribute',$event)"
        ></XsdString>
    </div>
    <div v-else-if="['xsd:numeric','xsd:double','xsd:float','xsd:integer'].includes(attribute.range)">
        <XsdNumeric
          v-bind:attribute="attribute"
           @updateAttribute="$emit('updateAttribute',$event)"
        ></XsdNumeric>
    </div>
    <div v-else>
        {{ attribute.range }} is not supported !
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { AskOmicsViewAttributes } from '@/ts/types';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faEye, faEyeSlash, faLink, faUnlink, faQuestionCircle, faEraser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import URIBox from './URIBox.vue'
import XsdString from './XsdString.vue';
import XsdNumeric from './XsdNumeric.vue';

[ faLink, faUnlink, faCircle, faQuestionCircle, faEye, faEyeSlash, faEraser ].map(icon => library.add(icon)) ;


@Options({
  components : { 
    library,FontAwesomeIcon, XsdString, XsdNumeric,URIBox
    },
  
  emits: ["updateAttribute"],

  props: { 
      attribute : {
        type : Object as () => AskOmicsViewAttributes, 
        required: true
      }
  },
  
  methods: {
      toggleLinkAttribute: () => { console.log( "click 1 !") },
      
      erase() {
        this.$emit('updateAttribute',JSON.stringify(AskOmicsViewAttributes.from(this.attribute).clean()))
      },

      openEye(){ 
        this.attribute.visible = true
        this.$emit('updateAttribute',JSON.stringify(this.attribute))
      },
      
      closeEye() {
        this.attribute.visible = false
        this.$emit('updateAttribute',JSON.stringify(this.attribute))
      },

      openLink() {
        this.attribute.linked = true
        this.$emit('updateAttribute',JSON.stringify(this.attribute))
      },

      closeLink() {
        this.attribute.linked = false
        this.$emit('updateAttribute',JSON.stringify(this.attribute))
      },

      toggleOptional: () => { console.log( "click 3 !") }
  },
  
  data () {
    return {
    }
  }
})

export default class AttributeBox extends Vue {
  attribute!: AskOmicsViewAttributes
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
