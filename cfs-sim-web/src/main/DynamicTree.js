import React, {useRef, useEffect, useState} from 'react'
import '../design/App.css'
import '../design/Tree.css'
import {genTree} from './treeGen'
const d3 = require('d3')

// { 
    //     num_of_tasks : 3,
    //     total_time : 11,
    //     task_queue : [
    //         {id : 'A',
    //         arrival_time : 1,
    //         burst_time : 3,
    //         priority : 2},
    //         {id : 'B',
    //         arrival_time : 2,
    //         burst_time : 4,
    //         priority : 1},
    //         {id : 'C',
    //         arrival_time : 2,
    //         burst_time : 3,
    //         priority : 3}
    //     ]
    // 
// }

const DynamicTree = ({dimensions,data}) => {

    const margin = {
        top: 20, right: 120, bottom: 20, left: 120      
    }
    
    const curDim = {
        width : dimensions.width - margin.right - margin.left,
        height : dimensions.height - margin.top - margin.bottom
    }
    
    var duration = 750

  const svgRef = useRef()
  const messageRef = useRef()
  const taskIdRef = useRef()
  const tasksRunLogRef = useRef()
  const operationLogRef = useRef()

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

    var nilIdx = 0
    var tree = d3.layout.tree()  
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
        return c;
    })
    .sort(function(a, b) {
        if (a.val !== 'NIL' && b.val !== 'NIL') {
            return a.cmp(b);
        } else {
            return -1;
        }
    })

    var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

    
    const svg = d3.select(svgRef.current)
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    
    function update(sourceTree) {
      
      var root = sourceTree.root() 
      if (root === Response.NIL) {  
          root = {p: {}, val: 'NIL'}
      }
      root.x0 = dimensions.height / 2 
      root.y0 = 0
    
      var nodes = tree.nodes(root).reverse()
      var links = tree.links(nodes)
    
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id })
    
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" }) 

      nodeEnter.append("circle")
          .attr("r", 0.1)
          .style("fill", nodeColor)
          .style("stroke", function(n) { return d3.rgb(nodeColor(n)).darker() })
    
      nodeEnter.append("text")
          //.attr("x", function(d) { return d.children ? -10 : 10; })
          .attr("dy", "0.35em")
          .attr("text-anchor", function(d) { return d.children ? "middle" : "start" })
          .text(function(d) { if (d.val !== 'NIL') { return `${d.name}` }})
          .style("fill-opacity", 0.1)  
          //.text(function(d) { if (d.val !== 'NIL') { return `${d.val.toFixed(2)}` }})
          
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")" })
    
      nodeUpdate.select("circle")
          .attr("r", function(n) {
              if (n.val !== 'NIL') {
                  return 20
              } else {
                  return 2
              }
          })
          .style("fill", nodeColor)
          .style("stroke", function(n) { return d3.rgb(nodeColor(n)).darker() })
    
      nodeUpdate.select("text")
          .style("fill-opacity", 1)
    
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
          .remove();
    
      nodeExit.select("circle")
          .attr("r", 0.1)
    
      nodeExit.select("text")
          .style("fill-opacity", 0.1)
    
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id })
    
      link.enter().insert("path", "g")
          .attr("class", "link")
          //.style("stroke", "black")
          //.style("stroke-width", 2)
          .attr("d", function(d) {
            var o = {x: d.source.x, y: d.source.y}
            return diagonal({source: o, target: o});
          })
    
      link
        .style("stroke", "black")
        .style("stroke-width", 2)
        // .attr("stroke-dasharray",function(){
        //         const length = this.getTotalLength()
        //         return length + " " + length
        // })
        // .attr("stroke-dashoffset",function(){
        // const length = this.getTotalLength()
        // return length
        // })
        .transition()
        .duration(duration)
        .delay(linkObj => linkObj.source.depth * 500)
        .attr("stroke-dashoffset", 0)
        .style("fill","none")
        .attr("d", diagonal)
    
      link.exit()
          .transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: d.source.x, y: d.source.y}
            return diagonal({source: o, target: o})
          })
          .remove()
    
      // Stashing the old positions of nodes for creating transition
      nodes.forEach(function(d) {
        d.x0 = d.x
        d.y0 = d.y
      });
    
    }

    const createRepText = (ih,cn) => {
        let rt = document.createElement('p')
        rt.className = cn
        rt.innerHTML = ih
        return rt
    }

    const updateOperationLog = (m,et,r) => {
        const li = document.createElement('li')
        li.className = 'reportLine'
        li.appendChild(createRepText(`Elapsed Time: ${et} units`, 'elapsedTime'))
        li.appendChild(createRepText(m, 'elapsedTask'))
        r.current.appendChild(li)
    }

    const updateTaskMessages = (notifier) => {
        messageRef.current.innerHTML = notifier.message
        updateOperationLog(notifier.message,notifier.eTime,operationLogRef)
        taskIdRef.current.innerHTML = notifier.id
    }

    
    var curTree,notifier={
        id: null,
        message: null,
        eTime : null
    }

    const updateTasksRanAtEachTickLog = (i) => {
        
        
            let li = document.createElement('div')
            li.className = 'reportLine'
            
            const et = document.createElement('p')
            et.className = 'iteration'
            et.innerHTML = 'At Iteration ' + i + ':' //
            li.appendChild(et)

            let eT;
            
            eT = document.createElement('p')
            eT.className = 'elapsedTime'
            eT.innerHTML = `Elapsed Time: ${data.resultData[i].elapsedTime} units`
            li.appendChild(eT)

            if(data.resultData[i].running_task !== null){
                eT = document.createElement('p')
                eT.className = 'elapsedTask'
                eT.innerHTML = `Task Ran: ${data.resultData[i].running_task.id} with Virtual Runtime: ${data.resultData[i].running_task.vruntime.toFixed(3)} units`
                li.appendChild(eT)
            }else{
                eT = document.createElement('p')
                eT.className = 'elapsedTask'
                eT.innerHTML = `No Task Ran` 
                li.appendChild(eT)
            }

            if(data.resultData[i].completed_task !== null){
                eT = document.createElement('p')
                eT.className = 'elapsedTask'
                eT.innerHTML = `Completed Task: ${data.resultData[i].completed_task.id} with Virtual Runtime: ${data.resultData[i].completed_task.vruntime.toFixed(3)} units`
                li.appendChild(eT)
            }

            if(data.resultData[i].sliceData.length !== 0){
                let x = data.resultData[i].sliceData
                for(let j=0; j<x.length; ++j){
                    eT = document.createElement('p')
                    eT.className = 'elapsedTask'
                    eT.innerHTML = `${x[j].taskId} has time slice ${x[j].taskSlice} units`
                    li.appendChild(eT)
                }
            }
            
            tasksRunLogRef.current.appendChild(li)
        

    }

    const io = {
        i : 0,
        j : 0
    }

    function setDeceleratingTimeout(callback, factor, times){
        var internalCallback = function(tick, counter) {
            return function() {
                if (--tick >= 0) {
                    window.setTimeout(internalCallback, ++counter * factor);
                    callback(io);
                }
            }
        }(times, 0);
        window.setTimeout(internalCallback, factor);
    }

    const syncReporter = (io) => {

        if(io.i < data.simData.length && io.j < data.resultData.length){
            if(data.syncTime[io.i] <= data.resultData[io.j].elapsedTime){
                curTree = genTree(curTree,data.simData[io.i],notifier,data.syncTime[io.i])
                update(curTree)
                updateTaskMessages(notifier)
                ++io.i;
            }
            else{
                updateTasksRanAtEachTickLog(io.j)
                ++io.j;
            }
        }
        else if(io.i < data.simData.length && io.j >= data.resultData.length){
            curTree = genTree(curTree,data.simData[io.i],notifier,data.syncTime[io.i])
            update(curTree)
            updateTaskMessages(notifier)
            ++io.i;
        }
        else if(io.i >= data.simData.length && io.j < data.resultData.length){
            updateTasksRanAtEachTickLog(io.j)
            ++io.j;
        }
    }        
        
    setDeceleratingTimeout(syncReporter, 40, data.simData.length + data.resultData.length + 1) 

  }, [dimensions,data])

  return (
    <div className="simMain">
        <svg className="svg" ref= {svgRef}></svg>
        <div className="taskData">
        <div  className="dataWithTree">
        <label>Current Task:</label>   
        <p className="taskId" ref= {taskIdRef}></p>
        <label>Current Operation:</label>   
        <p className="message" ref= {messageRef}></p>
        </div>
        <div className="reports">
            <div className="labelDivBinder" id="rp1">
                <label>Operations Log:</label>   
                <ol className="log" id="operationLog" ref= {operationLogRef}></ol>
            </div>
            <div className="labelDivBinder" id="rp2">
                <label>Tasks Ran at Each Clock Tick:</label>
                <div className="log" id="tasksRunLog" ref = {tasksRunLogRef}></div>
            </div>
        </div>
        </div>
    </div>    
  )

}

export default DynamicTree