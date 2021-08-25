import { ObjectState , Graph3DJS, AskOmicsViewNode, AskOmicsViewLink } from './types'
import RequestManager from './RequestManager'
import { Vue } from 'vue-class-component'

export default class UserIncrementManager {

    static releaseSelectedObject(graph : Graph3DJS) : Graph3DJS {

        graph.nodes = graph.nodes.map( n => { 
            if (n.state_n == ObjectState.SELECTED) n.state_n = ObjectState.CONCRETE ;
            return n
        })
        graph.links = graph.links.map( l => { 
            if (l.state_n == ObjectState.SELECTED) l.state_n = ObjectState.CONCRETE ;
            return l
        })

        return graph
    }
    /*

    static setSelectedNode(graph : Graph3DJS, select : AskOmicsViewNode ) : Graph3DJS {
        if ( select ) {
            graph.nodes = graph.nodes.map( n => { 
                if (n.id == select.id) n.state_n = ObjectState.SELECTED ;
                return n
            })
        }

        return graph
    }*/

    static clickNodeForward( vue : Vue, request : RequestManager ,  n: AskOmicsViewNode ) : Promise<[Object[],Object[]]> {
            
        vue.$emit('requestManagerBusy',JSON.stringify(true))
        
        return new Promise((successCallback, failureCallback) => {
                request.forwardEntities(vue,n).then( r => {
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
                        vue.$emit('requestManagerBusy',JSON.stringify(false))
                        successCallback([nodes,links])
                    })
                    .catch(e => {
                        vue.$emit('requestManagerBusy',JSON.stringify(false))
                        failureCallback(e)
                    });
                });
    }

    static clickNodeBackward( vue : Vue, request : RequestManager ,  n: AskOmicsViewNode ) : Promise<[Object[],Object[]]> {
        
        vue.$emit('requestManagerBusy',JSON.stringify(true))

        return new Promise((successCallback, failureCallback) => {
            request.backwardEntities(vue,n).then( r => {
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
                    vue.$emit('requestManagerBusy',JSON.stringify(false))
                    successCallback([nodes,links])
                })
                .catch(e => {
                    vue.$emit('requestManagerBusy',JSON.stringify(false))
                    failureCallback(e)
                });
            });
}


    static setShapeNode(request :RequestManager, toShape: AskOmicsViewNode) : Object {
        
        /**
         * nothing todo is node is selected 
         */

         if ( toShape.state_n == ObjectState.SELECTED ) return request.getGraph()

        const graph = request.getGraph()
        /**
         * Select Node if node is concrete and exit .
         */
        if ( toShape.state_n == ObjectState.CONCRETE ) {

            if ( toShape.focus && toShape.focus.length>0  ) {

                graph.nodes = graph.nodes.map(
                    (n : AskOmicsViewNode )=> {
                        if ( n.id == toShape.id ) {
                            n.state_n = ObjectState.SELECTED
                            request.setFocus(n.focus)
                        }
                        return n
                    })
            }

            return graph
        }
        
        
        /**
         * shape link/node if suggested
         */
        
        graph.links = graph.links.map(
            (l : AskOmicsViewLink )=> {

                if ( (l.state_n == ObjectState.SUGGESTED) && (l.source == toShape.id || l.target == toShape.id) ) {
                    l.state_n = ObjectState.CONCRETE
                   
                    /* ------------ */
                    /* update model */
                    /* ------------ */
                    const focus : string = request.setNewNodeWithLink(toShape,l)

                    /* ------------ */
                    /* FOCUS        */
                    /* ------------ */
                    graph.nodes = graph.nodes.map(
                        (n : AskOmicsViewNode )=> {
                            if ( n.id == toShape.id ) n.focus = focus
                            return n 
                        })
                }
                return l 
            })
        /**
        * SELECTED 
        */
         graph.nodes = graph.nodes.map(
            (n : AskOmicsViewNode )=> {
                if ( n.id == toShape.id ) {
                    n.state_n = ObjectState.SELECTED
                }
                return n 
            }) 
        
        return graph 

    }

    static removeSuggestion(request :RequestManager) {
        const graph = request.getGraph()

        graph.nodes = graph.nodes.filter( n => n.state_n != ObjectState.SUGGESTED )
        graph.links = graph.links.filter( l => l.state_n != ObjectState.SUGGESTED )
        
        return graph
    }

}