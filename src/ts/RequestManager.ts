import { SWDiscoveryConfiguration, SWDiscovery, URI, SWTransaction} from '@p2m2/discovery'
import { DatatypeLiteral, ViewNode, ViewLink, LinkType, AskOmicsGenericNode, AskOmicsViewNode, AskOmicsViewLink, NodeType, UserConfiguration } from './types'
import StrategyRequestAbstract from "./StrategyRequestAbstract"
import StrategyRequestAskOmics from "./StrategyRequestAskOmics"
import StrategyRequestDataDriven from "./StrategyRequestDataDriven"
import Utils from './utils'

/**
 * Trick . TS inser SWDiscovery inside a Proxy type. Exception occurs whith the first use.
 */
let discovery_map : Map<number,SWDiscovery> ;

function getDiscovery(id : number) : SWDiscovery {
    const d = discovery_map.get(id);
    if ( d )
        return d ;
    return new SWDiscovery();
}
/**
 * end trick
 */

export default class RequestManager {
    id               : number ;
    config           : string ;
    strategy        ?: StrategyRequestAbstract ;
    static idCounter : number  = 0 ;

    constructor(config : UserConfiguration) {
        
        console.log(" ================= CONSTRUCTOR ===============");
        if ( !discovery_map ) {
            discovery_map =  new Map<number,SWDiscovery>() ;
        }

        this.id = RequestManager.idCounter ;
        RequestManager.idCounter++ ;
        this.setDiscovery(new SWDiscovery().something()) ;
        this.config =  `{
            "sources" : [{
            "id"  : "metabolights",
            "url" : "https://metabolights.semantic-metabolomics.fr/sparql"
            }]}`
        this.setConfig(this.config)

        
        switch(config.strategy) {
            case "askomics" : {
                this.setAskOmicsStrategy()
                break
            }
            case "data-driven" : {
                this.setDataDrivenStrategy()
                break
            }
            default : {
                console.warn("strategy unknown : "+config.strategy)
                this.setDataDrivenStrategy()
            }
        }
        /*

        this.config = `{
            "sources" : [{
            "id"  : "`+ "config" +`",
            "url" : "`+ config.endpoint +`"
            }]}`
        console.log(this.config)
        this.setConfig(this.config)*/

    }

    serialized() : string {
        return this.getDiscovery().getSerializedString()
    }

    parse( str : string ) {

        console.log("PARSE==========================================================")
        console.log(str)
        const str2 = '{"config":{"conf":{"sources":[{"id":"metabolights","url":"https://metabolights.semantic-metabolomics.fr/sparql"}]}},"rootNode":{"$type":"inrae.semantic_web.internal.Root","idRef":"14fbbee0-0e31-4237-a5fb-3d45918e57d5","children":[{"$type":"inrae.semantic_web.internal.Something","idRef":"something0","children":[{"$type":"inrae.semantic_web.internal.ObjectOf","idRef":"subject0","term":{"$type":"inrae.semantic_web.rdf.URI","localNameUser":"http://www.w3.org/2000/01/rdf-schema#subClassOf"},"children":[{"$type":"inrae.semantic_web.internal.SubjectOf","idRef":"object0","term":{"$type":"inrae.semantic_web.rdf.URI","localNameUser":"a"},"children":[{"$type":"inrae.semantic_web.internal.Value","term":{"$type":"inrae.semantic_web.rdf.URI","localNameUser":"http://www.w3.org/2000/01/rdf-schema#Class"},"idRef":"9545b000-d636-42f3-ae66-191ecb027303"}]}]}]}]},"fn":["subject0"]}'
        const str3 = '{"config":{"conf":{"sources":[{"id":"metabolights","url":"https://metabolights.semantic-metabolomics.fr/sparql"}]}},"rootNode":{"$type":"inrae.semantic_web.internal.Root","idRef":"46bd4dc7-e7bb-4102-b75a-21b36b6a9a11","children":[{"$type":"inrae.semantic_web.internal.Something","idRef":"something0","children":[{"$type":"inrae.semantic_web.internal.SubjectOf","idRef":"object0","term":{"$type":"inrae.semantic_web.rdf.URI","localNameUser":"http://www.w3.org/2000/01/rdf-schema#subClassOf"},"children":[{"$type":"inrae.semantic_web.internal.SubjectOf","idRef":"object2","term":{"$type":"inrae.semantic_web.rdf.URI","localNameUser":"a"},"children":[{"$type":"inrae.semantic_web.internal.Value","term":{"$type":"inrae.semantic_web.rdf.URI","localNameUser":"http://www.w3.org/2000/01/rdf-schema#Class"},"idRef":"4a0b84ca-887e-4bea-9e13-de25cfaa1b13"}]}]}]}]},"fn":["object0"]}'
        console.log(str2)
        /****
         * 
         * 
         * TODO : EN ATTENTE DE SERIALIZATION DISCOVERY !!!!!
         * 
         * 
         */
        
        //console.log(new SWDiscovery(this.config).something("hello").getSerializedString)
        
        //const str4 = new SWDiscovery(this.config).something("hello").getSerializedString()

        //this.setDiscovery(new SWDiscovery(this.config).setSerializedString(str4))
        //const t : SWDiscovery = new SWDiscovery(this.config).setSerializedString(str4)
        //t.console()
        //this.setDiscovery(new SWDiscovery(this.config).setSerializedString(str3));
        //alert("OK")
        //alert(this.getDiscovery())
      
    }


