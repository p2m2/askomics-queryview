import { ObjectState , Graph3DJS, AskOmicsViewNode, AskOmicsViewLink, NodeType, DatatypeLiteral, ViewLink3DJS, ViewNode3DJS } from './types'
import RequestManager from './RequestManager'
import { Vue } from 'vue-class-component'

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

    static clickNodeBackward( request : RequestManager ,  n: AskOmicsViewNode ) : Promise<[Object[],Object[]]> {
        return new Promise((successCallback, failureCallback) => {
            request.backwardEntities(n).then( r => {
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


    static setShapeNode(vue : Vue, request :RequestManager, toShape: ViewNode3DJS , graph : Graph3DJS ) : Graph3DJS {
        
        /**
         * Exit if node is not suggested.
         */
        if ( toShape.state_n != ObjectState.SUGGESTED ) {
            
            if ( toShape.focus && toShape.focus.length>0  ) {
                toShape.state_n = ObjectState.SELECTED
                request.setFocus(toShape.focus)
                vue.$emit('selectedNodeId',request.getDiscovery().focus())
            }
           
            return graph
        }    

        /**
         * shape link
         */
        graph.links = graph.links.map(
            (l : ViewLink3DJS )=> {
                if ( (l.state_n == ObjectState.SUGGESTED) && (l.source.id == toShape.id || l.target.id == toShape.id) ) {
                    l.state_n = ObjectState.CONCRETE
                    /* ------------ */
                    /* update model */
                    /* ------------ */
                    const focus : string = request.update(toShape,l)
                    toShape.focus = focus 
                    vue.$emit('selectedNodeId',focus)
                }
                return l 
            })
        /**
         * shape node
         */
        graph.nodes = graph.nodes.map(
            (n : ViewNode3DJS )=> {
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
    /*

    static attributeList(request :RequestManager, current: AskOmicsViewNode ) : Promise<Object[]> {
        console.log("go :",current)

        return new Promise((successCallback, failureCallback) => {
            if (Object.keys(current).length == 0) {
                successCallback([])
            } else {
              //  console.log(current.type)
                if(current.type == NodeType.SOMETHING) {
                    console.log("get everything attributes")
                } else {
                    
                    request.attributeList(current).then(
                        response => {
                            successCallback(response.map( (obj : DatatypeLiteral)  => obj.getObject()))
                        }
                    ).catch(e => {failureCallback(e)})
                }
            }
        })
    } */

}