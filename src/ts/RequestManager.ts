import { SWDiscoveryConfiguration, SWDiscovery, URI, SWTransaction} from '@p2m2/discovery'
import { LinkType, AskOmicsGenericNode, 
         AskOmicsViewNode, AskOmicsViewLink, NodeType, 
         ObjectState, AskOmicsViewAttributes, Graph3DJS } from './types'
import StrategyRequestAbstract from "./StrategyRequestAbstract"
import StrategyRequestAskOmics from "./StrategyRequestAskOmics"
import StrategyRequestDataDriven from "./StrategyRequestDataDriven"
import Utils from './utils'
import { Vue } from 'vue-class-component'

/**
 * Trick . TS inser SWDiscovery inside a Proxy type. Exception occurs whith the first use.
 */
let discovery_map : Map<number,any> ;

function getDiscovery(id : number) : any {
    const d = discovery_map.get(id);
    if ( d )
        return d ;
    return new SWDiscovery();
}
/**
 * end trick
 */

export default class RequestManager {
    static idCounter : number                  = 0 ;
    id               : number                  = RequestManager.idCounter++;
    config           : any                         ;
    config_str       : string                  = "" ;
    strategy_str     : string                  = "" ;
    strategy         : StrategyRequestAbstract = new StrategyRequestDataDriven();
    discovery        : any                     = null ;
    vue              : Vue                      ;

   
    constructor(requestManagerStringify : string, vue : Vue) {
        if ( !discovery_map ) {
            discovery_map =  new Map<number,any>() ;
        }

        this.vue = vue 
        this.parse(requestManagerStringify)
        
    }
    
    defaultGraph(focus: string)  : any {
        return {
            nodes : [AskOmicsViewNode.something(ObjectState.CONCRETE,focus)],
            links : []
        }
    }


    serialized() : string {
        return JSON.stringify([ this.config_str, this.strategy_str, this.getDiscovery().getSerializedString()])
    }

    parse( str : string ) {
        
        if (! str || str.length<=0) {
            throw new Error("Non string to parse !")
        }

        const r = JSON.parse(str)
        this.config_str = r[0]
        this.config = SWDiscoveryConfiguration.setConfigString(this.config_str)
        this.strategy_str = r[1]
        const serializedDiscovery = r[2]

        let sw = SWDiscovery(this.config)
        
        if (serializedDiscovery && serializedDiscovery.length>0) {
            sw = sw.setSerializedString(serializedDiscovery)
        } else {
            const n = this.defaultGraph("start").nodes[0]

            sw = sw
            .root()
            .setDecoration("graph",JSON.stringify(this.defaultGraph("start")))
            .something("start")
            .setDecoration("attributes",JSON.stringify({}))
            .root()
        }
         
        this.setDiscovery(sw)
        
        switch(this.strategy_str) {
            case "askomics" : {
                this.setAskOmicsStrategy()
                break
            }
            case "data-driven" : {
                this.setDataDrivenStrategy()
                break
            }
            default : {
                console.warn("strategy unknown : "+this.strategy_str)
                this.setDataDrivenStrategy()
            }
        }

    }
    
    setGraph(graph : Object) {
        const focus : string = this.getDiscovery().focus()
        
        this.setDiscovery(
                    this.getDiscovery()
                    .root()
                    .setDecoration("graph",JSON.stringify(graph))
                    .focus(focus)
                    )

        this.vue.$emit('updateRequestManager',this.serialized())
    }


    getGraph() : Graph3DJS {
        console.log(JSON.stringify(this.getDiscovery().root().getDecoration("graph")))
        return JSON.parse(this.getDiscovery().root().getDecoration("graph"))
    }


    setDiscovery(disco : any) : void  { 
        discovery_map.set(this.id,disco) 
    } 

    getDiscovery() : any { return getDiscovery(this.id) }

