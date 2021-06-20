
import { SWDiscovery,URI} from '@p2m2/discovery'

import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestAskOmics extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestAskOmics ============ ") ;
    }

    forwardEntities(discovery : SWDiscovery,uri : string) : SWDiscovery {
        console.log("AskOmics -> forwardEntities");
        console.log("---------");
        return discovery.something("h1")
            .isSubjectOf(new URI("rdf:type"),"typeOfFocus")
              .isObjectOf(new URI("rdf:domain"),"forwardProperty")
                .isSubjectOf(new URI("rdf:range"),"typeOfFocusentityForward") ;
    }
}