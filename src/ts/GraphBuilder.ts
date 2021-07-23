import {AskOmicsViewNode, AskOmicsViewLink, AskOmicsViewAttributes } from '@/ts/types'
import RequestManager from './RequestManager';

interface GraphBuilderExpr {
    nodes:Array<AskOmicsViewNode>;
    links:Array<AskOmicsViewLink>;
}


export class GraphBuilder {
    constructor() {}

    static emptyGraph() : any {
        return  { nodes : [], links : [] }
    }
    
    /**
     * build graph from Request Manager (discovery)
     */
    static build3DJSGraph(rm : RequestManager) : GraphBuilderExpr {
        
        const graph : GraphBuilderExpr = GraphBuilder.emptyGraph()

        rm.getDiscovery().browse(
            (node : any, deep : Number) => {
                console.log("-- browse -- ")
                console.log(node)
                if( node.decorations ) {
                    if (node.decorations.node)
                      graph.nodes.push(JSON.parse(node.decorations.node))
                    if (node.decorations.link)
                        graph.links.push(JSON.parse(node.decorations.link))
                }
            }
        )

        console.log("----------------------------------------------")
        console.log(graph)
        if ( graph.nodes.length <= 0 &&  graph.links.length <= 0 ) {
            throw Error("Can not handle empty graph")
        } else {
            return graph
        }
    }

     /**
     * build graph from Request Manager (discovery)
     */
      static buildAttributesBox(rm : RequestManager) : Promise< Object[]> {
        const lAttributeBox :  Object[] = [] ;
        
        return new Promise((successCallback, failureCallback) => {
            rm.getDiscovery().browse(
                (node : any, deep : Number) => {
                    if ( node.idRef == rm.getFocus()) {
                        const nodeInst = JSON.parse(node.decorations.node)
                        const decorations : Map<String,AskOmicsViewAttributes> = 
                            node.decorations.attributes ? 
                                new Map(JSON.parse(node.decorations.attributes)) as Map<String,AskOmicsViewAttributes> : new Map() 
                        

                        rm.attributeList(rm.getFocus()).then(
                            response => {
                                const keyUri = "uri"
                               
                                /* special attribute box -> URI */
                                const uriBox = decorations.has(keyUri) ? 
                                    AskOmicsViewAttributes.from(decorations.get(keyUri)!) : new AskOmicsViewAttributes(keyUri,nodeInst.uri,"uri",nodeInst.label)
                                
                                /* attribute from RDF store*/
                                const listAttributes : Object[] = 
                                
                                response
                                  .map( (obj : AskOmicsViewAttributes)  =>  {
                                    if (  decorations.has(obj.uri) ) {
                                        return AskOmicsViewAttributes.from(decorations.get(obj.uri)!)
                                    } 
                                    
                                    return obj
                                  })
                                  .map( (obj : AskOmicsViewAttributes )  =>  obj.getObject() )
                                  
                                  listAttributes.unshift(uriBox)

                                successCallback(listAttributes)
                            }
                        ).catch(e => {failureCallback(e)})
                    }
                }
            )})
    }
}