    setNewNodeWithLink(node : AskOmicsViewNode, link : AskOmicsViewLink ) : string {
        const snd_node_id = link.source == node.id ? link.source : link.target
        const snd_node : AskOmicsViewNode = this.getGraph().nodes.filter( x => x.id == snd_node_id).pop()!
        const d : any = this.getDiscovery()
        
        switch(link.type) { 
            case LinkType.FORWARD_PROPERTY: { 
                this.setDiscovery(
                    d.isSubjectOf(new URI(link.uri))
                    .setDecoration("attributes",JSON.stringify({}))
                    .isA(new URI(snd_node.uri)))
               
                break; 
            } 
            case LinkType.BACKWARD_PROPERTY: { 
                this.setDiscovery(
                    d
                    .isObjectOf(new URI(link.uri))
                    .setDecoration("attributes",JSON.stringify({}))
                    .isA(new URI(snd_node.uri)))
              
               break; 
            } 
            case LinkType.IS_A: { 
                this.setDiscovery(
                    d
                    .isA(new URI(snd_node.uri))
                    //TODO
                    //.decorate("node",JSON.stringify(AskOmicsViewNode.build(node)))
                    )
               break; 
            } 
            default: { 
               console.error("unkown action :"+JSON.stringify(link))
               break; 
            } 
         }

         return this.getDiscovery().focus() 
    }


    /** CONFIGURATION */
    setPageSize(numberOfResults : number) {
        const re = /("pageSize"\s*:\s*)(\d+)/; 
        this.config_str = this.config_str.replace(re, "$1"+numberOfResults)
        console.log(this.config_str)
        this.config = SWDiscoveryConfiguration.setConfigString(this.config_str)
        const disco = this.getDiscovery()
        this.setDiscovery(disco.setConfig(this.config))
    }

   
    focusIsSelected() : boolean {
        return ( this.getFocus() != this.getDiscovery().root().focus() ) 
    }

    isFocusStart() : boolean {
        return ( this.getFocus() == "start" ) 
    }

    setAskOmicsStrategy() {
        console.log(" -- setAskOmicsStrategy -- ");
        this.strategy = new StrategyRequestAskOmics(this.config) ;
    }

    setDataDrivenStrategy() {
        console.log(" -- setDataDrivenStrategy -- ");
        this.strategy = new StrategyRequestDataDriven() ;
    }

    getFocus() : string {
        return this.getDiscovery().focus() ;
    }

    setFocusRoot() : void {
        const disco = this.getDiscovery().root() ;
        this.setDiscovery(disco);
    }

    setFocus(focus : string) : void {
        const disco = this.getDiscovery().focus(focus)
        this.setDiscovery(disco);
    }

    checkVariablePresent(response : any ,index : number ,listVarName : string[] ) : Boolean {
        for (let i=0;i<listVarName.length;i++) {
            const varname = listVarName[i]
            if ( ! response.results.bindings[index][varname] ) {
                console.warn(" probleme with entry : "+JSON.stringify(response.results.bindings[index]))
                return false
            }
        }
        
        return true
    }

    removeNode(vue : Vue) {
        if ( this.focusIsSelected() ) {
            this.setDiscovery(this.getDiscovery().remove(this.getDiscovery().focus())) ;            
            this.vue.$emit('updateRequestManager',this.serialized())
        } else {
            console.warn("None node is selected !")
        }
    }

    updateAttribute(attribute :AskOmicsViewAttributes) {
       
        if(!this.getDiscovery().getDecoration("attributes")) {
            alert("Bad definition of decorations : "+this.getDiscovery().getDecoration("attributes"))
        }
        
        const map = JSON.parse(this.getDiscovery().getDecoration("attributes"))
        
        map[attribute.uri] = attribute

        /** ON PEUT PAS ENCORE SUPPRIMER UN DATATYPE */

        if ( attribute.visible ) {
            this.setDiscovery(
                this.getDiscovery()
                .datatype(attribute.uri,attribute.id)
                )
        }
       
        this.setDiscovery(
            this.getDiscovery()
            .setDecoration("attributes",JSON.stringify(map))
            )    
    }

