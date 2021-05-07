const chalk = require('chalk')
const express = require('express')
var cors = require('cors');
const app = express()
app.use(cors())
app.use(express.json())
const port = 5500
const scheduler = require('../scheduler')

//write your code here
const schedulerMain = (inputData) => {
    var timeline = scheduler.getTimeline()
    var response = scheduler.runScheduler(inputData, timeline)
    return response
}

app.get('/', (req,res)=>{
    res.send("Welcome to CFS Scheduler API")
})

app.post('/data', function (req, res) {
  
    const inputData = req.body
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

    console.log('request received')

    const response = schedulerMain(inputData)

    console.log(inputData) 

    // for(let i of response.resultData){
    //     console.log("response.resultData.element-> ")
    //     console.log(i)
    // }

    // for(let simTree of response.simTrees){
    //     for(keys in simTree){
    //         console.log(chalk.yellow(keys),chalk.yellow(simTree[keys]))
    //     }
    // }

    res.send(response)
})

app.listen(port, () => {
    console.log("server is up at port " + port)
})