import {useState, useEffect} from 'react'
import cfsScheduler from '../utils/scheduler'

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
   
    return Response
}

    

    

  