    attributeList(focus: string) : Promise<AskOmicsViewAttributes[]> {
        return new Promise((successCallback, failureCallback) => {
            if (this.strategy) {
                this.strategy.attributeList(this.getDiscovery(),focus) 
                //.console()
                .select("property","labelProperty")
                .distinct()
                .commit()
                .raw()
                .then(
                    (response : any) => {
                        //console.log(response)
                        const results : AskOmicsViewAttributes[] = []
                        
                        const m : Map<string,string> = new Map()
                        for (let i=0;i<response.results.bindings.length;i++) {
                            if ( ! this.checkVariablePresent(response,i,['property']) ) continue
                            const uri   : string = response.results.bindings[i]["property"].value;
                          /*
                            TODO : Discovery => wait for "bind.datatype" feature

                            let range : string 
                          
                            if (response.results.bindings[i]["range"]) {
                                range = response.results.bindings[i]["range"].value;
                                console.log("RANGE:"+range);
                            } */
                                

                            let label   : string = Utils.splitUrl(uri)  ;
                            try {
                                const listLabelEntity = response.results.datatypes["labelProperty"][uri] ;
                                if ( listLabelEntity )
                                    label=listLabelEntity[0].value; 
                            } catch (error) {
                                failureCallback(error);
                            }     

                            m.set(uri,label)
                        }
                        
                        if ( this.strategy && m.size>0) {
                            const lUris : string[] = []
                            for (const key of m.keys()) {
                                lUris.push(key)
                            }
 
                            this.strategy.getDatatypes(this.config_str, lUris)
                            .then ( (mapPropertyAndRange )=>{
                                let iCount = 0
                                lUris.map(
                                    uriProperty => {
                                        let label = m.get(uriProperty)
                                        let range = mapPropertyAndRange.get(uriProperty)
                                        
                                        if (!label) label = uriProperty.split(/\/#/).pop()
                                        if (!label) label = ""
                                        if (!range) range = ""
                                        
                                        const id : string = focus+"_dt_"+iCount++
                                        results.push(
                                            new AskOmicsViewAttributes(id,uriProperty,range,label)
                                        )
                                    })
                                successCallback(results)
                                
                            }).catch(e => {failureCallback(e)} )
                        } else {
                            successCallback(results)
                        }  
                    })
                .catch( (e : any) => {failureCallback(e)} )}
        })
    }

    forwardEntities(vue : Vue, current: AskOmicsViewNode) : Promise<Map<String,AskOmicsGenericNode>> {
        return this.propertyEntities(vue, NodeType.FORWARD_ENTITY,current)
    }

    backwardEntities(vue : Vue, current: AskOmicsViewNode) : Promise<Map<String,AskOmicsGenericNode>> {
        return this.propertyEntities(vue, NodeType.BACKWARD_ENTITY,current)
    }

    propertyEntities( vue : Vue, type: NodeType, current: AskOmicsViewNode ) : Promise<Map<String,AskOmicsGenericNode>> {
        return new Promise((successCallback, failureCallback) => {
            if (this.strategy) {
                
                let disco : any = this.getDiscovery()
                let typeLink : LinkType

                switch(type) { 
                    case NodeType.FORWARD_ENTITY : { 
                        disco = this.strategy.forwardEntities(this.getDiscovery(),this.config_str,current)
                        typeLink = LinkType.FORWARD_PROPERTY
                        break; 
                    } 
                    case NodeType.BACKWARD_ENTITY : { 
                        disco = this.strategy.backwardEntities(this.getDiscovery(),this.config_str,current)
                        typeLink = LinkType.BACKWARD_PROPERTY
                        break; 
                    } 
                    default: { 
                        failureCallback("unkown action :" +type)
                        return
                    } 
                 }

                try {
                    const transaction : any =
                     disco
                        //.console()
                        .select("property","entity","labelEntity","labelProperty")
                        .distinct()
                        .commit()
                        .progression( (percent : Number) => {
                            vue.$emit('requestManagerBusyPercent',JSON.stringify(percent))

                        })
                        .requestEvent( (event : string ) => {
                            vue.$emit('requestManagerBusyEvent',JSON.stringify(event))
                        })

                    transaction
                        .raw()
                        .then(
                            (response : any) => {                      
                                const mR = new Map()
                                for (let i=0;i<response.results.bindings.length;i++) {
                                    if ( ! this.checkVariablePresent(response,i,['entity','property']) ) continue
                                  
                                    const entity      : string = response.results.bindings[i]["entity"].value;
                                    const property    : string = response.results.bindings[i]["property"].value;
                                    let labelEntity   : string = ""  ;
                                    let labelProperty : string = ""  ;
                                    let n : AskOmicsViewNode ;

                                    if (!mR.has(entity)) {
                                       
                                        try {
                                            const listLabelEntity = 
                                                response.results.datatypes["labelEntity"][entity] ;
                                            if ( listLabelEntity )
                                                labelEntity=listLabelEntity[0].value; 
                                        } catch (error) {
                                            console.warn(error);
                                        }     
                                        
                                        n = new AskOmicsViewNode(entity,labelEntity,type)

                                        mR.set(entity, n) ;
                                    } else {
                                        n = mR.get(entity)
                                    }
                                    if(! mR.has(entity+property)) {
                                        try {
                                            const listLabelEntity = 
                                                response.results.datatypes["labelProperty"][property] ;
                                            if ( listLabelEntity )
                                                labelProperty = listLabelEntity[0].value; 
                                        } catch (error) {
                                            console.warn(error);
                                        }    
                                        
                                        if (typeLink == LinkType.FORWARD_PROPERTY)
                                            mR.set( entity+property,new AskOmicsViewLink(property,labelProperty,typeLink,current.id,n.id))
                                        else 
                                            mR.set( entity+property,new AskOmicsViewLink(property,labelProperty,typeLink,n.id,current.id))
                                    }
                                }
                                successCallback(mR);
                            }
                        ).catch( (e : Error) => { failureCallback(e) });
                    } catch ( e ) {
                        failureCallback(e)
                    }
            } else {
                failureCallback("strategy undefined.")
            }
       })
    }
    /**
     * https://github.com/linmasahiro/vue3-table-lite
     * @returns 
     */
    getColumnsResults() {
        const rm = this.getDiscovery() ;
        const r = rm.browse(
            (node : any, deep : Number) => { 
          //      try { 
                    const attributes_current_node = []
                    if( node.decorations && node.decorations.attributes )  {
                        const attributes : Object = JSON.parse(node.decorations.attributes)
                        
                        for (const [key, element ] of Object.entries(attributes)) {
                            if ( element.visible ) {
                                
                                attributes_current_node.push ({
                                    node_id : node.idRef,
                                    label: element.label,
                                    field: element.id,
                                    width: "3%",
                                    sortable: true,
                                    isKey: false
                                })

                            } 
                        }
                       
                    }
                    return attributes_current_node
                //}
               /* catch (e ) {
                    console.log("pas grave............")
                }*/
                /*
                if( node.decorations && node.decorations.node ) {
                   return {
                    label: node.idRef,
                    field: node.idRef,
                    width: "3%",
                    sortable: true,
                    isKey: false
                   }
                }*/
            })
            .filter( (value : Array<Object>) => value.length>0 )

        return r.flat() 

    }

    getCountAndLaziesPages(numberOfResults : number = 10) {
        
        const variables = this.getColumnsResults().flatMap( (value : any) => [value.node_id,value.field] )
        const variables_uniq = [...new Set(variables)];

        this.setPageSize(numberOfResults)
        
        return new Promise((successCallback, failureCallback) => {
            this.getDiscovery()
                .console()
                .selectByPage(...variables_uniq)
                .then( ( args : any ) => {
                    successCallback(args)
                }).catch( (error : string) => {
                    failureCallback(error)
                });
            })

    }

}