import { SWDiscoveryConfiguration, SWDiscovery, URI, SWTransaction} from '@p2m2/discovery'
import { DatatypeLiteral, ViewNode3DJS, ViewLink3DJS, LinkType, AskOmicsGenericNode, AskOmicsViewNode, AskOmicsViewLink, NodeType, UserConfiguration } from './types'
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
    discovery        : any                     =  SWDiscovery().something()

    constructor(requestManagerStringify : string) {
        if ( !discovery_map ) {
            discovery_map =  new Map<number,any>() ;
        }
        
        this.parse(requestManagerStringify)
    }

    serialized() : string {
        return JSON.stringify([ this.config_str, this.strategy_str, this.getDiscovery().getSerializedString()])
    }

    parse( str : string ) {
        console.log(" ----------- PARSE ----------------")
        console.log(str)
        
        if (! str || str.length<=0) {
            console.warn(" -- none query string to parse !! -- ")
            this.setDiscovery(SWDiscovery().something())
            return
        }

        const r = JSON.parse(str)
        this.config_str = r[0]
        this.config = SWDiscoveryConfiguration.setConfigString(this.config_str)
        this.strategy_str = r[1]
        const serializedDiscovery = r[2]

        console.log("-- config discovery -- ")
        console.log(this.config)
        console.log("-- strategy -- ")
        console.log(this.strategy_str)
        console.log("-- serializedDiscovery -- ")
        console.log(serializedDiscovery)

        let sw = SWDiscovery(this.config)
        
        if (serializedDiscovery && serializedDiscovery.length>0)
            sw = sw.setSerializedString(serializedDiscovery)
        else {
            sw = sw.something()
        }
        
        console.log(" -- set discovery -- ")    
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


    setDiscovery(disco : any) : void  { discovery_map.set(this.id,disco) } 

    getDiscovery() : any { return getDiscovery(this.id) }

    update(node : ViewNode3DJS, link : ViewLink3DJS ) : string {

        const snd_node = link.source.id == node.id ? link.source : link.target
        const d : any = this.getDiscovery()

        switch(link.type) { 
            case LinkType.FORWARD_PROPERTY: { 
                this.setDiscovery(d.isSubjectOf(new URI(link.uri)).isA(new URI(snd_node.uri)))
               break; 
            } 
            case LinkType.BACKWARD_PROPERTY: { 
                this.setDiscovery(d.isObjectOf(new URI(link.uri)).isA(new URI(snd_node.uri)))
               break; 
            } 
            case LinkType.IS_A: { 
                this.setDiscovery(d.isA(new URI(snd_node.uri)))
               break; 
            } 
            default: { 
               console.error("unkown action :"+JSON.stringify(link))
               break; 
            } 
         }
         
         return this.getDiscovery().focus() 
    }
/*
    startWithConfiguration(json : string) {
        console.log(" ================= startWithConfiguration ===============");
        console.log(json);
        this.config = json 
        
       // this.getDiscovery().isObjectOf("test").console() ;
        
//        const ssss = new SWDiscovery(config).something().console().getSerializedString;      
//        console.log(ssss);
//        new SWDiscovery(config).setSerializedString(ssss);
        console.log(" ================= FIN ========================= startWithConfiguration ===============");
    }*/

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

    setFocus(idFocus : string) : void {
        const disco = this.getDiscovery().focus(idFocus) ;
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

    attributeList(focus: string) : Promise<DatatypeLiteral[]> {
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
                        const results : DatatypeLiteral[] = []
                        
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
                                lUris.map(
                                    uriProperty => {
                                        const label = m.get(uriProperty)
                                        let range = mapPropertyAndRange.get(uriProperty)
                                        
                                        if (!range) range=""

                                        results.push(
                                            new DatatypeLiteral(uriProperty,range,label)
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
                                    if(! mR.has(property)) {
                                        try {
                                            const listLabelEntity = 
                                                response.results.datatypes["labelProperty"][property] ;
                                            if ( listLabelEntity )
                                                labelProperty = listLabelEntity[0].value; 
                                        } catch (error) {
                                            console.warn(error);
                                        }    
                                        
                                        if (typeLink == LinkType.FORWARD_PROPERTY)
                                            mR.set( property,new AskOmicsViewLink(property,labelProperty,typeLink,current.id,n.id))
                                        else 
                                            mR.set( property,new AskOmicsViewLink(property,labelProperty,typeLink,n.id,current.id))
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
}