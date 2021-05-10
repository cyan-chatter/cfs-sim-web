const chalk = require('chalk')

// Node vs browser behavior
if (typeof module !== 'undefined') {
    var binaryTree = require('./bint'),
        bst = require('./bst'),
        rbt = require('./rbt')
} else {
    var scheduler = {},
        exports = scheduler;
}

var response = {
    resultData : [],
    node_stats : null,
    elapsed_ms : null,
    simTrees : []
}


function saveTimeline(simTree,task,taskId,message){
    if(simTree !== null) response.simTrees.push(simTree)
}

// runScheduler: Run scheduler algorithm
function runScheduler(tasks, timeline) {

    
    var simTree = new rbt.RBT()
    saveTimeline(simTree,null,"-"," ")
    //var resultData = []

    // queue of tasks sorted in arrival_time order
    var time_queue = tasks.task_queue;
    // index into time_queue of the next nearest task to start
    var time_queue_idx = 0;

    // min_vruntime is set to the smallest vruntime of tasks on the
    // timeline
    var min_vruntime = 0;

    // current running task or null if no tasks are running.
    // Initialize statistics gathering

    var start_ms = new Date().getTime();
    binaryTree.RESET_STATS();
    var tasksCompleted = 0

    var results = {time_data: [], timelineData: []}

    // Loop from time/tick 0 through the total time/ticks specified
    var running_task = null;

    // Loop from time/tick 0 through the total time/ticks specified
    for (var curTime = 0; curTime < tasks.total_time; curTime++) {
        var curTask = null
        if(running_task != null) curTask = {...running_task}
        // Periodic debug output
        if (curTime % 500 === 0) {
            //console.error("curTime: " + curTime + ", size: " + timeline.size() + ", task index: " + time_queue_idx);
        }

        // Results data for this time unit/tick
        var tresults = {
            running_task: null,
            completed_task: null
        };

        

        // Check tasks at the beginning of the task queue. Add any to
        // the timeline structure when the arrival_time for those tasks
        // has arrived.
        while (time_queue_idx < time_queue.length && curTime >= time_queue[time_queue_idx].arrival_time) {
            var new_task = {...time_queue[time_queue_idx++]};
            // new tasks get their vruntime set to the current
            // min_vruntime
            new_task.vruntime = min_vruntime;
            new_task.truntime = 0;
            new_task.actual_arrival_time = curTime;
            timeline.insert(new_task);
            
            simTree.insert('n', new_task.vruntime, new_task.id)
            const message = "Adding " + new_task.id + " with vruntime " + new_task.vruntime
            saveTimeline(simTree,new_task,new_task.id,message)
            //results.timelineData.push({...timeline})----------------timelineData
        }

        // If there is a task running and its vruntime exceeds
        // min_vruntime then add it back to the timeline. Since
        // vruntime is greater it won't change min_vruntime when it's
        // added back to the timeline.
        if (curTask && (curTask.vruntime > min_vruntime)) {
            timeline.insert(curTask)
            
            simTree.insert('n', curTask.vruntime, curTask.id)
            const message = "Inserting " + curTask.id + " with vruntime " + curTask.vruntime
            //results.timelineData.push({...timeline})----------------timelineData
            curTask = null
            saveTimeline(simTree,curTask,"-",message)
        }

        // If there is no running task (which may happen right after
        // the running_task is added back to the timeline above), find
        // the task with the smallest vruntime on the timeline, remove
        // it and set it as the running_task and determine the new
        // min_vruntime.
        if (!curTask && timeline.size() > 0) {
            var min_node = timeline.min();
            curTask = min_node.val;
            timeline.remove(min_node);

            simTree.remove(simTree.min());
            var message = "Removing " + curTask.id + " with vruntime " + curTask.vruntime
            //results.timelineData.push({...timeline})----------------timelineData
            if (timeline.size() > 0) {
                min_vruntime = timeline.min().val.vruntime
                message += " Updating min_vruntime to " + min_vruntime
            }
            saveTimeline(simTree,curTask,curTask.id,message)
        }

        // Update the running_task (if any) by increasing the vruntime
        // and the truntime. If the running task has run for it's full
        // burst_time then report it as completed and set running_task
        // to null.
        var task_done = false;
        if (curTask) {
            curTask.vruntime += Math.max(1, (time_queue.length - tasksCompleted) / curTask.priority);
            curTask.truntime++;
            tresults.running_task = curTask;
            //console.log(curTime + ": " + curTask.id);
            if (curTask.truntime >= curTask.burst_time) {
                ++tasksCompleted
                curTask.completed_time = curTime
                tresults.completed_task = curTask
                task_done = true; // Set curTask to null later
                //console.log("Completed task:", curTask.id);
                const message = curTask.id + " is over"
                saveTimeline(null,curTask,"-",message)
            }
        }

        tresults.num_tasks = timeline.size() + (running_task ? 1 : 0);
        
        // console.log("pure tresults in each iteration ->") 
        // console.log(tresults.running_task)
        // console.log(tresults.completed_task)
        // console.log(tresults.num_tasks)
        
        results.time_data.push({...tresults})////////////////
        
        // for(let j of results.time_data){
        //     for(var key in j.running_task){
        //         console.log(chalk.blueBright(key, j.running_task[key]))
        //     }
        // }

        
        
        // if (callback) {
        //     callback(curTime, results);
        // }

        const tempRes = new Object({...results});
        response.resultData.push(tempRes.time_data)
        // console.log("pushed..\n", tempRes.timelineData)
        // for(let i of tempRes.timelineData){
        //     for(var key in i){
        //         console.log(key, i[key])
        //     }
        // }

        // for(let i of resultData){
        
        //     //time_data
        //         for(let j of i.time_data){
                    
        //             for(var key in j.running_task){
        //                 console.log(chalk.green(key, j.running_task[key]))
        //             }
        //         }
        
        //     //timelineData
        //     // for(let j of i.timelineData){
                
        //     //     for(var key in j){
        //     //         console.log(chalk.cyanBright(key, j[key]))
        //     //     }
        //     // }    
            
        // }


        if (task_done) {
            curTask = null;
        }

        running_task = curTask
    }

    // Put any currently running task back in the timeline
    if (running_task) {
        timeline.insert(running_task)
        const message = running_task.id + " is running"
        saveTimeline(null,running_task.id,message)
        //results.timelineData.push({...timeline})----------------timelineData
    }

    response.node_stats = binaryTree.GET_STATS()
    response.elapsed_ms = (new Date().getTime()) - start_ms 

    //binaryTree.RESET_STATS();
    //results.node_stats = binaryTree.GET_STATS();
    //results.elapsed_ms = (new Date().getTime()) - start_ms;
    //const tempRes = new Object({...results});
    

    /////////////////////////////////////check
    const tempRes = new Object({...results});
    response.resultData.push(tempRes.time_data)
    ////////////////////////////////////check

    response.node_stats = binaryTree.GET_STATS();
    response.elapsed_ms = (new Date().getTime()) - start_ms;
    
    // console.log("pushed..\n", temp.time_data)

    // for(let i of response.resultData){
    //     for(let j of i){
    //         // console.log("j -> ", j)
    //         for(var key in j.running_task){
    //             console.log(chalk.cyanBright(key, j.running_task[key]))
    //         }
    //     }
    // }

    return response
}






