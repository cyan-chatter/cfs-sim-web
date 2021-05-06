const chalk = require('chalk')
const express = require('express')
const app = express()
app.use(express.json())
const port = 5500
const scheduler = require('../scheduler')

var response = {resultData : null}

//write your code here
const schedulerMain = (inputData) => {
    var timeline = scheduler.getTimeline()
    const resultData = scheduler.runScheduler(inputData, timeline)
    response = {resultData : resultData}
    
    for(var i = 0; i<response.resultData.length; ++i)
    {
        // console.log(response.resultData[i])
        // // console.log('results node stats: ', rd.index.results.node_stats)
        // console.log("Item Number " + i + ": ")
        // console.log(chalk.orange(Object.entries(response.resultData[i].time_data))) //////////////////
        // console.log(chalk.orange(Object.entries(response.resultData[i].node_stats))) ////////////////// 
        for(var j=0; j<response.resultData[i].time_data.length; ++j){
            console.log(chalk.cyanBright(response.resultData[i].time_data[j]))
            console.log(chalk.cyanBright(response.resultData[i].time_data[j]))
        }
    }

    

}

const inputData = {
    num_of_tasks : 3,
    total_time : 11,
    task_queue : [
        {id : 'A',
        arrival_time : 1,
        burst_time : 3,
        priority : 2},
        {id : 'B',
        arrival_time : 2,
        burst_time : 4,
        priority : 1},
        {id : 'C',
        arrival_time : 2,
        burst_time : 3,
        priority : 3}
    ]
}

//console.log(inputData) 
schedulerMain(inputData)



// for(r of resultData){
//     console.log('results time data: ', r.results.time_data)
//     console.log('results node stats: ', r.results.node_stats)
// }


// console.log(response.results.time_data)
// console.log(response.results.node_stats)


// app.post('/', function (req, res) {
//   console.log(req.body)
//   //const inputData = req.body
//   /* 
//     Input in this form:
    
//     {
//         number : "3",
//         total_time : "11",
//         pd: [
//             {PID : "A", AT : "12", BT : "23"},
//             {PID : "A", AT : "12", BT : "23"},
//             {PID : "A", AT : "12", BT : "23"}
//         ]
//     }

//     {num_of_tasks: num_of_tasks,
//             total_time:   total_time,
//             task_queue:   queue}

// A 1 3
// B 2 4
// C 2 3

//   */

//     const inputData = {
//         num_of_tasks : 3,
//         total_time : 11,
//         task_queue : [
//             {id : 'A',
//             arrival_time : 1,
//             burst_time : 3,
//             priority : 2},
//             {id : 'B',
//             arrival_time : 2,
//             burst_time : 4,
//             priority : 1},
//             {id : 'C',
//             arrival_time : 2,
//             burst_time : 3,
//             priority : 3}
//         ]
//     }

//     console.log(inputData) 
//     const response = schedulerMain(inputData)
//     console.log(response)
//     res.send(response)
// })

app.listen(port, () => {
    console.log("server is up at port " + port)
})