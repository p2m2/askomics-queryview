import {AskOmicsViewNode, AskOmicsViewLink, AskOmicsViewAttributes } from '@/ts/types'
import RequestManager from './RequestManager';

interface GraphBuilderExpr {
    nodes:Array<AskOmicsViewNode>;
    links:Array<AskOmicsViewLink>;
}


export class GraphBuilder {
    constructor() {}

     /**
     * build graph from Request Manager (discovery)
     */
      static buildAttributesBox(rm : RequestManager) : Promise< Object[]> {
        const lAttributeBox :  Object[] = [] ;
      //  alert("buildAttributesBox")
        return new Promise((successCallback, failureCallback) => {
            rm.getDiscovery().browse(
                (node : any, deep : Number) => {
                    if ( node.idRef == rm.getFocus()) {
                        const decorations  = node.decorations.attributes ? JSON.parse(node.decorations.attributes) : {}
                                //new Map(JSON.parse(node.decorations.attributes)) as Map<String,AskOmicsViewAttributes> : new Map() 
                        
                        rm.attributeList(rm.getFocus()).then(
                            response => {
                                /* attribute from RDF store */
                                const listAttributes : Object[] = 
                                
                                response
                                  .map( (obj : AskOmicsViewAttributes)  =>  {
                                    if (  decorations[obj.uri] ) {
                                        return AskOmicsViewAttributes.from(decorations[obj.uri]!)
                                    } 
                                    
                                    return obj
                                  })
                                  .map( (obj : AskOmicsViewAttributes )  =>  obj.getObject() )
                                  

                                successCallback(listAttributes)
                            }
                        ).catch(e => {failureCallback(e)})
                    }
                }
            )})
    }
}