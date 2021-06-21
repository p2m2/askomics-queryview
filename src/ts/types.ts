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

export abstract class AskOmicsNode {
    id        : string
    uri       : string
    label     : string 
    selected  : Boolean
    suggested : Boolean

    constructor(uri : string , label : string ) {
        this.id = uri 
        this.uri = uri 
        this.suggested = true 
        this.selected = false 
        
        if ( label.length > 0 )
            this.label = label
        else
            this.label = Utils.splitUrl(uri)
    }
}

export class AskOmicsViewNode extends AskOmicsNode {
    constructor(uri : string, label : string ) {
        super(uri,label);
    }
} 

export class AskOmicsViewLink extends AskOmicsNode {
    source    : string
    target    : string

    constructor(uri : string, source : string, target : string, label : string ) {
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