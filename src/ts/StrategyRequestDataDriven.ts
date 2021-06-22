import {SWDiscovery,URI,QueryVariable,Literal} from '@p2m2/discovery'
import { AskOmicsViewNode } from './types'

import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestDataDriven extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestDataDriven ============ ") ;
    }

    forwardEntities(discovery : SWDiscovery,current: AskOmicsViewNode) : SWDiscovery {
        return discovery
          .isObjectOf(new URI("rdf:type"))
           .isSubjectOf(new QueryVariable("forwardProperty"))
            .isSubjectOf(new URI("rdf:type"),"forwardEntity")
             .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelForwardEntity")       
     .focus("forwardProperty")
       .filter.notEqual(new URI("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"))
       .filter.notEqual(new URI("http://www.w3.org/2000/01/rdf-schema#domain"))
       .filter.notEqual(new URI("http://www.w3.org/2000/01/rdf-schema#range"))
       .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelForwardProperty");
    }
}