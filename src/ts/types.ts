import Utils from "./utils"


interface AskOmicsViewAttributesI {
    id: string
    order: number,
    uri: string
    label: string
    range : string
    visible: boolean    
    negative: boolean   
    linked: boolean
    properties : Object
    filterValue : string  
    operator  : AttributeOperator       
}

export class AskOmicsViewAttributes {
      id: string
      order: number
      uri: string
      label: string
      range : string
      visible: boolean      = false
      negative: boolean     = false
      linked: boolean       = false
      filterValue : string  = ""
      operator  : AttributeOperator = AttributeOperator.CONTAINS


      constructor(id: string,order : number,uri: string,range: string, label : string="") {
        this.id = id
        this.order = order
        this.uri = uri
        this.label = label == "" ? Utils.splitUrl(uri): label 
        this.range = range.trim().replace("http://www.w3.org/2001/XMLSchema#","xsd:")
      }
    
      getObject() {
        return {
            id: this.id, 
            order: this.order,
            uri : this.uri, 
            label: this.label, 
            range: this.range, 
            visible: this.visible , 
            negative: this.negative,
            linked : this.linked,
            filterValue : this.filterValue,
            operator : this.operator
          }
      }

      clean() : AskOmicsViewAttributes  {
        this.visible  = false  
        this.negative = false  
        this.linked   = false  
        this.filterValue = "" 
        this.operator = AttributeOperator.UNDEFINED
        if ( this.range == "xsd:string" || this.range == "uri" ) this.operator = AttributeOperator.CONTAINS
        else if ( 
            this.range == "xsd:numeric" || 
            this.range == "xsd:integer" || 
            this.range == "xsd:double" || 
            this.range == "xsd:float" ) this.operator = AttributeOperator.EQUAL

        return this
      }
  
      static from(n: AskOmicsViewAttributesI) : AskOmicsViewAttributes {
        const att = new AskOmicsViewAttributes(n.id,n.order,n.uri,n.range,n.label)
        att.visible = n.visible
        att.negative = n.negative 
        att.linked = n.linked
        att.filterValue = n.filterValue,
        att.operator = n.operator
        
        return att

    }

}

export interface Graph3DJS { 
    nodes : AskOmicsViewNode[], 
    links : AskOmicsViewLink[] 
}


export enum AttributeOperator {
    UNDEFINED=0,
    STREQUAL,
    CONTAINS,
   /* REGEXP, wait fix #143 issue - discovery */
    STRSTARTS,
    STRENDS,
    EQUAL,
    NOTEQUAL,
    INF,
    INFEQUAL,
    SUP,
    SUPEQUAL
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

export enum FilterProperty {
    TO=0,
    IS_A,
    FROM,
    ALL,   
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

    pageSize        : number = 10
    batchProcessing : number = 10

    cache           : boolean = true 

    constructor(id  : string) {
            this.id = id
    }
    

    static build(s : any) : UserConfiguration {
        const copy     = new UserConfiguration(s.id)
        
        if (s.url) copy.url    = s.url 
        if (s.file) copy.file            = s.file 
        if (s.content) copy.content         = s.content
        if (s.mimetype) copy.mimetype        = s.mimetype 
        if (s.method) copy.method          = s.method 
        if (s.strategy) copy.strategy        = s.strategy  
        if (s.logLevel) copy.logLevel        = s.logLevel
        if (s.pageSize) copy.pageSize        = s.pageSize  
        if (s.batchProcessing) copy.batchProcessing = s.batchProcessing
        if (s.cache) copy.cache = s.cache

        return copy  
    }

    remoteAccess() : string {
        if ( this.url.length>0) {
            return `"url" : "`+this.url+`"`
        } else if ( this.file.length>0) {
            return `"file" : "`+this.file+`"`
        } else if ( this.content.length>0 ) {
            return `"content" : "`+this.content+`"`
        }
        
        throw Error("url|file|content should bed defined.") ;

    }
    methodAcess() : string {
        if ( this.method ) `"method" : "`+this.method+`"`
        return ""
    }

    jsonConfigurationSWDiscoveryString() : string {

        let ma : string = this.methodAcess() 

        if (ma.length > 0 ) {
            ma = ma + ",\n"
        } 

        return  `{
            "sources" : [{
            "id"  : "__id__",\n`  +
            this.remoteAccess() + ",\n" +
            ma +
            `"mimetype" : "`+this.mimetype+`"` + 
        `}],
            "settings" : {
                "cache" : `+this.cache +`,
                "logLevel" : "`+this.logLevel+`",
                "sizeBatchProcessing" :  `+this.batchProcessing +`,
                "pageSize" : `+this.pageSize +`
            }
        }`
    }
}
  

export abstract class AskOmicsGenericNode {
    id          : string
    uri         : string = ""
    label       : string = ""
    state_n     : ObjectState
    
    static min : number = -4
    static max : number = 4

    x         : number = 375 + AskOmicsGenericNode.randomInteger(AskOmicsGenericNode.min,AskOmicsGenericNode.max) // (740/2) 
    y         : number = 225 + AskOmicsGenericNode.randomInteger(AskOmicsGenericNode.min,AskOmicsGenericNode.max) // (450/2)

    static idCounter : number  = 0 ;

    constructor( uri : string ,  label : string ) {
        this.id = String(AskOmicsGenericNode.idCounter++)
        this.uri = uri 
        this.state_n = ObjectState.SUGGESTED    
        
        if ( label.length > 0 )
            this.label = label
        else
            this.label = Utils.splitUrl(uri)
    }

    static randomInteger(min : number , max : number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
    
    focus     : string
    type      : NodeType

    constructor(uri : string, label : string, type: NodeType) {
        super(uri,label);
        this.type  = type
        this.focus = ""
    }
    
  
    static something(state : ObjectState,focus:string) : AskOmicsViewNode {
        const n = new AskOmicsViewNode("something","Something",NodeType.SOMETHING) ;
        n.type = NodeType.SOMETHING ;
        n.state_n = state
        n.focus = focus
        return n
    }
} 

export class AskOmicsViewLink extends AskOmicsGenericNode {
    type      : LinkType
    source    : string
    target    : string
    vx         : number = 0
    vy         : number = 0

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

export type RdfSparqlResultForm = {
    type : String,
    value: String, 
    datatype: String,
    "xml:lang" : String
}