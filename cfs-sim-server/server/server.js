const express = require('express')
const app = express()
app.use(express.json())
const port = 5500


//write your code here
const schedulerMain = (inputData) => {
    
    var answer = null
    
    //store the final answer in this response variable
    //this will be JS object of the following format:
    /* 
    answer = {
        finalAnswer : [ {RB Tree Instance 1}, {RB Tree Instance 2}, {RB Tree Instance 3} ] 
    }
    */
    //you dont need to parse it to JSON String This server will automatically do that
    //consider this function your main function




    
    return answer
}

app.post('/', function (req, res) {
  console.log(req.body)
  const inputData = req.body
  /* 
    Input in this form:
    
    {
        number : "3",
        tq : "11",
        pd: [
            {PID : "A", AT : "12", BT : "23"},
            {PID : "A", AT : "12", BT : "23"},
            {PID : "A", AT : "12", BT : "23"}
        ]
    }

  */

    console.log(inputData) 
    const response = schedulerMain(inputData)
    console.log(response)
    res.send(response)
})

app.listen(port, () => {
    console.log("server is up at port " + port)
})