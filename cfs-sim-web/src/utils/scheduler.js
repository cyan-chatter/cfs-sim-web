const chalk = require('chalk')
const _ = require('lodash')

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
    resultData: [],
    throughput: null,
    node_stats: null,
    elapsed_ms: null,
    syncTime: [],
    simData: []
}

function roundTo(n, digits) {
    if (digits === undefined) {
        digits = 0;
    }

    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    var test =(Math.round(n) / multiplicator);
    return +(test.toFixed(digits));
}

function saveTimeline(val, id, message, op, isVal, isId, isM, start_ms) {
    const newSimTree = {
        val, id, message, op, isVal, isId, isM
    }
    const et = (new Date().getTime()) - start_ms
    response.simData.push(newSimTree)
    response.syncTime.push(et)
}

var totalWeight;

function updateSlices(tasks, period, curTime) {
    console.log("Updating Slices at time ", curTime);

    var sliceData = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].arrival_time > curTime) {
            continue;
        }
        if (tasks[i].truntime === tasks[i].burst_time) {
            continue;
        }
        console.log("tasks data ", tasks[i].id, tasks[i].truntime, tasks[i].burst_time)
        tasks[i].slice = (tasks[i].weight * period) / (1000 * totalWeight); // divide by 1000 to convert to ms
        console.log("period = " + period + " priority_sum = " + totalWeight);
        console.log("Task " + tasks[i].id + " has slice = " + tasks[i].slice.toFixed(3));
        const slice = {
            period: period.toFixed(2),
            totalWeight: totalWeight,
            taskId: tasks[i].id,
            taskSlice: tasks[i].slice.toFixed(2)
        }
        sliceData.push(slice)
    }
    return sliceData
}

function updateWeights(tasks) {
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].weight = Math.pow(1.25, -1 * tasks[i].priority) * 1024;
    }
}

// Run every time a new task is added
function updateSummationWeights(value) {
    totalWeight += value;
}

