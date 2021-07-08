import {QueryVariable, SWDiscovery, SWDiscoveryConfiguration, URI} from '@p2m2/discovery'
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

    getDatatypesWithProperty(config_rdf : string,property: string ) : Promise<string[]> {

        return new Promise((successCallback, failureCallback) => {
            new SWDiscovery(SWDiscoveryConfiguration
                .setConfigString(config_rdf))
                .something()
                    .isSubjectOf(new URI(property),"valueL")
                    .select("valueL")
                    .limit(20)
                    .commit()
                    .raw()
                    .then(
                        (response : any) => {
                                try {
                                    const t = [...new Set(response.results.bindings.map( (id : any) => id["valueL"].datatype))];
                                    if(t[0]) {
                                        successCallback([property,t[0] as string])
                                    } else {
                                        // if datatype not defined, by default is string
                                        successCallback([property,"xsd:string"])
                                    }
                                } catch(e) {
                                    failureCallback(e)
                                }
                    })
            })
    }

    getDatatypes(config_rdf : string,listUriDatatypeProperty: string[] ) : Promise<Map<string,string>> {
        const listUriDatatypePropertyClean = [...new Set(listUriDatatypeProperty)]
        const results : Map<string,string> = new Map()
        return new Promise((successCallback, failureCallback) => {
            Promise.all(listUriDatatypePropertyClean.map(property => this.getDatatypesWithProperty(config_rdf,property)))
            .then(
                allPairPropertyDatatype => {
                    allPairPropertyDatatype.map(
                        PropertyDatatype => results.set(PropertyDatatype[0],PropertyDatatype[1])
                    )
                    successCallback(results)
                })
            .catch(e => { 
                failureCallback(e) 
            } )
        })
    }

    abstract attributeList(discovery : any,config_rdf : string,current: AskOmicsViewNode) : any

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

    abstract forwardEntities(discovery : any,config_rdf : string,current: AskOmicsViewNode) : any

    abstract backwardEntities(discovery : any,config_rdf : string,current: AskOmicsViewNode) : any

}

