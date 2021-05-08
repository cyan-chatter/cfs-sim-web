import '../design/App.css'
import React, {useState, useEffect, useRef} from 'react'
import DynamicTree from './DynamicTree'
import Input from './Input'
import {useWindowSize} from './useWindowSize'
import {useScheduler} from '../utils/useScheduler'

const App = () => {


  const [InputData, setInputData] = useState(null) 
  const [PostToServerData, setPostToServerData] = useState(null) 
  const [DisabledSimulate, setDisabledSimulate] = useState(true)
  const treeRef = useRef(null)

  var dimensions = useWindowSize()
  dimensions.width *= 0.85  //0.7
  dimensions.height *= 0.9
  
  console.log(dimensions)

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
