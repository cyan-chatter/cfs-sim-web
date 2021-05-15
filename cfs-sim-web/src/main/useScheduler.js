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

 if(Response){
    //     for(let i of Response.resultData){
    //         console.log("Response.resultData.element-> ")
    //         console.log(i)
    //     }
    console.log("Response.resultData: ", Response.resultData)
    console.log("Response.syncTime: ",Response.syncTime)
    console.log("Response.simData: ", Response.simData)
    console.log("Response.elapsed_ms: ", Response.elapsed_ms)
 }
    
    
    //e.color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    
    return Response
}

    

    

  
