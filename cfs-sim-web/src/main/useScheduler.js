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
    
    for(let simTree of Response.simTrees){
        console.log("Each Response Tree: ")      
        console.log(simTree)
        console.log(simTree.root())
        console.log(simTree.size())
        console.log(simTree.walk())
    }
 }
    
    
    //e.color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    //console.log("Response: ", Response)
    return Response
}

    

    

  
