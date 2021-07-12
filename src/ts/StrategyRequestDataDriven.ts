import {SWDiscovery,URI,QueryVariable,Literal, SWDiscoveryConfiguration} from '@p2m2/discovery'
import { AskOmicsViewNode, NodeType } from './types'

import StrategyRequestAbstract from './StrategyRequestAbstract'



export default class StrategyRequestDataDriven extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestDataDriven ============ ") ;
    }

    

    attributeList(discovery : any,focus: string) : any {
    
      return discovery
              .focus(focus)
              .isLinkTo(new QueryVariable("value"),"property")
              .root()
              .something("value")
                  .filter.isLiteral
                    .focus("property")
                    .datatype(new URI("rdfs#label"),"labelProperty")
    }

    forwardEntities(discovery : any,config_rdf : string,current: AskOmicsViewNode) : any {

        return discovery
           .isSubjectOf(new QueryVariable("property"))
            .isSubjectOf(new URI("rdf:type"),"entity")
             .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("rdfs#label"),"labelEntity")       
     .focus("property")
       .filter.notEqual(new URI("rdf:type"))
       .filter.notEqual(new URI("rdfs#domain"))
       .filter.notEqual(new URI("rdfs#range"))
       .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("rdfs:label"),"labelProperty");
    }

    backwardEntities(discovery : any,config_rdf : string,current: AskOmicsViewNode) : any {
        return discovery
            .filter.isUri
             .isObjectOf(new QueryVariable("property"))
            
            .isSubjectOf(new URI("rdf:type"),"entity")
             .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
            .datatype(new URI("rdfs:label"),"labelEntity")       
          .focus("property")
            .filter.notEqual(new URI("rdf:type"))
            .filter.notEqual(new URI("rdfs:domain"))
            .filter.notEqual(new URI("rdfs:range"))
            .filter.not.strStarts(new Literal("http://www.openlinksw.com/"))
                    .datatype(new URI("rdfs#label"),"labelProperty");
    }
}