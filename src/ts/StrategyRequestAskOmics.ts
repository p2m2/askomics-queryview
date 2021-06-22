
import { SWDiscovery,URI, SWDiscoveryConfiguration} from '@p2m2/discovery'
import { NodeType, AskOmicsViewNode } from './types'
import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestAskOmics extends StrategyRequestAbstract {

    askomics_prefix : string = "http://askomics.org/internal/"
    config_endp  : string

    constructor(config_endp : string) {
        super();
        console.log(" ============ StrategyRequestAskOmics ============ ") ;
        this.config_endp = config_endp
    }

    forwardEntities(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery {

        let d : SWDiscovery = (new SWDiscovery(SWDiscoveryConfiguration.setConfigString(config_rdf)).something());
        
        if ( current.type != NodeType.SOMETHING ) d = d.set(new URI(current.uri))
        
        return d.isObjectOf(new URI("rdfs:domain"),"property")
                      .isA(this.askomics_prefix+"AskomicsRelation")
                      .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelProperty")
                    .isSubjectOf(new URI("rdfs:range"),"entity")
                    .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelEntity")  
    }

    backwardEntities(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery {
        let d : SWDiscovery = (new SWDiscovery(SWDiscoveryConfiguration.setConfigString(config_rdf)).something());
        
        if ( current.type != NodeType.SOMETHING ) d = d.set(new URI(current.uri))
        
        return d.isObjectOf(new URI("rdfs:range"),"property")
                      .isA(this.askomics_prefix+"AskomicsRelation")
                      .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelProperty")
                    .isSubjectOf(new URI("rdfs:domain"),"entity")
                    .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelEntity")  
    }
}