//-------------------------------------------------------//

function generateSummary(tasks, timeline, results) {
    var out = "", tnodes = [], hvals = [];
    timeline.reduce(null, function (_, node) {
        var task = node.val;
        tnodes.push(task.id + ":" + task.vruntime +
            (node.color ? "/" + node.color : ""));
    }, "in");

    //results.timelineData.push({...timeline})----------------timelineData

    for (var i = 0; i < results.time_data.length; i++) {
        var t = results.time_data[i];
        hvals.push(t.running_task ? t.running_task.id : "_");
    }
    out += "Timeline: ";
    out += tnodes.join(",");
    out += "\nTask history: ";
    out += hvals.join(",");
    out += "\n";
    return out;

}


function generateReport(tasks, timeline, results, mode) {
    var reads = 0, writes = 0, total = 0, completed = 0, out = "";

    switch (mode) {
        case 'summary':
        case 'csv':
        case 'report':
        case 'detailed':
            break;
        default:
            throw new Error("Unknown reporting mode '" + mode + "'");
    }


    if (mode === "summary") {
        return generateSummary(tasks, timeline, results);
    }

    // General info on the original tasks
    if (mode === 'detailed') {
        out += "Task Queue:\n";
        for (var i = 0; i < tasks.task_queue.length; i++) {
            var t = tasks.task_queue[i];
            out += t.id + " " + t.arrival_time + " " + t.burst_time + "\n";
            //console.log(tasks.task_queue);
        }
    }

    // A chronological summary of the state at each time
    if (mode === 'detailed') {
        out += "\ntime [tasks]: running_task, completed?\n";
    }
    for (var i = 0; i < results.time_data.length; i++) {
        var t = results.time_data[i],
            msg = "  " + i + " [" + t.num_tasks + "]: ";
        if (t.running_task) {
            msg += t.running_task.id;
        }
        if (t.completed_task) {
            msg += ", Completed";
            completed++;
        }
        if (mode === 'detailed') {
            out += msg + "\n";
        }
    }

    // Sum all the reads and writes
    for (var r in results.node_stats.read) {
        reads += results.node_stats.read[r];
    }
    for (var r in results.node_stats.write) {
        writes += results.node_stats.write[r];
    }
    total = reads + writes;

    if (mode === 'csv') {
        // Report summary statistics
        // header is printed by caller
        out += tasks.num_of_tasks + ",";
        out += tasks.total_time + ",";
        out += completed + ",";

        out += results.elapsed_ms + ",";
        out += reads + ",";
        out += writes + ",";
        out += total + ",";
        out += (completed / results.elapsed_ms) + ",";
        out += (completed / total);
    } else {
        // Report summary statistics
        out += "Total Tasks: " + tasks.num_of_tasks + "\n";
        out += "Total Time: " + tasks.total_time + "\n";
        out += "Completed Tasks: " + completed + "\n";

        out += "Wallclock elapsed time: " + results.elapsed_ms + "ms\n";
        out += "Node operations reads  : " + reads + "\n";
        out += "                writes : " + writes + "\n";
        out += "                total  : " + total + "\n";
        out += "Throughput: " + (completed / results.elapsed_ms) + " completed tasks/ms\n";
        out += "            " + (completed / total) + " completed tasks/operation\n";
        //console.log("Tasks per tick:", tasks_per_tick);
    }

    return out;
}

function getTimeline() {
    function vsort(a, b) {
        return a.val.vruntime - b.val.vruntime;
    }

    return rbt.RBT(vsort);
}

var nil = binaryTree.NIL

const cfsScheduler = {
    runScheduler, generateReport, getTimeline, nil
}

export default cfsScheduler

