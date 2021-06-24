import {SWDiscovery} from '@p2m2/discovery'
import { AskOmicsViewNode } from './types'
/* 
 - Structure Node 
       {
            id: Numeric, 
            label: String,
            uri : String,
            suggested: Boolean (true), 
            selected: Boolean (false),
       }


- Structure Link    
        {
            source    : Numeric,
            target    : Numeric,
            label     : String,
            suggested : Boolean (true), 
            selected  : Boolean (false), 
            directed  : Boolean (true), 
        }

*/
export default abstract class StrategyRequestAbstract {
    
    constructor() {
    }


    abstract attributeList(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery

    /* 
    * Structure Node to return
       {
            id: Numeric,      /// equiv   uri : String,
            focus: String, 
            label: String,
                              /// pas besoin  suggested: Boolean (true), 
            selected: Boolean (false),
       }
    * 
    * in uri : String 
    * @return List(Object(node : Node, links : List(Link)))
    */

    abstract forwardEntities(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery

    abstract backwardEntities(discovery : SWDiscovery,config_rdf : string,current: AskOmicsViewNode) : SWDiscovery

}

