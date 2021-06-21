
import { SWDiscovery,URI} from '@p2m2/discovery'

import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestAskOmics extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestAskOmics ============ ") ;
    }
    //"forwardProperty","forwardEntity","labelForwardEntity","labelForwardProperty"
    forwardEntities(discovery : SWDiscovery) : SWDiscovery {
        console.log("AskOmics -> forwardEntities");
        console.log("---------");

        // get current class uri
        
        //
        return discovery
                .isSubjectOf(new URI("rdf:type"),"typeOfFocus")
                .isObjectOf(new URI("rdf:domain"),"forwardProperty")
                    .isSubjectOf(new URI("rdf:range"),"typeOfFocusentityForward") ;
    }
}