import '../design/App.css'
import React, {useState, useEffect, useRef} from 'react'
import TreeComponent from './TreeComponent'
import Input from './Input'
import {useData} from './useData'
import {useWindowSize} from './useWindowSize'

const urlJSON = 'https://gist.githubusercontent.com/cyan-chatter/e5e74c590dd7d2ca5ce713c05d737c0c/raw/185d435de1d4ac08227dedbfd38fe7dd604af137/asiaO.json'

const App = () => {

  const [URL,setURL] = useState(null)
  const [InputData, setInputData] = useState(null) 
  const [DisabledSimulate, setDisabledSimulate] = useState(true)
  const treeRef = useRef(null)

  var dimensions = useWindowSize()
  dimensions.width *= 0.85  //0.7
  dimensions.height *= 0.9

  console.log(dimensions)

  const Data = useData(URL,InputData)

  const onClickToFetchHandler = () => {
    console.log('clicked to fetch')
    if(!DisabledSimulate){
      setURL(urlJSON)
      setDisabledSimulate(true)
    } 
  }

  const copyValuesToRoot = (ph,pd) => {
    setInputData({
      number : ph.i1,
      tq : ph.i2,
      pd 
    })
    setDisabledSimulate(false)
  }

  console.log('app runs Data is ', Data)
  
  var tree = null
  if(Data){
    //tree = (<TreeComponent dimensions= {dimensions} data={Data}/>)
    tree = (<DynamicTree dimensions= {dimensions} data={Data}/>)
  }
  
  return (
    <div className="App">   
    <h1 className="App-header">VISUALIZE CFS</h1>
    <br/>
    <div className="Input"><Input copyValuesToRoot = {copyValuesToRoot}/></div>
    <button className="TempButton" id="Simulate" onClick={onClickToFetchHandler} disabled = {DisabledSimulate}> Simulate </button>
    <div className="Tree" ref={treeRef}>{tree}</div>
    </div>
  )
}

export default App
