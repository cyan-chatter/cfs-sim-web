const express = require('express')
const app = express()
app.use(express.json())
const port = 5500
const scheduler = require('../scheduler')

var resultData = null

const getResults = (timeTaken, results) => {
    resultData = {
        ...resultData, results, timeTaken
    }
}

//write your code here
const schedulerMain = (inputData) => {
    var timeline = scheduler.getTimeline()
    scheduler.runScheduler(inputData, timeline, getResults)
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

console.log(inputData) 
schedulerMain(inputData)

const response = resultData

console.log(response.results.time_data)
console.log(response.results.node_stats)


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