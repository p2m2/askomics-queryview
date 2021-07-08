import Utils from "./utils"


export type AttributeSpec = {
      id: Number
      uri: String
      range : String
      label: String
      visible: Boolean
      negative: Boolean
      linked: Boolean
}

export type ViewNode3DJS = {
    id     : string
    uri    : string
    focus  : string
    label  : string
    state_n  : ObjectState
    type   : NodeType
}

export type ViewLink3DJS = {
    id     : string
    uri    : string
    label  : string
    source : ViewNode3DJS
    target : ViewNode3DJS
    state_n  : ObjectState
    type   : LinkType
}

export interface Graph3DJS { 
    nodes : ViewNode3DJS[], 
    links : ViewLink3DJS[] 
}


export enum NodeType {
    SOMETHING=0,
    FORWARD_ENTITY,
    BACKWARD_ENTITY   
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
/**
 *  "text/turtle",
      "text/n3",
      "text/rdf-xml",
      "application/rdf+xml"
 */
export class UserConfiguration {
    id             : string  
    url            : string = ""
    file           : string = ""
    content        : string = ""
    mimetype       : string = "application/sparql-query"
    method         : string = "POST"

    strategy       : string = "data-driven"
    logLevel       : string = "info"

    constructor(id  : string) {
            this.id = id
    }

    remoteAccess() : string {
        if ( this.url.length>0) {
            return `"url" : "`+this.url+`"`
        } else if ( this.file.length>0) {
            return `"file" : "`+this.file+`"`
        } else if ( this.content.length>0 ) {
            return `"content" : "`+this.content+`"`
        }
        return ""
    }
    methodAcess() : string {
        if ( this.method ) `"method" : "`+this.method+`"`
        return ""
    }

    jsonConfigurationSWDiscoveryString() : string {
        return  `{
            "sources" : [{
            "id"  : "__id__",`  +
            this.remoteAccess() +
            `"mimetype" : "`+this.mimetype+`"` +
            this.methodAcess() +
        `}],
            "settings" : {
                "cache" : true,
                "logLevel" : "`+this.logLevel+`",` +
                `"sizeBatchProcessing" : 10,
                "pageSize" : 10
            }
        }`
    }
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
    
    constructor(uri : string, label : string, type: NodeType) {
        super(uri,label);
        this.type  = type
        this.focus = ""
    }

    static something(state : ObjectState) : AskOmicsViewNode {
        const n = new AskOmicsViewNode("something","Something",NodeType.SOMETHING) ;
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
    uri      : string
    range    : string
    label    : string
    
    constructor(uri: string, range : string, label : string= "") {
        this.id    = DatatypeLiteral.idCounter++
        this.uri   = uri
        this.label = label == "" ? Utils.splitUrl(uri): label 
        this.range = range.trim().replace("http://www.w3.org/2001/XMLSchema#","xsd:")
       
    }

    getObject() : Object {
        return Object.assign({ visible: false, negative: false, linked: false },this)
    }
}

export type RdfSparqlResultForm = {
    type : String,
    value: String, 
    datatype: String,
    "xml:lang" : String
}