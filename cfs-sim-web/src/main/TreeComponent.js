import React, {useRef, useEffect, useState} from 'react'
import '../design/App.css'
import '../design/Tree.css'
//import useResizeObserver from './useResizeObserver'

const d3 = require('d3')

const TreeComponent = ({dimensions,data}) => {

  
  const svgRef = useRef()

  // function t (){
  //   width = document.body.clientWidth * 0.7
  //   height = document.body.clientHeight * 0.7
  // }
  
  // window.onresize = t

  useEffect(() => {
  
    if(!dimensions) return 

    const svg = d3.select(svgRef.current)
  
    //use stratify first if data not already in heirarchical format
    const root = d3.hierarchy(data)
  
    const treeLayout = d3.tree().size([dimensions.width ,dimensions.height])
    
    treeLayout(root)

    //default style path gen for links
    const linkPathGen = d3.linkVertical()
    .source(link=>link.source).target(link=>link.target)
    .x(node=>node.x).y(node=>node.y)

    //nodes
    svg.selectAll(".node")
    .data(root.descendants())
    .join("circle")
    .attr("class", "node")
    .attr("r",18)
    .attr("stroke","black")
    .attr("fill","none")
    .attr("cx", node => node.x)
    .attr("cy", node => node.y)
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .delay(nodeObj => nodeObj.depth * 500)
    .attr("opacity", 1)

    //links
   svg.selectAll(".link")
   .data(root.links())
   .join("path")
   .attr("class", "link")
   .attr("fill", "none")
   .attr("stroke", "black")
   .attr("d",linkPathGen)
   .attr("stroke-dasharray",function(){
     const length = this.getTotalLength()
     return length + " " + length
   })
   .attr("stroke-dashoffset",function(){
    const length = this.getTotalLength()
    return length
  })
    .transition().duration(1000)
    .delay(linkObj => linkObj.source.depth * 700)
    .attr("stroke-dashoffset", 0)

    //labels
    svg.selectAll(".label")
    .data(root.descendants())
    .join("text")
    .attr("class", "label")
    .text(node => node.data.data.id)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("x", node => node.x)
    .attr("y", node => node.y)
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .delay(nodeObj => nodeObj.depth * 500)
    .attr("opacity", 1)

    //--------------------------------------------------------------//
    //--------------------------------------------------------------//
    //const links = treeLayout(root).links()
    //const linkPathGen = d3.linkHorizontal().x(d=> d.y).y(d=>d.x)
    // svg.selectAll('path').data(links)
    // .enter().append('path').attr('d', linkPathGen)
    //--------------------------------------------------------------//
    //--------------------------------------------------------------//


    //seems like have to write cleanup for getting it ready for passed props changes (data and dimensions)
    // return () => {
  
    // }

  }, [dimensions,data])

  return (
    <>
        <svg className="svg" ref= {svgRef}></svg>
    </>    
  )

}

export default TreeComponent