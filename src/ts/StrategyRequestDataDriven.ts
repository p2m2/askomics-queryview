import {SWDiscovery,URI,QueryVariable,Literal, SWDiscoveryConfiguration} from '@p2m2/discovery'
import { AskOmicsViewNode } from './types'

import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestDataDriven extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestDataDriven ============ ") ;
    }

    

    attributeList(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery {
        const disco : SWDiscovery = current.focus ?  discovery.focus(current.focus)  : discovery.root().something()

        return disco
                .isSubjectOf(new QueryVariable("property"))
                  .filter.isLiteral
                    .focus("property")
                    .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelProperty");
    }

    forwardEntities(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery {

        const disco : SWDiscovery = current.focus ?  discovery.focus(current.focus)  : discovery.root().something()

        return disco
           .isSubjectOf(new QueryVariable("property"))
            .isSubjectOf(new URI("rdf:type"),"entity")
             .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelEntity")       
     .focus("property")
       .filter.notEqual(new URI("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"))
       .filter.notEqual(new URI("http://www.w3.org/2000/01/rdf-schema#domain"))
       .filter.notEqual(new URI("http://www.w3.org/2000/01/rdf-schema#range"))
       .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelProperty");
    }

    backwardEntities(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery {
        const disco : SWDiscovery = current.focus ?  discovery.focus(current.focus)  : discovery.root().something()
      
        return disco
            .filter.isUri
             .isObjectOf(new QueryVariable("property"))
            
            .isSubjectOf(new URI("rdf:type"),"entity")
             .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelEntity")       
          .focus("property")
            .filter.notEqual(new URI("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"))
            .filter.notEqual(new URI("http://www.w3.org/2000/01/rdf-schema#domain"))
            .filter.notEqual(new URI("http://www.w3.org/2000/01/rdf-schema#range"))
            .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
                    .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelProperty");
    }
}