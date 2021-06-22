import { ObjectState , NodeType, LinkType, AskOmicsViewNode, AskOmicsViewLink } from './types'
import RequestManager from './RequestManager'

export type ViewNode = {
    id     : string,
    uri    : string,
    label  : string,
    state_n  : ObjectState,
    type   : NodeType
}

export type ViewLink = {
    id     : string,
    uri    : string,
    label  : string,
    source : ViewNode,
    target : ViewNode,
    state_n  : ObjectState,
    type   : LinkType
}

interface Graph3DJS { 
    nodes : ViewNode[], 
    links : ViewLink[] 
}

export default class UserIncrementManager {

    static releaseSelectedObject(graph : Graph3DJS) {
        graph.nodes.filter( n => n.state_n == ObjectState.SELECTED).map( n => { n.state_n = ObjectState.CONCRETE } )
        graph.links.filter( n => n.state_n == ObjectState.SELECTED).map( n => { n.state_n = ObjectState.CONCRETE } )
    }

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


    static setConcrete(toShape: AskOmicsViewNode , graph : Graph3DJS ) : Graph3DJS {
        
        /**
         * Exit if node is not suggested.
         */
        if ( toShape.state_n != ObjectState.SUGGESTED ) {
            console.warn("Can not concrete this node ",JSON.stringify(toShape));
            return graph
        }    

        /**
         * shape link
         */
        graph.links = graph.links.map(
            (l : ViewLink )=> {
                if ( (l.state_n == ObjectState.SUGGESTED) && (l.source.id == toShape.id || l.target.id == toShape.id) ) {
                    l.state_n = ObjectState.CONCRETE
                }
                return l 
            })
        /**
         * shape node
         */
        graph.nodes = graph.nodes.map(
            (n : ViewNode )=> {
                if ( n.state_n == ObjectState.SELECTED ) n.state_n = ObjectState.CONCRETE
                if ( n.id == toShape.id ) n.state_n = ObjectState.SELECTED
                return n
            })
        
        
        return graph 

    }

    static removeSuggestion(graph : Graph3DJS) : Graph3DJS {
        graph.nodes = graph.nodes.filter( n => n.state_n != ObjectState.SUGGESTED )
        graph.links = graph.links.filter( l => l.state_n != ObjectState.SUGGESTED )
        return graph
    }

}