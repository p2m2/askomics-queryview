
<!-- 

  Implementation AskOmics Visualization inside a Web Component
  https://github.com/askomics/flaskomics/blob/dev/askomics/react/src/routes/query/visualization.jsx 

-->
<template>
  <div id="query-graph-panel" :class="canvasClass">
    <canvas id="canvas-askomics-graph" :width="width" :height="height" disabled> </canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import * as d3 from 'd3';
import Utils from '@/ts/utils'
import RequestManager from '@/ts/RequestManager'
import UserIncrementManager from '@/ts/UserIncrementManager'
import { ObjectState, LinkType, FilterProperty, AskOmicsViewNode, AskOmicsViewLink } from '@/ts/types';
//import { GraphBuilder } from '@/ts/GraphBuilder'

@Options({
  name: "QueryGraphPanel",
  
  emits: ["updateRequestManager","requestManagerBusy","requestManagerBusyEvent","requestManagerBusyPercent"],
  
  components : {  },
  
  props: {
    requestString   : {
                        type: String,
                        required: true
                      },
    filterProperty   : FilterProperty,
    width           : Number,
    height          : Number,
  },

  data () {
    return {
      ctrlKey: false,
      canvas: null,
      ctx: null,
      color: d3.scaleOrdinal(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]),
      zoom : 5,
      zoomTime : 1000,
      trans : d3.zoomIdentity,
      colorGrey : '#808080',
      colorDarkGrey : '#404040',
      colorFirebrick : '#cc0000',
      lineWidth : 2.5,
      nodeSize : 17,
      textSize : 12,
      blankNodeSize : 1,
      arrowLength : 40,
      forceCollide: 40,
      strengthForce: 1.0,
      strengthForceManBody: -2000,
      alphaTarget : 0,
      canvasClass : "",
      nodesSimulation : [],
      linksSimulation : [],
      request      : null,
      selectedNodeCanvas : null
    }
  },

  mounted() {
    if (this.requestString) {
      this.request = new RequestManager(this.requestString,this)
     
      this.setUpSimulation();
      this.display_suggestions()
      this.refreshSimulation()

    } else {
      alert("requestString is not set.")
    }
    
  },
  
  beforeDestroy() {
  },

  watch: {
    requestString() {
      this.request = new RequestManager(this.requestString,this)
    },
    
    filterProperty() {
      this.refreshSimulation()
    }
    
  },
  
  methods: {
    
    selectedNode() {
      return this.request.getGraph().nodes.filter( (n : AskOmicsViewNode) => n.state_n == ObjectState.SELECTED ).pop() 
    } ,

    setUpSimulation() {

        /**
         * Managing CANVAS
         */
      
      this.canvas = d3.select("#canvas-askomics-graph")
      this.ctx = this.canvas.node().getContext("2d");

      this.simulation = d3
          .forceSimulation()
          .force("x",d3.forceX(this.width/2).strength(this.strengthForce) )
          .force("y",d3.forceY(this.height/2).strength(this.strengthForce) )
          .force("collide",d3.forceCollide(this.nodeSize+this.forceCollide))
          .force("charge", d3.forceManyBody().strength(this.strengthForceManBody))
       //   .force("center", null)
         ;
              
      this.simulation.on("tick", this.updateSimulation);

      this.canvas
        .on("click", this.canvasClick)
        .call(d3.drag()
            .container(this.canvas.node())
            .subject(this.dragsubject)
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended)
          )
        /*.call(
          d3.zoom()
              .extent([[0, 0], [this.width, this.height]])
              .scaleExtent([1, 8])
              .on("zoom", this.zoomed)
          )*/
          ;
    },

    refreshSimulation() {
      this.setObjectsSimulation()
      this.updateSimulation()
    },

    setObjectsSimulation() {
      
      this.nodesSimulation = this.request.getGraph().nodes.map(
        (node : AskOmicsViewNode) => {
          const isNode = ( x : AskOmicsViewNode )=> x.id === node.id 
          const idxSimulation = this.nodesSimulation.findIndex( isNode )
          if ( idxSimulation>=0 ) {
            node.x = this.nodesSimulation[idxSimulation].x
            node.y = this.nodesSimulation[idxSimulation].y
          }
          return node
        } 
      )
      
      this.linksSimulation = this.request.getGraph().links.map(
        (link : AskOmicsViewLink ) => {
          const isLink = ( x : AskOmicsViewLink )=> x.id === link.id 
          const idxSimulation = this.linksSimulation.findIndex( isLink )
          if ( idxSimulation>=0 ) {
            link.x = this.linksSimulation[idxSimulation].x
            link.y = this.linksSimulation[idxSimulation].y
            link.vx = this.linksSimulation[idxSimulation].x
            link.vy = this.linksSimulation[idxSimulation].y
          }
          return link
        } 
      )
     
    },
        
    updateSimulation() {
      
      this.ctx.clearRect(0,0,this.width, this.height);
      this.ctx.fillStyle = "Gainsboro";
      this.ctx.fillRect(0,0,this.width,this.height);

      this.ctx.beginPath();
      this.ctx.globalAlpha = 1.0;
      this.ctx.strokeStyle = "#aaa";

      this.linksSimulation.forEach(this.drawLink);
      this.ctx.stroke();

      this.ctx.globalAlpha = 1.0;
      this.nodesSimulation.forEach(this.drawNode);
      

      this.simulation.nodes(this.nodesSimulation);
      this.simulation
              .force("link", d3.forceLink().id(function (d : any ) { return d.id; }))
              .force("link").links(this.linksSimulation)
        
        //this.simulation.restart()

    },

    zoomed(event : any) {
      this.ctx.translate(event.transform.x, event.transform.y); 
      this.ctx.scale(event.transform.k, event.transform.k);
    },
    
    dragsubject(event : any) {
        return this.simulation.find(event.x, event.y);
    },

    /**
     * Interaction with user actions
     */
    
    canvasClick(event : any) {
      
      // if ctrl released 
      if ( ! event.ctrlKey ) this.request.setGraph(UserIncrementManager.releaseSelectedObject(this.request.getGraph()))
     
      /* Find Selected Object */
      let rect = this.canvas.node().getBoundingClientRect();
      
      this.selectedNodeCanvas = this.simulation.find(event.x - rect.left, event.y - rect.top,this.nodeSize);
      this.updateGraph(this.selectedNodeCanvas)     
    },
    /**
     * usefull to update canavs when requestManager change his internal state
     */
    updateGraph(selectedNodeCanvas : AskOmicsViewNode) {   
      /**
       * Nothing is selected with go out and remove selection */ 
      if (! selectedNodeCanvas ) {
        console.debug(" ---  UNSELECTED NODE / updateGraph/UserIncrementManager.removeSuggestion --- ")
        this.request.setGraph(UserIncrementManager.removeSuggestion(this.request)) 
        this.request.setFocusRoot()
      } else {
        
        /**----------------------------------------------------------------------------
         * Creation Node/Links  
         */
        console.debug(" ---  SELECTED NODE / updateGraph/UserIncrementManager.setShapeNode --- ")
        this.request.setGraph(UserIncrementManager.setShapeNode(this.request,selectedNodeCanvas))
       
        /**----------------------------------------------------------------------------
         * Remove Suggestion unused
         */
        console.debug(" ---  SELECTED NODE / updateGraph/UserIncrementManager.removeSuggestion --- ")
        this.request.setGraph(UserIncrementManager.removeSuggestion(this.request))

        /**-----------------------------------------------------------------------------
         *  suggestions management
         * 
         **/

        this.display_suggestions();
      }
    },

  display_suggestions( ) {
    
    /* proposes suggestion only if defined */
    if (! this.selectedNode() )
      return 

      /* add new suggestions */
    
      let component = this
      component.canvasClass = "query-graph-panel-disabled"
      
      let ArrayPromises : Array<Promise<[Object[],Object[]]>> = []

      switch (this.filterProperty) {
        case FilterProperty.ALL : {
          ArrayPromises = [
              UserIncrementManager.clickNodeForward(this,this.request,this.selectedNode()),
              UserIncrementManager.clickNodeBackward(this,this.request,this.selectedNode())
            ]
          break
        }
        case FilterProperty.TO : {
          ArrayPromises = [
              UserIncrementManager.clickNodeForward(this,this.request,this.selectedNode()),
            ]
          break
        }
        case FilterProperty.FROM : {
          ArrayPromises = [
              UserIncrementManager.clickNodeBackward(this,this.request,this.selectedNode())
            ]
          break
        }
         case FilterProperty.IS_A : {
          ArrayPromises = []
          break
        }
      }
      
      Promise.all(ArrayPromises).then(nodesAndLinksArray =>{

          let nodes = component.request.getGraph().nodes 
          let links = component.request.getGraph().links 
          
          for ( let nodesAndLinks of nodesAndLinksArray ) {
            nodes = nodes.concat(nodesAndLinks[0]) 
            links = links.concat(nodesAndLinks[1])
          }
          
          component.request.setGraph( 
              { nodes : nodes , links : links }
              );

          component.canvasClass = ""
          
      }).catch( e => {
        alert(e)
      })
      .finally(function() {
        component.canvasClass = ""
        component.refreshSimulation()
      }) 
    },
    
    dragstarted(event : any) {
     
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    },

    dragged(event : any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    },
    dragended(event : any) {
        if (!event.active) this.simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      },
    
    IntersectionCoordinate (x1 : number , y1 : number, x2 : number, y2 : number, r : number) {
        let theta = Math.atan((y2 - y1) / (x1 - x2))
        let x
        let y
        if (x1 < x2) {
          x = x1 + r * Math.cos(theta)
          y = y1 - r * Math.sin(theta)
        } else {
            x = x1 - r * Math.cos(theta)
            y = y1 + r * Math.sin(theta)
          }
          return { x: x, y: y }
        },
    middleCoordinate (x1 : number, y1 : number, x2 : number, y2 : number) {
        let theta = Math.atan((y2 - y1) / (x1 - x2))
        let x
        let y
        if (x1 < x2) {
          x = x1 + (this.nodeSize * 4) * Math.cos(theta)
          y = y1 - (this.nodeSize * 4) * Math.sin(theta)
        } else {
          x = x1 - (this.nodeSize * 4) * Math.cos(theta)
          y = y1 + (this.nodeSize * 4) * Math.sin(theta)
        }
        return { x: x, y: y }
      },

    triangleCoordinate (x1 : number, y1 : number, x2 : number, y2 : number, headlen : number) {
      let theta = Math.atan2(y1 - y2, x1 - x2)

      let xa = x1 - headlen * Math.cos(theta - Math.PI / 14)
      let ya = y1 - headlen * Math.sin(theta - Math.PI / 14)

      let xb = x1 - headlen * Math.cos(theta + Math.PI / 14)
      let yb = y1 - headlen * Math.sin(theta + Math.PI / 14)

      return {
        xa: xa,
        ya: ya,
        xb: xb,
        yb: yb
      }
    },

    drawNode(node : AskOmicsViewNode) {
     // console.log(JSON.stringify(node))
      let unselectedColor = this.colorGrey
      let unselectedColorText = this.colorDarkGrey
      
      this.ctx.fillStyle = node.uri ? Utils.stringToHexColor(node.uri) : "#faaafff" ;
      
      this.ctx.lineWidth = this.lineWidth ;

      this.ctx.strokeStyle = node.state_n == ObjectState.SELECTED ? this.colorFirebrick : unselectedColor ;
      this.ctx.globalAlpha = node.state_n == ObjectState.SUGGESTED ? 0.5 : 1 ;
      node.state_n == ObjectState.SUGGESTED ? this.ctx.setLineDash([this.lineWidth, this.lineWidth]) : this.ctx.setLineDash([]);

      // draw node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, this.nodeSize, 0, 2 * Math.PI, false);
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.closePath();
      // draw text
      this.ctx.beginPath();
      this.ctx.fillStyle = unselectedColorText;
      this.ctx.font = this.nodeSize + 'px Sans-Serif';
      this.ctx.textAlign = 'middle';
      this.ctx.textBaseline = 'middle';
      let label = node.label
      this.ctx.fillText(label, node.x + this.nodeSize, node.y + this.nodeSize);
      this.ctx.closePath();
    },
    /**
     * Note . Link could not be of AskOmicsViewLink because 
     *  target and source are node identifier in the definition 
     *  but, at this step, there are of AskOmicsViewNode type.
     * 
     */
    drawLink(link : any) {
      link.state_n == ObjectState.SUGGESTED ? this.ctx.setLineDash([this.lineWidth, this.lineWidth]) : this.ctx.setLineDash([]);
      let unselectedColor = this.colorGrey
      let unselectedColorText = this.colorDarkGrey
      
      this.ctx.strokeStyle = link.state_n == ObjectState.SELECTED ? this.colorFirebrick : unselectedColor
      this.ctx.fillStyle = link.state_n == ObjectState.SELECTED ? this.colorFirebrick : this.colorGrey
      this.ctx.globalAlpha = link.state_n == ObjectState.SUGGESTED ? 0.3 : 1
      this.ctx.lineWidth = this.lineWidth
      
      const target = link.target
      const source = link.source 

      this.ctx.beginPath();
      let c = this.IntersectionCoordinate(source.x, source.y, target.x, target.y, this.nodeSize)
      this.ctx.moveTo(c.x, c.y);
      c = this.IntersectionCoordinate(target.x, target.y, source.x, source.y, this.nodeSize)
      this.ctx.lineTo(c.x, c.y);
      this.ctx.stroke();
      this.ctx.closePath();

      

       // draw arrow
       if (link.type == LinkType.FORWARD_PROPERTY || link.type == LinkType.BACKWARD_PROPERTY) {
          this.ctx.beginPath()
          let triangle = this.triangleCoordinate(target.x, target.y, source.x, source.y, this.arrowLength)
          this.ctx.moveTo(c.x, c.y)
          this.ctx.lineTo(triangle.xa, triangle.ya)
          this.ctx.lineTo(triangle.xb, triangle.yb)
          this.ctx.fill()
          this.ctx.closePath()
       }
      // draw text
        this.ctx.beginPath()
        this.ctx.fillStyle = unselectedColorText
        this.ctx.font = this.textSize + 'px Sans-Serif'
        this.ctx.textAlign = 'middle'
        this.ctx.textBaseline = 'middle'
        let m = this.middleCoordinate(source.x, source.y, target.x, target.y)
        this.ctx.fillText(link.label, m.x, m.y)
        this.ctx.closePath()
   }
    
  }
})

export default class QueryGraphPanel extends Vue {

}

</script>

<style>

.query-graph-panel-disabled {
    cursor: not-allowed;
    pointer-events: none;
}
</style>
