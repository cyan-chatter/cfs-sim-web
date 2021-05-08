import React, {useRef, useEffect, useState} from 'react'
import '../design/App.css'
import '../design/Tree.css'

const d3 = require('d3')

const margin = {
    top: 20, right: 120, bottom: 20, left: 120      
}

const curDim = {
    width : 960 - margin.right - margin.left,
    height : 600 - margin.top - margin.bottom
}

var duration = 750

const TreeComponent = ({dimensions,data}) => {

  const svgRef = useRef()

  useEffect(() => {
  
    if(!dimensions) return 

    function nodeColor(n) {
      if (n.color === 'r'){
          return "red"
      } else {
          return "dimgrey"
      }
    }

    function vsort(a,b) {
      return a.val.vruntime - b.val.vruntime;
    }

    const curTrees = data.simTrees ////
    console.log("data in dynamic tree: ", curTrees)

    var nilIdx = 0
    var tree = d3.layout.tree()  /////////////
      .size([curDim.width ,curDim.height])
      .children(function(n) {
        var c = [];
        if (n.val !== 'NIL') {
            if (n.left.val === 'NIL') {
                c.push({id: "NIL" + (nilIdx++), p: {}, val:'NIL'});
            } else {
                c.push(n.left);
            }
            if (n.right.val === 'NIL') {
                c.push({id: "NIL" + (nilIdx++), p: {}, val:'NIL'});
            } else {
                c.push(n.right);
            }
        }
        console.log(n.val, c);
        return c;
    })
    .sort(function(a, b) {
        if (a.val !== 'NIL' && b.val !== 'NIL') {
            //return a.cmp(b);
            if(typeof(a.val.vruntime) === undefined || typeof(b.val.vruntime) === undefined){
              return a.val - b.val;
            }
            return vsort(a,b);
        } else {
            return -1;
        }
    })

    //root = d3.hierarchy(treeData, function(d) { return d.children; });

    // const linkPathGen = d3.linkVertical()
    // .source(link=>link.source)
    // .target(link=>link.target)
    // .x(node=>node.x).y(node=>node.y)

    var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

    
    const svg = d3.select(svgRef.current)
    .attr("width", curDim.width + margin.right + margin.left)
    .attr("height", curDim.height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")






    function update(sourceTree) {
      
        console.log("sourceTree: ", sourceTree)
        var naming = sourceTree.name
        console.log("name: ", naming)
        
        var root = sourceTree.root() ///
    
      if (root.val === 'NIL') {  ///////check
          root = {p: {}, val: 'NIL'};
      }
    
      root.x0 = curDim.height  / 2; ///
      root.y0 = 0;
    
      // Don't update the read counts while scanning the tree
      //RESET_STATS();
    
      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse()
      var links = tree.links(nodes)
    
      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id; });
    
      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.p.x + "," + d.p.y + ")"; });
    
      nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", nodeColor)
          .style("stroke", function(n) { return d3.rgb(nodeColor(n)).darker(); });
    
      nodeEnter.append("text")
          .attr("x", function(d) { return d.children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
          .text(function(d) { if (d.val !== 'NIL') { return d.val; }})
          .style("fill-opacity", 1e-6);
    
      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    
      nodeUpdate.select("circle")
          .attr("r", function(n) {
              if (n.val !== 'NIL') {
                  return 4.5;
              } else {
                  return 1.5;
              }
          })
          .style("fill", nodeColor)
          .style("stroke", function(n) { return d3.rgb(nodeColor(n)).darker(); });
    
      nodeUpdate.select("text")
          .style("fill-opacity", 1);
    
      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.p.x + "," + d.p.y + ")"; })
          .remove();
    
      nodeExit.select("circle")
          .attr("r", 1e-6);
    
      nodeExit.select("text")
          .style("fill-opacity", 1e-6);
    
      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });
    
      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: d.source.x, y: d.source.y};
            return diagonal({source: o, target: o});
          });
    
      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);
    
      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: d.source.x, y: d.source.y};
            return diagonal({source: o, target: o});
          })
          .remove();
    
      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    
      // Update the stats values
      
      // var reads = 0, writes = 0;
      // console.log(curTree.STATS);
      // for (var r in curTree.STATS.read) {
      //   reads += curTree.STATS.read[r];
      // }
      // for (var r in curTree.STATS.write) {
      //   writes += curTree.STATS.write[r];
      // }
      // $('#stats_reads').innerText = reads;
      // $('#stats_writes').innerText = writes;
    
      // // Reset the stats to be the internal one for this tree
      // RESET_STATS(curTree.STATS);

    }

    for(let i=0; i<curTrees.length; ++i){
        
        setTimeout(()=>{
            console.log("data passed to this update: ", curTrees[i])
            update(curTrees[i]);
        },1000)
    }
    
  }, [dimensions,data])

  return (
    <>
        <svg className="svg" ref= {svgRef}></svg>
    </>    
  )

}

export default TreeComponent