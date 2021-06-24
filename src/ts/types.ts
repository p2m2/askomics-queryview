import Utils from "./utils"


export type UserConfiguration = {
    admin: Boolean
}
  
export type AttributeSpec = {
      id: Number
      uri: String
      range : String
      label: String
      visible: Boolean
      negative: Boolean
      linked: Boolean
}

export type ViewNode = {
    id     : string
    uri    : string
    focus  : string
    label  : string
    state_n  : ObjectState
    type   : NodeType
}

export type ViewLink = {
    id     : string
    uri    : string
    label  : string
    source : ViewNode
    target : ViewNode
    state_n  : ObjectState
    type   : LinkType
}

export interface Graph3DJS { 
    nodes : ViewNode[], 
    links : ViewLink[] 
}


export enum NodeType {
    SOMETHING=0,
    ENTITY,   
}

export enum LinkType {
    FORWARD_PROPERTY=0,
    BACKWARD_PROPERTY,
    IS_A
}

export enum ObjectState {
    SUGGESTED=0,
    CONCRETE,
    SELECTED,   
}

export abstract class AskOmicsGenericNode {
    id          : string
    uri         : string
    label       : string 
    state_n     : ObjectState

    static idCounter : number  = 0 ;

    constructor(uri : string , label : string ) {
        this.id = String(AskOmicsGenericNode.idCounter++)
        this.uri = uri 
        this.state_n = ObjectState.SUGGESTED    
        
        if ( label.length > 0 )
            this.label = label
        else
            this.label = Utils.splitUrl(uri)
    }

    isSuggested() : Boolean { return this.state_n == ObjectState.SUGGESTED}

    isConcrete() : Boolean { return this.state_n == ObjectState.CONCRETE}

    isSelected() : Boolean { return this.state_n == ObjectState.SELECTED}

    setSuggested() : void { this.state_n = ObjectState.SUGGESTED}

    setConcrete() : void { this.state_n = ObjectState.CONCRETE}

    setSelected() : void { this.state_n = ObjectState.SELECTED}

    getObject() : object {
        return Object.assign({},this)
    }
}

export class AskOmicsViewNode extends AskOmicsGenericNode {
    focus : string
    type : NodeType
    
    constructor(uri : string, label : string) {
        super(uri,label);
        this.type = NodeType.ENTITY
        this.focus=""
    }

    static something(state : ObjectState, focus : string) : AskOmicsViewNode {
        const n = new AskOmicsViewNode("something","Something") ;
        n.type = NodeType.SOMETHING ;
        n.state_n = state
        console.log(n);
        return n
    }
} 

export class AskOmicsViewLink extends AskOmicsGenericNode {
    type      : LinkType
    source    : string
    target    : string

    constructor(uri : string,  label : string, typeLink : LinkType, source : string, target : string) {
        super(uri,label);
       
        this.type = typeLink
        this.source = source
        this.target = target 
        
    }
} 

export enum RangeBoxType {
    XSD_UNKNOWN=0,
    XSD_NUMERIC,
    XSD_BOOLEAN,
    XSD_STRING,   
}

export class DatatypeLiteral {
    static idCounter : number  = 0 ;

    id       : Number 
    uri      : String
    range    : RangeBoxType
    label    : String
    
    constructor(uri: string, range : string, label : string= "") {
        this.id = DatatypeLiteral.idCounter++
        this.uri = uri
        this.label = label == "" ? Utils.splitUrl(uri): label 

        switch(range.toLowerCase()) {
            case "xsd.string" :
            case ""           : {
                this.range = RangeBoxType.XSD_STRING
                break
            }
            case "xsd:numeric" :
            case "xsd:integer" :
            case "xsd:float"   :
            case "xsd:double"  :
            case "xsd:decimal" :    {
                this.range = RangeBoxType.XSD_NUMERIC
                break
            }
            case "xsd:boolean" :    {
                this.range = RangeBoxType.XSD_BOOLEAN
                break
            }
            default : {
                this.range = RangeBoxType.XSD_UNKNOWN
            }
        }
    }
}

export type RdfSparqlResultForm = {
    type : String,
    value: String, 
    datatype: String,
    "xml:lang" : String
}