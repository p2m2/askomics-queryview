import {AskOmicsViewNode, ObjectState } from '@/ts/types'

export class GraphBuilder {
    constructor() {}

    static defaultGraph() : any {
        return {
            nodes : [ AskOmicsViewNode.something(ObjectState.CONCRETE).getObject() ],
            links : []
        }
    }
    /**
     * build graph from Request Manager (discovery)
     */
    static build3DJSGraph(discovery : any) : any {
        console.log(discovery)
        discovery.browse(
            (node : any, deep : Number) => {
                console.log("browse:",node);
            }
        )
    }
}