import {AskOmicsViewNode, AskOmicsViewLink, ObjectState, DatatypeLiteral } from '@/ts/types'
import RequestManager from './RequestManager';

interface GraphBuilderExpr {
    nodes:Array<AskOmicsViewNode>;
    links:Array<AskOmicsViewLink>;
}


export class GraphBuilder {
    constructor() {}

    static defaultGraph(rm : RequestManager) : any {
        
        const n = AskOmicsViewNode.something(ObjectState.CONCRETE)
        n.focus = rm.getFocus()

        return {
            nodes : [n],
            links : []
        }
    }

    
    /**
     * build graph from Request Manager (discovery)
     */
    static build3DJSGraph(rm : RequestManager) : GraphBuilderExpr {
        
        const graph : GraphBuilderExpr = {
            nodes : [],
            links : []
        }

        rm.getDiscovery().browse(
            (node : any, deep : Number) => {
                console.log("-- browse -- ")
                console.log(node)
                switch(node.$type) {
                    case "inrae.semantic_web.node.Root" : {
                        console.log("Root -> nothing to do")
                        const n = AskOmicsViewNode.something(ObjectState.CONCRETE)
                        n.focus = rm.getFocus()
                        graph.nodes.push(n)
                        break
                    }
                    case "inrae.semantic_web.node.Something" : {
                        
                        break
                    }
                    default : {
                        console.error(" devel erro => todo - manage "+node.$type)
                    }
                }
            }
        )
        console.log("----------------------------------------------")
        console.log(graph)

        return graph
    }

     /**
     * build graph from Request Manager (discovery)
     */
      static buildAttributesBox(rm : RequestManager) : Promise< Object[]> {
        const lAttributeBox :  Object[] = [] ;
        console.log("focus:",focus)
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