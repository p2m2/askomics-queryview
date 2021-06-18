const disovery_module = require('@p2m2/discovery')
const { SWDiscoveryConfiguration, SWDiscovery } = disovery_module; 

import StrategyRequestAbstract from "./StrategyRequestAbstract"
import StrategyRequestAskOmics from "./StrategyRequestAskOmics"
import StrategyRequestDataDriven from "./StrategyRequestDataDriven"

interface DiscoveryResponse {
    readonly results: {
        [key: string] : any 
    };
  }


export default class RequestManager {
    discovery : typeof SWDiscovery ;
    strategy  : StrategyRequestAbstract ;

    constructor() {
        this.discovery = new SWDiscovery() // new discovery ;
        // by default
        this.strategy = new StrategyRequestAskOmics() ;
    }

    startWithConfiguration(json : string) {
        const config = SWDiscoveryConfiguration.setConfigString(json) ;
        this.discovery = SWDiscovery(config).something();
    }

    setAskOmicsStrategy() {
        this.strategy = new StrategyRequestAskOmics() ;
    }

    setDataDrivenStrategy() {
        this.strategy = new StrategyRequestDataDriven() ;
    }

    getFocus() {
        if (this.strategy) 
            this.discovery.focus() ;
        else
            undefined ;
    }

    setFocus(idFocus : string) {
        if (this.strategy) 
            this.discovery.focus(idFocus) ;
    }

    forwardEntities(uri : string) {
        return new Promise((successCallback, failureCallback) => {
            if (this.strategy) {
                this.strategy
                    .forwardEntities(this.discovery,uri)
                    .console()
                    .select("forwardProperty","forwardEntity","labelForwardEntity","labelForwardProperty")
                    .commit()
                    .raw()
                    .then(
                        (response : DiscoveryResponse) => {
                            const mR = new Map()
                            for (let i=0;i<response.results.bindings.length;i++) {
                                const forwardEntity : String = response.results.bindings[i]["forwardEntity"].value;
                                const forwardProperty : String = response.results.bindings[i]["forwardProperty"].value;
                                
                                if (!mR.get(forwardEntity)) {
                                    let labelForwardEntity="<none>";
                                    try {
                                        labelForwardEntity=response.results.datatypes["labelForwardEntity"].get(forwardEntity)[0].value; 
                                    } catch (error) {
                                        console.error(error);
                                    }     
                                    mR.set(forwardEntity, { 
                                        properties : new Map(),
                                        label : labelForwardEntity
                                    }) ;
                                }
                                if(! mR.get(forwardEntity)["properties"].get(forwardProperty)) {
                                    let labelForwardProperty="<none>";
                                    try {
                                        labelForwardProperty = response.results.datatypes["labelForwardProperty"].get(forwardProperty)[0].value; 
                                    } catch (error) {
                                        console.error(error);
                                    }     
                                    mR.set( forwardEntity,
                                        mR.get(forwardEntity).merge({ 
                                            link : {
                                                label : labelForwardProperty
                                            } 
                                        })
                                        );
                                }
                            }
                            successCallback(mR);
                        }
                    ).catch( (e : Error) => { failureCallback(e) });
            } else {
                successCallback( { })
            }
       })
    }
}