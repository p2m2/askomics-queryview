
<!-- 

  Implementation AskOmics Visualization inside a Web Component
  https://github.com/askomics/flaskomics/blob/dev/askomics/react/src/routes/query/visualization.jsx 

-->
<template>
  <div id="query-graph-panel">
    <canvas id="canvas-askomics-graph" :width="width" :height="height"> </canvas>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import * as d3 from 'd3';
import Utils from '../../ts/utils'
import RequestManager from '../../ts/RequestManager'

@Options({
  components : {  },
  props: {
    request : RequestManager
  },
  data () {
    return {
      graph: {
        nodes: [
            {
              label: "Alice",
              id: "Alice", 
              uri : "http://bidon/1",
              name : "Alice",
              suggested: false, 
              selected: false
              },
            {"label": "Bob","id": "Bob", "name" : "Bob",uri : "http://bidon/2", suggested: true, selected: false},
            {"label": "Carol","id": "Carol", "name" : "Carol", uri : "http://bidon/3", suggested: true, selected: true }
        ],
        links:
        [
          {
            source:"Alice",
            target:"Bob",
            label:"A->B",
            suggested: true,
            selected: true,
            directed: true
          }, {
            source:"Alice",
            target:"Carol",
            label:"A->C",
            suggested: false,
            selected: false,
            directed: true
          }
        ]
      },
      ctrlKey: false,
      canvas: null,
      ctx: null,
      width:650,
      height:400,
      color: d3.scaleOrdinal(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]),
      zoom : 5,
      zoomTime : 1000,
      trans : d3.zoomIdentity,
      colorGrey : '#808080',
      colorDarkGrey : '#404040',
      colorFirebrick : '#cc0000',
      lineWidth : 2.5,
      nodeSize : 20,
      blankNodeSize : 1,
      arrowLength : 20,
      forceCollide: 40,
      strengthForce: 0.9,
      strengthForceManBody: -2000
    }
  },
  mounted() {
    this.setUpCanvas();
  },
  
  beforeDestroy() {
  },

  methods: {
    setUpCanvas() {
      

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
         ;

      this.simulation.nodes(this.graph.nodes);
      
      this.simulation
          .force("link", d3.forceLink()
                  .id(function (d) { return d.id; })
          )
          .force("link").links(this.graph.links);
            
      
      this.simulation.on("tick", this.update);

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
        
    update() {

      this.ctx.clearRect(0,0,this.width, this.height);
      this.ctx.fillStyle = "Gainsboro";
      this.ctx.fillRect(0,0,this.width,this.height);

      this.ctx.beginPath();
      this.ctx.globalAlpha = 0.1;
      this.ctx.strokeStyle = "#aaa";
      this.graph.links.forEach(this.drawLink);
      this.ctx.stroke();

      this.ctx.globalAlpha = 1.0;
      this.graph.nodes.forEach(this.drawNode);
    },

    zoomed(event) {
      this.ctx.translate(event.transform.x, event.transform.y); 
      this.ctx.scale(event.transform.k, event.transform.k);
    },
    
    dragsubject(event) {
        return this.simulation.find(event.x, event.y);
    },

    canvasClick(event) {      
      // if ctrl released 
      if ( ! event.ctrlKey ) {
          // release  
          this.graph.nodes.map( n => { n.selected = false } ) ;
      }

      this.request.forwardEntities("uri test....").then(r => {console.log(r)});
      //this.request.setDataDrivenStrategy();
      //this.request.forwardEntities("uri test....").then(r => {console.log(r)});

      let rect = this.canvas.node().getBoundingClientRect();
      let n = this.simulation.find(event.x - rect.left, event.y - rect.top,this.nodeSize);
      if (n) {
        n.selected = !n.selected ;
      } else {
        console.log("nothing...");
      }
      this.update();
    },
    
    dragstarted(event) {
      //console.log("started..............");
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      console.log(event.subject);
    },
    dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    },
    dragended(event) {
    //  console.log("ended..............");
        if (!event.active) this.simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      },
    
    IntersectionCoordinate (x1, y1, x2, y2, r) {
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
    middleCoordinate (x1, y1, x2, y2) {
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

    triangleCoordinate (x1, y1, x2, y2, headlen) {
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

    subNums (id) {
        let newStr = ""
        let oldStr = id.toString()
        let arrayString = [...oldStr]
        arrayString.forEach(char => {
          let code = char.charCodeAt()
          newStr += String.fromCharCode(code + 8272)
        })
        return newStr
    },

    drawNode(node) {
      let unselectedColor = this.colorGrey
      let unselectedColorText = this.colorDarkGrey
      
      this.ctx.fillStyle = node.uri ? Utils.stringToHexColor(node.uri) : "#faaafff" ;
      
      this.ctx.lineWidth = this.lineWidth ;
      this.ctx.strokeStyle = node.selected ? this.colorFirebrick : unselectedColor ;
      this.ctx.globalAlpha = node.suggested ? 0.5 : 1 ;
      node.suggested ? this.ctx.setLineDash([this.lineWidth, this.lineWidth]) : this.ctx.setLineDash([]);

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
      let label = node.humanId ? node.label + " " + this.subNums(node.humanId) : node.label;
      this.ctx.fillText(label, node.x + this.nodeSize, node.y + this.nodeSize);
      this.ctx.closePath();
    },

    drawLink(link) {
      link.suggested ? this.ctx.setLineDash([this.lineWidth, this.lineWidth]) : this.ctx.setLineDash([]);
      let unselectedColor = this.colorGrey
      let unselectedColorText = this.colorDarkGrey
      
      this.ctx.strokeStyle = link.selected ? this.colorFirebrick : unselectedColor

      this.ctx.fillStyle = link.selected ? this.colorFirebrick : this.colorGrey
      this.ctx.globalAlpha = link.suggested ? 0.3 : 1
      this.ctx.lineWidth = this.lineWidth

      this.ctx.beginPath();
      let c = this.IntersectionCoordinate(link.source.x, link.source.y, link.target.x, link.target.y, this.nodeSize)
      this.ctx.moveTo(c.x, c.y);
      c = this.IntersectionCoordinate(link.target.x, link.target.y, link.source.x, link.source.y, this.nodeSize)
      this.ctx.lineTo(c.x, c.y);
      this.ctx.stroke();
      this.ctx.closePath();

       // draw arrow
      if (link.directed) {
        this.ctx.beginPath()
        let triangle = this.triangleCoordinate(link.target.x, link.target.y, link.source.x, link.source.y, this.arrowLength)
        this.ctx.moveTo(c.x, c.y)
        this.ctx.lineTo(triangle.xa, triangle.ya)
        this.ctx.lineTo(triangle.xb, triangle.yb)
        this.ctx.fill()
        this.ctx.closePath()
      }

      // draw text
        this.ctx.beginPath()
        this.ctx.fillStyle = unselectedColorText
        this.ctx.font = this.nodeSize - 0.5 + 'px Sans-Serif'
        this.ctx.textAlign = 'middle'
        this.ctx.textBaseline = 'middle'
        let m = this.middleCoordinate(link.source.x, link.source.y, link.target.x, link.target.y)
        this.ctx.fillText(link.label, m.x, m.y)
        this.ctx.closePath()
   }
    
  }
})

export default class QueryGraphPanel extends Vue {

}

</script>

<style>
</style>
