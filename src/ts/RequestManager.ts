import { SWDiscoveryConfiguration, SWDiscovery} from '@p2m2/discovery'

import StrategyRequestAbstract from "./StrategyRequestAbstract"
import StrategyRequestAskOmics from "./StrategyRequestAskOmics"
import StrategyRequestDataDriven from "./StrategyRequestDataDriven"

export default class RequestManager {
    config    : string ;
    discovery : SWDiscovery ;
    strategy  : StrategyRequestAbstract ;

    constructor() {
        console.log(" ================= CONSTRUCTOR ===============");
        this.discovery = new SWDiscovery() // new discovery ;
        this.config = ""

       
        // by default
        this.strategy = new StrategyRequestAskOmics() ;
    }

    startWithConfiguration(json : string) {
        console.log(" ================= startWithConfiguration ===============");
        this.config = json 
        const localConf = SWDiscoveryConfiguration.setConfigString(json)
        this.discovery = new SWDiscovery(localConf)//.something()

//        const ssss = new SWDiscovery(config).something().console().getSerializedString;      
//        console.log(ssss);
//        new SWDiscovery(config).setSerializedString(ssss);
        console.log(" ================= FIN ========================= startWithConfiguration ===============");
    }

    setAskOmicsStrategy() {
        this.strategy = new StrategyRequestAskOmics() ;
    }

    setDataDrivenStrategy() {
        this.strategy = new StrategyRequestDataDriven() ;
    }

    getFocus() : any {
        if (this.strategy) 
            this.discovery.focus() ;
        else
            undefined ;
    }

    setFocus(idFocus : string) : void {
        if (this.strategy) 
            this.discovery.focus(idFocus) ;
    }
    forwardEntities(uri : string) {

         
            console.log("=================>>>> RequestManager");
            console.log(this.discovery);
            console.log(this.config);
            this.discovery.something("h1").isObjectOf("bidule");
            
    }

    forwardEntities2(uri : string) {
        return new Promise((successCallback, failureCallback) => {
            console.log(" -----------------------------------    forwardEntities ------------------------------------- ");

            if (this.strategy) {
                console.log("=================>>>> RequestManager");
                console.log(this.discovery);
                console.log(this.config);
                this.discovery.console();

                try {

                    this.strategy
                        .forwardEntities(this.discovery,uri)
                        //.console()
                        .select("forwardProperty","forwardEntity","labelForwardEntity","labelForwardProperty")
                        .commit()
                        .raw()
                        .then(
                            (response) => {
                                console.log("response discovery...........");
                                console.log(response);
                                /*
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
                                */
                            }
                        ).catch( (e : Error) => { failureCallback(e) });
                    } catch ( e ) {
                        console.error(" - Probleme with Strategy -- ");
                        console.error(e);
                    }
            } else {
                successCallback( { })
            }
       })
    }
}