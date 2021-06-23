import { SWDiscoveryConfiguration, SWDiscovery, URI} from '@p2m2/discovery'
import { NodeType, ObjectState, ViewNode, ViewLink, LinkType, AskOmicsGenericNode, AskOmicsViewNode, AskOmicsViewLink } from './types'
import StrategyRequestAbstract from "./StrategyRequestAbstract"
import StrategyRequestAskOmics from "./StrategyRequestAskOmics"
import StrategyRequestDataDriven from "./StrategyRequestDataDriven"

/**
 * Trick . TS inser SWDiscovery inside a Proxy type. Exception occurs whith the first use.
 */
let discovery_map : Map<number,SWDiscovery> ;

function getDiscovery(id : number) : SWDiscovery {
    const d = discovery_map.get(id);
    if ( d )
        return d ;
    return new SWDiscovery();
}
/**
 * end trick
 */

export default class RequestManager {
    id               : number ;
    config           : string ;
    strategy        ?: StrategyRequestAbstract ;
    static idCounter : number  = 0 ;

    constructor(json : string) {
        
        console.log(" ================= CONSTRUCTOR ===============");
        if ( !discovery_map ) {
            discovery_map =  new Map<number,SWDiscovery>() ;
        }

        this.id = RequestManager.idCounter ;
        RequestManager.idCounter++ ;
        this.setDiscovery(new SWDiscovery().something()) ;
        this.config = json
        this.setConfig(json)
    }

    setDiscovery(disco : SWDiscovery) : void  {
        discovery_map.set(this.id,disco) // new discovery ;
    } 

    getDiscovery() : SWDiscovery {
        return getDiscovery(this.id)
    }

    setConfig(json : string) {
        this.config = json 
        const localConf = SWDiscoveryConfiguration.setConfigString(json)
        this.setDiscovery(new SWDiscovery(localConf).something());
    }

    update(node : ViewNode, link : ViewLink ) : string {

        const snd_node = link.source.id == node.id ? link.source : link.target
        const d : SWDiscovery = this.getDiscovery()

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

    setFocus(idFocus : string) : void {
        const disco = this.getDiscovery().focus(idFocus) ;
        this.setDiscovery(disco);
    }

    forwardEntities(current: AskOmicsViewNode) : Promise<Map<String,AskOmicsGenericNode>> {
        return this.propertyEntities("forward",current)
    }

    backwardEntities(current: AskOmicsViewNode) : Promise<Map<String,AskOmicsGenericNode>> {
        return this.propertyEntities("backward",current)
    }

    propertyEntities( type: string, current: AskOmicsViewNode ) : Promise<Map<String,AskOmicsGenericNode>> {
        return new Promise((successCallback, failureCallback) => {
            console.log(" -----------------------------------    forwardEntities ------------------------------------- ");

            if (this.strategy) {
                
                let disco : SWDiscovery = this.getDiscovery()
                let typeLink : LinkType

                switch(type) { 
                    case "forward": { 
                        disco = this.strategy.forwardEntities(this.getDiscovery(),this.config,current)
                        typeLink = LinkType.FORWARD_PROPERTY
                        break; 
                    } 
                    case "backward": { 
                        disco = this.strategy.backwardEntities(this.getDiscovery(),this.config,current)
                        typeLink = LinkType.BACKWARD_PROPERTY
                        break; 
                    } 
                    default: { 
                        failureCallback("unkown action :" +type)
                        return
                    } 
                 }

                try {
                    disco
                        .console()
                        .select("property","entity","labelEntity","labelProperty")
                        .distinct
                        .commit()
                        .raw()
                        .then(
                            (response) => {                      
                                const mR = new Map()
                                for (let i=0;i<response.results.bindings.length;i++) {
                                    
                                    if ( ! response.results.bindings[i]["entity"] ) {
                                        console.warn(" probleme with entry : "+JSON.stringify(response.results.bindings[i]))
                                        continue
                                    }
                                    
                                    if ( ! response.results.bindings[i]["property"] ) {
                                        console.warn(" probleme with property : "+JSON.stringify(response.results.bindings[i]))
                                        continue
                                    }

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
                                            console.error(error);
                                        }     

                                        n = new AskOmicsViewNode(entity,labelEntity);

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
                                            console.error(error);
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