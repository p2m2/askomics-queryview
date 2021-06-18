const disovery_module = require('@p2m2/discovery')
const { SWDiscovery } = disovery_module; 

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

    /* 
    * Structure Node to return
       {
            id: Numeric,
            focus: String, 
            label: String,
            uri : String,
            suggested: Boolean (true), 
            selected: Boolean (false),
       }
    * 
    * in uri : String 
    * @return List(Object(node : Node, links : List(Link)))
    */

    abstract forwardEntities(discovery : typeof SWDiscovery,uri : string) : typeof SWDiscovery ;

}

