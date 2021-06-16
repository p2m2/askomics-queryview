
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
import * as d3 from 'd3';

export default {
  name: 'QueryGraphPanel',
  components : {  },
  props: {
    // taille en pixel du composant
    width_fix: { type: Number },
    height_fix: { type: Number },
    
  },
  data () {
    return {
      graph: {
        nodes: [
            {"id": "Alice", "name" : "Alice"},
            {"id": "Bob", "name" : "Bob"},
            {"id": "Carol", "name" : "Carol"}
        ],
        links:
        [
          {
            "source":"Alice",
            "target":"Bob",
            "count":206,
            suggested: true,
            selected: true,
            directed: true
          }, {
            "source":"Alice",
            "target":"Carol",
            "count":710,
            suggested: false,
            selected: false,
            directed: true
          }
        ]
      },
      canvas: "",
      ctx: "",
      width:650,
      height:400,
      r: 20,
      color: "",
      zoom : 5,
      zoomTime : 1000,
      colorGrey : '#808080',
      colorDarkGrey : '#404040',
      colorFirebrick : '#cc0000',
      colorGreen : '#005500FF',
      lineWidth : 0.5,
      nodeSize : 3,
      blankNodeSize : 1,
      arrowLength : 7

    }
  },
  mounted() {
    console.log("App loaded");
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.canvas = d3.select("#canvas-askomics-graph")
       
      this.ctx = this.canvas.node().getContext("2d");
      this.color = d3.scaleOrdinal(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


      this.simulation = d3
          .forceSimulation()
          .force("x",d3.forceX(300))
          .force("y",d3.forceY(300))
          .force("collide",d3.forceCollide(this.r+10))
          .force("charge", d3.forceManyBody()
          .strength(-20))
           .force("link", d3.forceLink()
                  .id(function (d) { return d.name; })
              );
          


      this.simulation.nodes(this.graph.nodes);
      this.simulation
          .force("link")
            .links(this.graph.links);
      this.simulation.on("tick", this.update);

      this.canvas
        .call(d3.drag()
            .container(this.canvas.node())
            .subject(this.dragsubject)
            .on("start", this.started)
            .on("end", this.ended)
          );
    },
        
    update() {
          console.log("update..............");
          this.ctx.clearRect(0,0,this.width, this.height);
          this.ctx.beginPath();
          this.ctx.globalAlpha = 0.1;
          this.ctx.strokeStyle = "#aaa";
          this.graph.links.forEach(this.drawLink);
          this.ctx.stroke();

          this.ctx.globalAlpha = 1.0;
          this.graph.nodes.forEach(this.drawNode);
    },
    
    dragsubject(event) {
      console.log("dragsubject..............");
        return this.simulation.find(event.x, event.y);
    },
    
    started(event) {
      //console.log("started..............");
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      console.log(event.subject);
    },

    ended(event) {
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

    drawNode(d) {
      //console.log("drawNode..............");
      //console.log(d);
      this.ctx.beginPath();
      this.ctx.fillStyle = this.color(d.party);
      this.ctx.moveTo(d.x, d.y);
      this.ctx.arc(d.x, d.y, this.r, 0, Math.PI*2);
      this.ctx.fill();
    },

    drawLink(link) {
      link.suggested ? this.ctx.setLineDash([this.lineWidth, this.lineWidth]) : this.ctx.setLineDash([]);
      let unselectedColor = this.colorGrey
      let unselectedColorText = this.colorDarkGrey
      
      this.ctx.strokeStyle = link.selected ? this.colorFirebrick : unselectedColor

      this.ctx.fillStyle = link.selected ? this.colorFirebrick : this.colorGrey
      this.ctx.globalAlpha = link.suggested ? 0.3 : 1
      this.ctx.lineWidth = this.lineWidth

      //console.log("drawLink..............");
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
}

/*
d3.select("#graph_query").layout.force()
    .nodes(nodes)
    .links(links)
    .size([w, h])
    .linkStrength(0.1)
    .friction(0.9)
    .linkDistance(20)
    .charge(-30)
    .gravity(0.1)
    .theta(0.8)
    .alpha(0.1)
    .start();
*/
</script>

<style lang="scss">
</style>
