import { NodeState , NodeType, LinkType, AskOmicsViewNode, AskOmicsViewLink } from './types'
import RequestManager from './RequestManager'

export type ViewNode = {
    id     : String,
    uri    : String,
    label  : String,
    state_n  : NodeState,
    type   : NodeType
}

export type ViewLink = {
    id     : String,
    uri    : String,
    label  : String,
    source : ViewNode,
    target : ViewNode,
    state_n  : NodeState,
    type   : LinkType
}

interface Graph3DJS { 
    nodes : ViewNode[], 
    links : ViewLink[] 
}

export default class UserIncrementManager {

    static clickNodeForward( request : RequestManager ,  n: AskOmicsViewNode ) : Promise<[Object[],Object[]]> {
            return new Promise((successCallback, failureCallback) => {
                request.forwardEntities(n).then( r => {
                    const nodes : Object[] = [] ;
                    const links : Object[] = [] ;
                    r.forEach((value, key) => {
                        const v = Object.assign({},value) ;
                        if (value instanceof AskOmicsViewNode) {
                            nodes.push(v);
                        } else if (value instanceof AskOmicsViewLink) {
                            links.push(v);
                        }
                        });
                        successCallback([nodes,links])
                    });
                });
    }


    static setConcrete( toShape: AskOmicsViewNode , graph : Graph3DJS ) : Graph3DJS {
        
        if ( toShape.state_n != NodeState.SUGGESTED ) {
            console.warn("Can not concrete this node ",JSON.stringify(toShape));
            return graph
        }    

        
        
        graph.links = graph.links.map(
            (l : ViewLink )=> {
                if ( (l.state_n == NodeState.SUGGESTED) && (l.source.id == toShape.id || l.target.id == toShape.id) ) {
                    l.state_n = NodeState.CONCRETE
                }
                return l 
            })

        graph.nodes = graph.nodes.map(
            (n : ViewNode )=> {
                if ( n.state_n == NodeState.SELECTED ) n.state_n = NodeState.CONCRETE
                if ( n.id == toShape.id ) n.state_n = NodeState.SELECTED
                return n
            })
        
        
        return graph 

    }

    static removeSuggestion(graph : Graph3DJS) : Graph3DJS {
        graph.nodes = graph.nodes.filter( n => n.state_n != NodeState.SUGGESTED )
        graph.links = graph.links.filter( l => l.state_n != NodeState.SUGGESTED )
        return graph
    }

}