// runScheduler: Run scheduler algorithm
function runScheduler(tasks, timeline) {

    //var simTree = new rbt.RBT()
    var start_ms = new Date().getTime();
    binaryTree.RESET_STATS();

    saveTimeline(-1, "-", "Scheduler Begins the Operations", "s", 0, 0, 1, start_ms)
    //var resultData = []
    // queue of tasks sorted in arrival_time order
    var time_queue = tasks.task_queue;
    time_queue.sort(function (a, b) {
        return a.arrival_time - b.arrival_time;
    });
    updateWeights(time_queue)
    // index into time_queue of the next nearest task to start
    var time_queue_idx = 0;

    // min_vruntime is set to the smallest vruntime of tasks on the
    // timeline
    var min_vruntime = 0;

    // current running task or null if no tasks are running.
    // Initialize statistics gathering

    var tasksCompleted = 0

    // Loop from time/tick 0 through the total time/ticks specified
    var running_task = null;

    // Min time process can run before preemption
    const min_granularity = 750;

    // Period in which all tasks are scheduled at least once
    const latency = 6000;

    totalWeight = 0;

    // Loop from time/tick 0 through the total time/ticks specified
    for (var curTime = 0;; curTime++) {
        if(tasksCompleted === time_queue.length) break;
        var curTask = null
        if (running_task != null) curTask = running_task
        // Periodic debug output
        if (curTime % 500 === 0) {
            //console.error("curTime: " + curTime + ", size: " + timeline.size() + ", task index: " + time_queue_idx);
        }

        // Results data for this time unit/tick
        let tresults = {
            running_task: null,
            completed_task: null,
            elapsedTime: null,
            sliceData: null
        };


        // Check tasks at the beginning of the task queue. Add any to
        // the timeline structure when the arrival_time for those tasks
        // has arrived.
        while (time_queue_idx < time_queue.length && curTime >= time_queue[time_queue_idx].arrival_time) {
            var new_task = time_queue[time_queue_idx++];
            // new tasks get their vruntime set to the current
            // min_vruntime
            new_task.vruntime = min_vruntime;
            new_task.truntime = 0;
            new_task.this_slice = 0;
            new_task.actual_arrival_time = curTime;
            timeline.insert(new_task);
            updateSummationWeights(new_task.weight)
            const message = "Inserting " + new_task.id + " with Virtual Runtime " + new_task.vruntime + " units"
            saveTimeline(new_task.vruntime, new_task.id, message, 'i', 1, 1, 1, start_ms)
            //results.timelineData.push({...timeline})----------------timelineData
        }

        tresults.sliceData = updateSlices(tasks.task_queue, Math.max(latency, min_granularity * (time_queue.length - tasksCompleted)), curTime)

        // If there is a task running and its vruntime exceeds
        // min_vruntime then add it back to the timeline. Since
        // vruntime is greater it won't change min_vruntime when it's
        // added back to the timeline.
        if (curTask && (curTask.vruntime > min_vruntime) && (curTask.this_slice > curTask.slice)
            && (curTask.this_slice > min_granularity / 1000)) {
            timeline.insert(curTask)
            console.log(curTask.vruntime)////////////////
            const message = "Inserting " + curTask.id + " with Virtual Runtime " + roundTo(curTask.vruntime, 3) + " units"
            console.log(message)
            console.log(curTask)
            //results.timelineData.push({...timeline})----------------timelineData
            saveTimeline(curTask.vruntime, curTask.id, message, 'i', 1, 1, 1, start_ms)
            curTask = null
        }

        // If there is no running task (which may happen right after
        // the running_task is added back to the timeline above), find
        // the task with the smallest vruntime on the timeline, remove
        // it and set it as the running_task and determine the new
        // min_vruntime.
        if (!curTask && timeline.size() > 0) {
            var min_node = timeline.min();
            curTask = min_node.val;
            curTask.this_slice = 0;
            //simTree.remove(simTree.min());
            var message = "Removing " + curTask.id + " with Virtual Runtime " + roundTo(curTask.vruntime, 3) + " units"
            console.log(message)
            console.log(curTask)
            timeline.remove(min_node);
            if (timeline.size() > 0) {
                min_vruntime = timeline.min().val.vruntime
                message += ", Updating Minimum Virtual Runtime to " + roundTo(min_vruntime, 3) + " units"
            }
            //results.timelineData.push({...timeline})----------------timelineData
            saveTimeline(-1, curTask.id, message, "r", 0, 1, 1, start_ms)
        }

        // Update the running_task (if any) by increasing the vruntime
        // and the truntime. If the running task has run for it's full
        // burst_time then report it as completed and set running_task
        // to null.
        var task_done = false;
        if (curTask) {
            curTask.vruntime += 1024 / curTask.weight;
            curTask.truntime++;
            curTask.this_slice++;
            tresults.running_task = curTask;
            //console.log(curTime + ": " + curTask.id);
            if (curTask.truntime >= curTask.burst_time) {
                ++tasksCompleted
                curTask.completed_time = curTime
                tresults.completed_task = curTask
                updateSummationWeights(-1 * curTask.weight)
                task_done = true // Set curTask to null later
                console.log("Completed task:", curTask.id);
                const message = curTask.id + " has Completed"
                saveTimeline(-1, "-", message, "n", 0, 0, 1, start_ms)
            }
        }

        tresults.num_tasks = timeline.size() + (running_task ? 1 : 0);
        tresults.elapsedTime = (new Date().getTime()) - start_ms

        response.resultData.push({...tresults})

        if (task_done) {
            curTask = null;
        }

        running_task = curTask
    }

    // Put any currently running task back in the timeline
    if (running_task) {
        timeline.insert(running_task)
        const message = running_task.id + " is Running"
        saveTimeline(-1, running_task.id, message, "n", 0, 1, 1, start_ms)
    }

    response.node_stats = binaryTree.GET_STATS()
    response.elapsed_ms = (new Date().getTime()) - start_ms
    response.throughput = response.elapsed_ms / tasks.num_of_tasks

    //binaryTree.RESET_STATS();

    saveTimeline(-1, "-", "Scheduler Operations are Over", "n", 0, 0, 1, start_ms)

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

    for (var i = 0; i < results.length; i++) {
        var t = results[i];
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
    for (var i = 0; i < results.length; i++) {
        var t = results[i],
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
    // for (var r in results.node_stats.read) {
    //     reads += results.node_stats.read[r];
    // }
    // for (var r in results.node_stats.write) {
    //     writes += results.node_stats.write[r];
    // }
    // total = reads + writes;

    // if (mode === 'csv') {
    //     // Report summary statistics
    //     // header is printed by caller
    //     out += tasks.num_of_tasks + ",";
    //     out += tasks.total_time + ",";
    //     out += completed + ",";

    //     out += results.elapsed_ms + ",";
    //     out += reads + ",";
    //     out += writes + ",";
    //     out += total + ",";
    //     out += (completed / results.elapsed_ms) + ",";
    //     out += (completed / total);
    // } else {
    //     // Report summary statistics
    //     out += "Total Tasks: " + tasks.num_of_tasks + "\n";
    //     out += "Total Time: " + tasks.total_time + "\n";
    //     out += "Completed Tasks: " + completed + "\n";

    //     out += "Wallclock elapsed time: " + results.elapsed_ms + "ms\n";
    //     out += "Node operations reads  : " + reads + "\n";
    //     out += "                writes : " + writes + "\n";
    //     out += "                total  : " + total + "\n";
    //     out += "Throughput: " + (completed / results.elapsed_ms) + " completed tasks/ms\n";
    //     out += "            " + (completed / total) + " completed tasks/operation\n";
    //     //console.log("Tasks per tick:", tasks_per_tick);
    // }

    return out;
}

function getTimeline() {
    function vsort(a, b) {
        return a.val.vruntime - b.val.vruntime;
    }

    return rbt.RBT(vsort)
}

var nil = binaryTree.NIL

const cfsScheduler = {
    runScheduler, generateReport, getTimeline, nil
}

export default cfsScheduler

