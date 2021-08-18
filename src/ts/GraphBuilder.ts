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
      //  alert("buildAttributesBox")
        return new Promise((successCallback, failureCallback) => {
            rm.getDiscovery().browse(
                (node : any, deep : Number) => {
                    if ( node.idRef == rm.getFocus()) {
                        const nodeInst = JSON.parse(node.decorations.node)
                        //alert(JSON.stringify(node.decorations.attributes))
                        //: Map<String,AskOmicsViewAttributes>
                        const decorations  = node.decorations.attributes ? JSON.parse(node.decorations.attributes) : {}
                                //new Map(JSON.parse(node.decorations.attributes)) as Map<String,AskOmicsViewAttributes> : new Map() 
                       
                       
                        alert(JSON.stringify(decorations))
                        rm.attributeList(rm.getFocus()).then(
                            response => {
                                const keyUri = "uri"
                               
                                /* special attribute box -> URI */
                                let uriBox 
                                
                                if ( decorations[keyUri] ) {
                                    uriBox = AskOmicsViewAttributes.from(decorations[keyUri]!)
                                } else {
                                    uriBox = new AskOmicsViewAttributes(keyUri,"uri","uri",nodeInst.label+" (URI)")
                                }
                              //  alert(uriBox.visible)

                                /* attribute from RDF store */
                                const listAttributes : Object[] = 
                                
                                response
                                  .map( (obj : AskOmicsViewAttributes)  =>  {
                                    console.log(obj.uri)
                                    if (  decorations[obj.uri] ) {
                                        return AskOmicsViewAttributes.from(decorations[obj.uri]!)
                                    } 
                                    
                                    return obj
                                  })
                                  .map( (obj : AskOmicsViewAttributes )  =>  obj.getObject() )
                                  
                                  listAttributes.unshift(uriBox)
                                
                                  console.log(JSON.stringify(listAttributes))

                                successCallback(listAttributes)
                            }
                        ).catch(e => {failureCallback(e)})
                    }
                }
            )})
    }
}