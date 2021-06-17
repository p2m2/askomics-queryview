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
export default class StrategyRequestAbstract {
    
    constructor() {
        if (this.constructor === AbstractConfig) {
          throw new TypeError('Abstract class "StrategyRequestAbstract" cannot be instantiated directly');
        }
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

    // forwardEntities(uri) 

}

