
const disovery_module = require('@p2m2/discovery')
const { SWDiscovery, URI } = disovery_module; 

import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestAskOmics extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestAskOmics ============ ") ;
    }

    forwardEntities(discovery : typeof SWDiscovery,uri : string) : typeof SWDiscovery {
        console.log("AskOmics -> forwardEntities");

        return discovery
            .isSubjectOf(URI("rdf:type"),"typeOfFocus")
              .isObjectOf(URI("rdf:domain"),"forwardProperty")
                .isSubjectOf(URI("rdf:range"),"typeOfFocusentityForward") ;
    }
}