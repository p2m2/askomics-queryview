import {AskOmicsViewNode, AskOmicsViewLink, ObjectState } from '@/ts/types'
import RequestManager from './RequestManager';

interface GraphBuilderExpr {
    nodes:Array<AskOmicsViewNode>;
    links:Array<AskOmicsViewLink>;
}


export class GraphBuilder {
    constructor() {}

    static defaultGraph() : any {
        return {
            nodes : [ AskOmicsViewNode.something(ObjectState.CONCRETE) ],
            links : []
        }
    }

    
    /**
     * build graph from Request Manager (discovery)
     */
    static build3DJSGraph(rm : RequestManager) : any {
        
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
                        graph.nodes.push(AskOmicsViewNode.something(ObjectState.CONCRETE))
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
}