    setDiscovery(disco : SWDiscovery) : void  {
        discovery_map.set(this.id,disco) // new discovery ;
    } 

    getDiscovery() : SWDiscovery {
        return getDiscovery(this.id)
    }

    setConfig(json : string) {
        this.config = json 
        const localConf = SWDiscoveryConfiguration.setConfigString(json)
        this.setDiscovery(new SWDiscovery(localConf).something());
    }

    update(node : ViewNode, link : ViewLink ) : string {

        const snd_node = link.source.id == node.id ? link.source : link.target
        const d : SWDiscovery = this.getDiscovery()

        switch(link.type) { 
            case LinkType.FORWARD_PROPERTY: { 
                this.setDiscovery(d.isSubjectOf(new URI(link.uri)).isA(new URI(snd_node.uri)))
               break; 
            } 
            case LinkType.BACKWARD_PROPERTY: { 
                this.setDiscovery(d.isObjectOf(new URI(link.uri)).isA(new URI(snd_node.uri)))
               break; 
            } 
            case LinkType.IS_A: { 
                this.setDiscovery(d.isA(new URI(snd_node.uri)))
               break; 
            } 
            default: { 
               console.error("unkown action :"+JSON.stringify(link))
               break; 
            } 
         }
         
         return this.getDiscovery().focus() 
    }
/*
    startWithConfiguration(json : string) {
        console.log(" ================= startWithConfiguration ===============");
        console.log(json);
        this.config = json 
        
       // this.getDiscovery().isObjectOf("test").console() ;
        
//        const ssss = new SWDiscovery(config).something().console().getSerializedString;      
//        console.log(ssss);
//        new SWDiscovery(config).setSerializedString(ssss);
        console.log(" ================= FIN ========================= startWithConfiguration ===============");
    }*/

    setAskOmicsStrategy() {
        console.log(" -- setAskOmicsStrategy -- ");
        this.strategy = new StrategyRequestAskOmics(this.config) ;
    }

    setDataDrivenStrategy() {
        console.log(" -- setDataDrivenStrategy -- ");
        this.strategy = new StrategyRequestDataDriven() ;
    }

    getFocus() : string {
        return this.getDiscovery().focus() ;
    }

    setFocus(idFocus : string) : void {
        const disco = this.getDiscovery().focus(idFocus) ;
        this.setDiscovery(disco);
    }

    checkVariablePresent(response : any ,index : number ,listVarName : string[] ) : Boolean {
        for (let i=0;i<listVarName.length;i++) {
            const varname = listVarName[i]
            if ( ! response.results.bindings[index][varname] ) {
                console.warn(" probleme with entry : "+JSON.stringify(response.results.bindings[index]))
                return false
            }
        }
        
        return true
    }

    attributeList(current: AskOmicsViewNode) : Promise<DatatypeLiteral[]> {
        return new Promise((successCallback, failureCallback) => {
            if (this.strategy) {
                this.strategy.attributeList(this.getDiscovery(),this.config,current) 
                //.console()
                .select("property","labelProperty")
                .distinct
                .commit()
                .raw()
                .then(
                    (response) => {
                        //console.log(response)
                        const results : DatatypeLiteral[] = []
                        
                        const m : Map<string,string> = new Map()
                        for (let i=0;i<response.results.bindings.length;i++) {
                            if ( ! this.checkVariablePresent(response,i,['property']) ) continue
                            const uri   : string = response.results.bindings[i]["property"].value;
                          /*
                            TODO : Discovery => wait for "bind.datatype" feature

                            let range : string 
                          
                            if (response.results.bindings[i]["range"]) {
                                range = response.results.bindings[i]["range"].value;
                                console.log("RANGE:"+range);
                            } */
                                

                            let label   : string = Utils.splitUrl(uri)  ;
                            try {
                                const listLabelEntity = response.results.datatypes["labelProperty"][uri] ;
                                if ( listLabelEntity )
                                    label=listLabelEntity[0].value; 
                            } catch (error) {
                                failureCallback(error);
                            }     

                            m.set(uri,label)
                        }
                        
                        if ( this.strategy && m.size>0) {
                            const lUris : string[] = []
                            for (const key of m.keys()) {
                                lUris.push(key)
                            }
 
                            this.strategy.getDatatypes(this.config, lUris)
                            .then ( (mapPropertyAndRange )=>{
                                lUris.map(
                                    uriProperty => {
                                        const label = m.get(uriProperty)
                                        let range = mapPropertyAndRange.get(uriProperty)
                                        
                                        if (!range) range=""

                                        results.push(
                                            new DatatypeLiteral(uriProperty,range,label)
                                        )
                                    })
                                successCallback(results)
                                
                            }).catch(e => {failureCallback(e)} )
                        } else {
                            successCallback(results)
                        }  
                    })
                .catch(e => {failureCallback(e)} )}
        })
    }

