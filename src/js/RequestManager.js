import {SWDiscoveryConfiguration, SWDiscovery} from "@p2m2/discovery" ;
import StrategyRequestAskOmics from "./StrategyRequestAskOmics.js"
import StrategyRequestDataDriven from "./StrategyRequestDataDriven.js"

export default class RequestManager {

    constructor() {
        this.discovery = undefined // new discovery ;
        // by default
        this.strategy = StrategyRequestAskOmics ;
    }

    startWithConfiguration(json) {
        let config = SWDiscoveryConfiguration.setConfigString(json) ;
        this.discovery = SWDiscovery(config).something();
    }

    setAskOmicsStrategy() {
        this.strategy = StrategyRequestAskOmics ;
    }

    setDataDrivenStrategy() {
        this.strategy = StrategyRequestDataDriven ;
    }

    focus() {
        if (this.strategy) 
            this.discovery.focus() ;
        else
            undefined ;
    }

    focus(idFocus) {
        if (this.strategy) 
            this.discovery.focus(idFocus) ;
    }

    forwardEntities(uri) {
        return new Promise((successCallback, failureCallback) => {
            if (this.strategy) {
                this.strategy
                    .forwardEntities(this.discovery,uri)
                    .console()
                    .select("forwardProperty","forwardEntity")
                    .commit()
                    .raw()
                    .then(
                        response => {
                            let mR = new Map()
                            for (let i=0;i<response.results.bindings.length;i++) {
                                let forwardProperty=response.results.bindings[i]["forwardProperty"].value;
                                let forwardEntity=response.results.bindings[i]["forwardEntity"].value;
                                if (!mR[forwardProperty]) {
                                    mR[forwardProperty] = new Map() ;
                                }
                                if(! mR[forwardProperty][forwardEntity]) {
                                    mR[forwardProperty][forwardEntity] = { label : "Ok" } ;
                                }
                            // let label=response.results.datatypes["label"][study][0].value; 
                            }
                            successCallback(mR);
                        }
                    ).catch( e => { failureCallback(e) });
            } else {
                successCallback( { })
            }
       })
    }
}