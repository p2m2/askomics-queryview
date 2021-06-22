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

export enum NodeType {
    SOMETHING=0,
    ENTITY,   
}

export enum LinkType {
    OBJECT_PROPERTY=0,
    OBJECT_PROPERTY_PATH,
}

export enum ObjectState {
    SUGGESTED=0,
    CONCRETE,
    SELECTED,   
}

export abstract class AskOmicsGenericNode {
    id        : string
    uri       : string
    label     : string 
    state_n     : ObjectState

    static idCounter : number  = 0 ;

    constructor(uri : string , label : string ) {
        this.id = String(AskOmicsGenericNode.idCounter)
        AskOmicsGenericNode.idCounter++
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
    type : NodeType
    
    constructor(uri : string, label : string) {
        super(uri,label);
        this.type = NodeType.ENTITY
    }

    static something(state : ObjectState = ObjectState.SUGGESTED) : AskOmicsViewNode {
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

    constructor(uri : string,  label : string, source : string, target : string) {
        super(uri,label);
       
        this.type = LinkType.OBJECT_PROPERTY
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