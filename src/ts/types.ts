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

export abstract class AskOmicsGenericNode {
    id        : string
    uri       : string
    label     : string 
    flags     : Map<String,Boolean>

    constructor(uri : string , label : string ) {
        this.id = uri 
        this.uri = uri 
        this.flags = new Map()

        this.flags.set('selected',false);
        this.flags.set('suggested',true);
        this.flags.set('something',false);
        
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