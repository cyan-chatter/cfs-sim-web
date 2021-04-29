import './App.css'
import React, {useState, useEffect} from 'react'
import TreeComponent from './TreeComponent'
import Input from './Input'
import {useData} from './useData'


const urlJSON = 'https://gist.githubusercontent.com/cyan-chatter/e5e74c590dd7d2ca5ce713c05d737c0c/raw/185d435de1d4ac08227dedbfd38fe7dd604af137/asiaO.json'

var width = document.body.clientWidth * 0.7
var height = document.body.clientHeight * 0.7

const dimensions = {
  height, width
}

const App = () => {

  const onClickToFetchHandler = () => {
    console.log('clicked to fetch')

    setURL(urlJSON)
  }

  const [URL,setURL] = useState(null)
  const [input,setInput] = useState(null)

  const Data = useData(URL)
    
  console.log('app runs Data is ', Data)
  if(!Data) return (
    <div>
    <button className="TempButton" onClick={onClickToFetchHandler}> Fetch Data </button>
    </div>
  )
  
  return (
    <div className="App">   
    <h1 className="App-header">VISUALIZE</h1>
    <br/>
    <Input />
    <button className="TempButton" onClick={onClickToFetchHandler}> Fetch Data </button>
    <TreeComponent dimensions= {dimensions} data={Data}/>
    </div>
  )
}

export default App
