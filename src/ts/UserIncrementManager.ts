import { ObjectState , Graph3DJS, AskOmicsViewNode, AskOmicsViewLink, NodeType, DatatypeLiteral, ViewLink3DJS, ViewNode3DJS } from './types'
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


    static setShapeNode(request :RequestManager, toShape: ViewNode3DJS , graph : Graph3DJS ) : Graph3DJS {
        
        /**
         * nothing todo is node is selected 
         */

         if ( toShape.state_n == ObjectState.SELECTED ) return graph


        /**
         * Select Node if node is concrete and exit .
         */
        if ( toShape.state_n == ObjectState.CONCRETE ) {
            

            if ( toShape.focus && toShape.focus.length>0  ) {
                graph.nodes = graph.nodes.map(
                    (n : ViewNode3DJS )=> {
                        if ( n.id == toShape.id ) {
                            n.state_n = ObjectState.SELECTED
                            request.setFocus(toShape.focus)
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
            (l : ViewLink3DJS )=> {
                
                if ( (l.state_n == ObjectState.SUGGESTED) && (l.source.id == toShape.id || l.target.id == toShape.id) ) {
                    l.state_n = ObjectState.CONCRETE
                    
                    /* ------------ */
                    /* update model */
                    /* ------------ */
                    const focus : string = request.update(toShape,l)

                    /* ------------ */
                    /* FOCUS        */
                    /* ------------ */
                    graph.nodes = graph.nodes.map(
                        (n : ViewNode3DJS )=> {
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
            (n : ViewNode3DJS )=> {
                if ( n.id == toShape.id ) {
                    n.state_n = ObjectState.SELECTED
                }
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