    forwardEntities(current: AskOmicsViewNode) : Promise<Map<String,AskOmicsGenericNode>> {
        return this.propertyEntities(NodeType.FORWARD_ENTITY,current)
    }

    backwardEntities(current: AskOmicsViewNode) : Promise<Map<String,AskOmicsGenericNode>> {
        return this.propertyEntities(NodeType.BACKWARD_ENTITY,current)
    }

    propertyEntities( type: NodeType, current: AskOmicsViewNode ) : Promise<Map<String,AskOmicsGenericNode>> {
        return new Promise((successCallback, failureCallback) => {
            if (this.strategy) {
                
                let disco : SWDiscovery = this.getDiscovery()
                let typeLink : LinkType

                switch(type) { 
                    case NodeType.FORWARD_ENTITY : { 
                        disco = this.strategy.forwardEntities(this.getDiscovery(),this.config,current)
                        typeLink = LinkType.FORWARD_PROPERTY
                        break; 
                    } 
                    case NodeType.BACKWARD_ENTITY : { 
                        disco = this.strategy.backwardEntities(this.getDiscovery(),this.config,current)
                        typeLink = LinkType.BACKWARD_PROPERTY
                        break; 
                    } 
                    default: { 
                        failureCallback("unkown action :" +type)
                        return
                    } 
                 }

                try {
                    const transaction : SWTransaction =
                     disco
                        //.console()
                        .select("property","entity","labelEntity","labelProperty")
                        .distinct
                        .commit()
/*
                    transaction.progression( (percent : any) => {
                        console.log("percent:"+percent)
                    })
*/
                    transaction
                        .raw()
                        .then(
                            (response) => {                      
                                const mR = new Map()
                                for (let i=0;i<response.results.bindings.length;i++) {
                                    if ( ! this.checkVariablePresent(response,i,['entity','property']) ) continue
                                  
                                    const entity      : string = response.results.bindings[i]["entity"].value;
                                    const property    : string = response.results.bindings[i]["property"].value;
                                    let labelEntity   : string = ""  ;
                                    let labelProperty : string = ""  ;
                                    let n : AskOmicsViewNode ;

                                    if (!mR.has(entity)) {
                                       
                                        try {
                                            const listLabelEntity = 
                                                response.results.datatypes["labelEntity"][entity] ;
                                            if ( listLabelEntity )
                                                labelEntity=listLabelEntity[0].value; 
                                        } catch (error) {
                                            console.warn(error);
                                        }     
                                        
                                        n = new AskOmicsViewNode(entity,labelEntity,type)

                                        mR.set(entity, n) ;
                                    } else {
                                        n = mR.get(entity)
                                    }
                                    if(! mR.has(property)) {
                                        
                                        try {
                                            const listLabelEntity = 
                                                response.results.datatypes["labelProperty"][property] ;
                                            if ( listLabelEntity )
                                                labelProperty = listLabelEntity[0].value; 
                                        } catch (error) {
                                            console.warn(error);
                                        }    
                                        
                                        if (typeLink == LinkType.FORWARD_PROPERTY)
                                            mR.set( property,new AskOmicsViewLink(property,labelProperty,typeLink,current.id,n.id))
                                        else 
                                            mR.set( property,new AskOmicsViewLink(property,labelProperty,typeLink,n.id,current.id))
                                    }
                                }
                                successCallback(mR);
                            }
                        ).catch( (e : Error) => { failureCallback(e) });
                    } catch ( e ) {
                        failureCallback(e)
                    }
            } else {
                failureCallback("strategy undefined.")
            }
       })
    }
}