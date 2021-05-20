import '../design/App.css'
import React, {useState, useRef} from 'react'
import DynamicTree from './DynamicTree'
import Input from './Input'
import {useScheduler} from './useScheduler'

//import {useWindowSize} from './useWindowSize'


var dimensions = {width: null, height: null}
dimensions.width = 800
dimensions.height = 500

const App = () => {


    const [InputData, setInputData] = useState(null)
    const [PostToServerData, setPostToServerData] = useState(null)

    
    const [DisabledSimulate, setDisabledSimulate] = useState(true)
    //const [DisabledSimulate, setDisabledSimulate] = useState(false)
    
    const treeRef = useRef(null)

    //var dimensions = useWindowSize()

    const Data = useScheduler(PostToServerData)

    const onClickToFetchHandler = () => {
        if (!DisabledSimulate) {

            // const dummyData = {
            //     num_of_tasks: 2,
            //     total_time: 200,
            //     task_queue: [
            //         {
            //             id: 'A',
            //             arrival_time: 12,
            //             burst_time: 20,
            //             priority: 1
            //         },
            //         {
            //             id: 'B',
            //             arrival_time: 20,
            //             burst_time: 35,
            //             priority: 2
            //         }
            //     ]
            // }

            //setPostToServerData({...dummyData})
            setPostToServerData({...InputData})
            
            setDisabledSimulate(true)
        }
    }

    const copyValuesToRoot = (ph, pd) => {
        const iData = {
            num_of_tasks: parseInt(ph.n),
            total_time: parseInt(ph.tq),
            task_queue: pd
        }
        setInputData(iData)
        setDisabledSimulate(false)
    }

    //console.log('app runs Data is ', Data)

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
