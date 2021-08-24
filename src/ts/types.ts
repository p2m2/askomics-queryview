import Utils from "./utils"

interface AskOmicsViewAttributesI {
    id: string
    uri: string
    label: string
    range : string
    visible: boolean    
    negative: boolean   
    linked: boolean     
}

export class AskOmicsViewAttributes {
      id: string
      uri: string
      label: string
      range : string
      visible: boolean    = false
      negative: boolean   = false
      linked: boolean     = false

      constructor(id: string,uri: string,range: string, label : string="") {
        this.id = id
        this.uri = uri
        this.label = label == "" ? Utils.splitUrl(uri): label 
        this.range = range.trim().replace("http://www.w3.org/2001/XMLSchema#","xsd:")
      }
    
      getObject() {
        return {
            id: this.id, 
            uri : this.uri, 
            label: this.label, 
            range: this.range, 
            visible: this.visible , 
            negative: this.negative,
            linked : this.linked
          }
      }

      static build(n: AskOmicsViewAttributes) {
          return JSON.stringify(n.getObject())
      }



      static from(n: AskOmicsViewAttributesI) : AskOmicsViewAttributes {
        const att = new AskOmicsViewAttributes(n.id,n.uri,n.range,n.label)
        att.visible = n.visible
        att.negative = n.negative 
        att.linked = n.linked
        return att

    }

}

export interface Graph3DJS { 
    nodes : AskOmicsViewNode[], 
    links : AskOmicsViewLink[] 
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

    constructor(id  : string) {
            this.id = id
    }
    

    static build(s : any) : UserConfiguration {
        const copy     = new UserConfiguration(s.id)
        
        copy.url     = s.url 
        copy.file    = s.file 
        copy.content = s.content
        copy.mimetype = s.mimetype 
        copy.method = s.method 
        copy.strategy = s.strategy  
        copy.logLevel = s.logLevel

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