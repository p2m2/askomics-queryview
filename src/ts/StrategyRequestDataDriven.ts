const disovery_module = require('@p2m2/discovery')
const { SWDiscovery,URI,QueryVariable,Literal } = disovery_module; 

import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestDataDriven extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestDataDriven ============ ") ;
    }

    forwardEntities(discovery : typeof SWDiscovery,uri : string) : typeof SWDiscovery {
        return discovery
          .isObjectOf(URI("rdf:type"))
           .isSubjectOf(QueryVariable("forwardProperty"))
            .isSubjectOf(URI("rdf:type"),"forwardEntity")
             .filter.not.strStarts(Literal("http://www.openlinksw.com/"))
            .datatype(URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelForwardEntity")       
     .focus("forwardProperty")
       .filter.notEqual(URI("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"))
       .filter.notEqual(URI("http://www.w3.org/2000/01/rdf-schema#domain"))
       .filter.notEqual(URI("http://www.w3.org/2000/01/rdf-schema#range"))
       .filter.not.strStarts(Literal("http://www.openlinksw.com/"))
            .datatype(URI("http://www.w3.org/2000/01/rdf-schema#label"),"labelForwardProperty");
    }
}