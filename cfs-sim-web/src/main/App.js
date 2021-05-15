import '../design/App.css'
import React, {useState, useEffect, useRef} from 'react'
import DynamicTree from './DynamicTree'
import Input from './Input'
import {useWindowSize} from './useWindowSize'
import {useScheduler} from './useScheduler'

var dimensions = {width : null, height : null}
dimensions.width = 800
dimensions.height = 500

const App = () => {


  const [InputData, setInputData] = useState(null) 
  const [PostToServerData, setPostToServerData] = useState(null) 
  const [DisabledSimulate, setDisabledSimulate] = useState(true)
  const treeRef = useRef(null)

  //var dimensions = useWindowSize()
  //console.log(dimensions)
    

  const Data = useScheduler(PostToServerData)

  const onClickToFetchHandler = () => {
    console.log('clicked to fetch')
    if(!DisabledSimulate){
      setPostToServerData({...InputData})
      setDisabledSimulate(true)
    } 
  }

  const copyValuesToRoot = (ph,pd) => {
    const iData = {
      num_of_tasks : ph.n,
      total_time : ph.tq,
      task_queue : pd 
    }
    setInputData(iData)
    setDisabledSimulate(false)
    console.log(iData)
  }

  console.log('app runs Data is ', Data)
  
  var tree = null
  if(Data){
    tree = (<DynamicTree dimensions= {dimensions} data={Data}/>)
    //tree=(<p>Data collected</p>)
  }
  
  return (
    <div className="App">   
    <h1 className="App-header">CFS SIMULATION</h1>
    <br/>
    <div className="Input"><Input copyValuesToRoot = {copyValuesToRoot}/></div>
    <button className="TempButton" id="Simulate" onClick={onClickToFetchHandler} disabled = {DisabledSimulate}> Simulate </button>
    <div className="Tree" ref={treeRef}>{tree}</div>
    </div>
  )
}

export default App
