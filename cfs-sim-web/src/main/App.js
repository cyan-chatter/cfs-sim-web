import '../design/App.css'
import React, {useState, useEffect, useRef} from 'react'
import DynamicTree from './DynamicTree'
import Input from './Input'
import {useWindowSize} from './useWindowSize'
import {useScheduler} from './useScheduler'

var dimensions = {width: null, height: null}
dimensions.width = 800
dimensions.height = 500

const App = () => {


    const [InputData, setInputData] = useState(null)
    const [PostToServerData, setPostToServerData] = useState(null)

    ////////////////mod///////////////
    //const [DisabledSimulate, setDisabledSimulate] = useState(true)
    const [DisabledSimulate, setDisabledSimulate] = useState(false)
    ////////////////mod///////////////

    const treeRef = useRef(null)

    //var dimensions = useWindowSize()
    //console.log(dimensions)


    const Data = useScheduler(PostToServerData)

    const onClickToFetchHandler = () => {
        console.log('clicked to fetch')
        if (!DisabledSimulate) {

            ////////////////mod///////////////
            const dummyData = {
                num_of_tasks: 5,
                total_time: 100,
                task_queue: [
                    {
                        id: 'A',
                        arrival_time: 1,
                        burst_time: 8,
                        priority: 2
                    },
                    {
                        id: 'B',
                        arrival_time: 4,
                        burst_time: 6,
                        priority: 1
                    },
                    {
                        id: 'C',
                        arrival_time: 2,
                        burst_time: 7,
                        priority: 3
                    },
                    {
                        id: 'D',
                        arrival_time: 10,
                        burst_time: 5,
                        priority: 5
                    },
                    {
                        id: 'E',
                        arrival_time: 5,
                        burst_time: 8,
                        priority: 4
                    }
                ]
            }
            setPostToServerData({...dummyData})
            // setPostToServerData({...InputData})
            ////////////////mod///////////////

            setDisabledSimulate(true)
        }
    }

    const copyValuesToRoot = (ph, pd) => {
        const iData = {
            num_of_tasks: ph.n,
            total_time: ph.tq,
            task_queue: pd
        }
        setInputData(iData)
        setDisabledSimulate(false)
        console.log(iData)
    }

    console.log('app runs Data is ', Data)

    var tree = null
    if (Data) {
        tree = (<DynamicTree dimensions={dimensions} data={Data}/>)
        //tree=(<p>Data collected</p>)
    }

    return (
        <div className="App">
            <h1 className="App-header">CFS SIMULATION</h1>
            <br/>
            <div className="Input"><Input copyValuesToRoot={copyValuesToRoot}/></div>
            <button className="TempButton" id="Simulate" onClick={onClickToFetchHandler}
                    disabled={DisabledSimulate}> Simulate
            </button>
            <div className="Tree" ref={treeRef}>{tree}</div>
        </div>
    )
}

export default App
