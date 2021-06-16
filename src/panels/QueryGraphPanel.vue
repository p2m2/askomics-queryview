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
      canvas: "",
      ctx: "",
      graph: {},
      width:650,
      height:400,
      r: 20,
      color: ""
    }
  },
  mounted() {
    console.log("App loaded");
    this.fetchData();
  },
  methods: {
    fetchData() {
     
      this.graph = {
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
            "count":206
            }, {
            "source":"Alice",
            "target":"Carol",
            "count":710
            }
        ]
      };
       console.log("DEBUG........................................");

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
      }
,
    drawNode(d) {
      //console.log("drawNode..............");
      //console.log(d);
      this.ctx.beginPath();
      this.ctx.fillStyle = this.color(d.party);
      this.ctx.moveTo(d.x, d.y);
      this.ctx.arc(d.x, d.y, this.r, 0, Math.PI*2);
      this.ctx.fill();
    },
    drawLink(l) {
      //console.log("drawLink..............");
      this.ctx.moveTo(l.source.x, l.source.y);
      this.ctx.lineTo(l.target.x, l.target.y);
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
