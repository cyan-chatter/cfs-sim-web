import React, {useState, useEffect} from 'react'
import cfsScheduler from '../utils/scheduler'

const chalk = require('chalk')

export const useScheduler = (inputData) => {
    const [Response, setResponse] = useState(null)
    useEffect(()=>{
        const schedulerMain = (inputData) => {
            var timeline = cfsScheduler.getTimeline()
            var response = cfsScheduler.runScheduler(inputData, timeline)
            return response
        }
        if(inputData){
            const res = schedulerMain(inputData)
            setResponse(res)
        } 
    }, [inputData])

    // if(Response){
    //     for(let i of Response.resultData){
    //         console.log("Response.resultData.element-> ")
    //         console.log(i)
    //     }
    
    //     for(let simTree of Response.simTrees){
    //         console.log(simTree)
    //     }
    // }

    console.log("Response: ", Response)
    return Response
}


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
    // }

    //e.color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')

    

  
