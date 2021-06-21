import Utils from "./utils"

export type UserConfiguration = {
    admin: Boolean
}
  
export type AttributeSpec = {
      id: Number,
      uri: String,
      range : String,
      label: String,
      visible: Boolean,
      negative: Boolean,
      linked: Boolean,
  }

export enum NodeState {
    SOMETHING=0,
    SUGGESTED,
    CONCRETE,
    SELECTED,
    
}

export abstract class AskOmicsGenericNode {
    uri       : string
    label     : string 
    state     : NodeState

    constructor(uri : string , label : string ) {
        this.uri = uri 
        this.state = NodeState.SUGGESTED    
        
        if ( label.length > 0 )
            this.label = label
        else
            this.label = Utils.splitUrl(uri)
    }
}

export class AskOmicsViewNode extends AskOmicsGenericNode {
    constructor(uri : string, label : string ) {
        super(uri,label);
    }
} 

export class AskOmicsViewLink extends AskOmicsGenericNode {
    source    : string
    target    : string

    constructor(uri : string,  label : string, source : string, target : string) {
        super(uri,label);
       
        this.source = source
        this.target = target 
    }
} 

export type RdfSparqlResultForm = {
    type : String,
    value: String, 
    datatype: String,
    "xml:lang" : String
}