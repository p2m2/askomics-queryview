
import { SWDiscovery,URI, QueryVariable} from '@p2m2/discovery'
import { AskOmicsViewNode } from './types'
import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestAskOmics extends StrategyRequestAbstract {

    askomics_prefix : string = "http://askomics.org/internal/"
    config_endp  : string

    constructor(config_endp : string) {
        super();
        console.log(" ============ StrategyRequestAskOmics ============ ") ;
        this.config_endp = config_endp
    }

    forwardEntities(discovery : SWDiscovery,current: AskOmicsViewNode) : SWDiscovery {
        console.log("AskOmics -> forwardEntities");
        console.log("---------");
        const focus : string = discovery.focus()

        return discovery
                .isObjectOf(new URI("rdf:type"),"instanceEntity")
                  .isSubjectOf(new QueryVariable("forwardProperty"))
                  .focus(focus)
                    .isObjectOf(new URI("rdfs:domain"),"forwardProperty")
                      .isA(this.askomics_prefix+"AskomicsRelation")
                      .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelForwardProperty")
                    .isSubjectOf(new URI("rdfs:range"),"forwardEntity")
                    .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelForwardEntity")  
    }
}