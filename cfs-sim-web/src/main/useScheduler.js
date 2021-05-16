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
    console.log("Response.resultData: ", Response.resultData)
    console.log("Response.elapsed_ms: ", Response.elapsed_ms)
 }
    
    return Response
}

    

    

  
