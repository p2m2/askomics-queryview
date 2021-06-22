import { SWDiscoveryConfiguration, SWDiscovery} from '@p2m2/discovery'
import { AskOmicsGenericNode, AskOmicsViewNode, AskOmicsViewLink } from './types'
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
    strategy         : StrategyRequestAbstract ;
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
        // by default
        this.strategy = new StrategyRequestDataDriven() ;
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
        this.strategy = new StrategyRequestAskOmics(this.config) ;
    }

    setDataDrivenStrategy() {
        this.strategy = new StrategyRequestDataDriven() ;
    }

    getFocus() : string {
        return this.getDiscovery().focus() ;
    }

    setFocus(idFocus : string) : void {
        const disco = this.getDiscovery().focus(idFocus) ;
        this.setDiscovery(disco);
    }

     // @return List(Object(node : Node, links : List(Link)))
    forwardEntities(current: AskOmicsViewNode) : Promise<Map<String,AskOmicsGenericNode>> {
        return new Promise((successCallback, failureCallback) => {
            console.log(" -----------------------------------    forwardEntities ------------------------------------- ");

            if (this.strategy) {
                try {

                    this.strategy
                        .forwardEntities(this.getDiscovery(),current)
                        .console()
                        .select("forwardProperty","forwardEntity","labelForwardEntity","labelForwardProperty")
                        //.limit(5)
                        .distinct
                        .commit()
                        .raw()
                        .then(
                            (response) => {
                                console.log("response discovery...........");
                                console.log(response);
                                
                                const mR = new Map()
                                for (let i=0;i<response.results.bindings.length;i++) {
                                    const forwardEntity      : string = response.results.bindings[i]["forwardEntity"].value;
                                    const forwardProperty    : string = response.results.bindings[i]["forwardProperty"].value;
                                    let labelForwardEntity   : string = ""  ;
                                    let labelForwardProperty : string = ""  ;
                                    let n : AskOmicsViewNode ;
                                    if (!mR.has(forwardEntity)) {
                                       
                                        try {
                                            const listLabelEntity = 
                                                response.results.datatypes["labelForwardEntity"][forwardEntity] ;
                                            if ( listLabelEntity )
                                                labelForwardEntity=listLabelEntity[0].value; 
                                        } catch (error) {
                                            console.error(error);
                                        }     

                                        n = new AskOmicsViewNode(forwardEntity,labelForwardEntity);

                                        mR.set(forwardEntity, n) ;
                                    } else {
                                        n = mR.get(forwardEntity)
                                    }
                                    if(! mR.has(forwardProperty)) {
                                        
                                        try {
                                            const listLabelEntity = 
                                                response.results.datatypes["labelForwardProperty"][forwardProperty] ;
                                            if ( listLabelEntity )
                                                labelForwardProperty = listLabelEntity[0].value; 
                                        } catch (error) {
                                            console.error(error);
                                        }    
                                        //console.log(forwardEntity,forwardProperty,labelForwardEntity,labelForwardProperty); 
                                        
                                        const l : AskOmicsViewLink = 
                                            new AskOmicsViewLink(forwardProperty,labelForwardProperty,current.id,n.id)
                                        
                                        mR.set( forwardProperty, l ) ;
                                    }
                                }
                                successCallback(mR);
                            }
                        ).catch( (e : Error) => { failureCallback(e) });
                    } catch ( e ) {
                        console.error(" - Probleme with Strategy -- ");
                        console.error(e);
                    }
            } else {
                successCallback( new Map() )
            }
       })
    }
}