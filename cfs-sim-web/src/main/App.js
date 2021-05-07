import '../design/App.css'
import React, {useState, useEffect, useRef} from 'react'
import TreeComponent from './TreeComponent'
import Input from './Input'
import {useData} from './useData'
import {useWindowSize} from './useWindowSize'

const urlJSON = 'https://gist.githubusercontent.com/cyan-chatter/e5e74c590dd7d2ca5ce713c05d737c0c/raw/185d435de1d4ac08227dedbfd38fe7dd604af137/asiaO.json'

const urlToFetch = 'http://localhost:5500/data/'

const App = () => {

  const [URL,setURL] = useState(null)
  const [InputData, setInputData] = useState(null) 
  const [PostToServerData, setPostToServerData] = useState(null) 
  const [DisabledSimulate, setDisabledSimulate] = useState(true)
  const treeRef = useRef(null)

  var dimensions = useWindowSize()
  dimensions.width *= 0.85  //0.7
  dimensions.height *= 0.9
  
  console.log(dimensions)

  const Data = useData(URL,PostToServerData)

  const onClickToFetchHandler = () => {
    console.log('clicked to fetch')
    if(!DisabledSimulate){
      setURL(urlToFetch)
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
    //tree = (<TreeComponent dimensions= {dimensions} data={Data}/>)
    //tree = (<DynamicTree dimensions= {dimensions} data={Data}/>)
    console.log(Data)
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
