import {AskOmicsViewNode, AskOmicsViewLink, ObjectState, DatatypeLiteral } from '@/ts/types'
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
                    console.log("idRef:",node.idRef)
                    if ( node.idRef == rm.getFocus()) {
                        /* TODO : set box if children is set (filter, bind, value, etc....) */
                        console.log("GO")
                        rm.attributeList(rm.getFocus()).then(
                            response => {
                                successCallback(response.map( (obj : DatatypeLiteral)  => obj.getObject()))
                            }
                        ).catch(e => {failureCallback(e)})
                    }
                }
            )})
    }
}