import {URI} from "@p2m2/discovery" ;
import StrategyRequestAbstract from './StrategyRequestAbstract.js'



export default class StrategyRequestAskOmics extends StrategyRequestAbstract {

    constructor() {
        super();
        console.log(" ============ StrategyRequestAskOmics ============ ") ;
    }

    static forwardEntities(discovery,uri) {
        console.log("AskOmics -> forwardEntities");
        let focusId = discovery.focus();

        return discovery
            .isSubjectOf(URI("rdf:type"),"typeOfFocus")
              .isObjectOf(URI("rdf:domain"),"forwardProperty")
                .isSubjectOf(URI("rdf:range"),"typeOfFocusentityForward") ;
    }
}