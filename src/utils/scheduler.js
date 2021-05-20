if (typeof module !== 'undefined') {
    var binaryTree = require('./bint'),
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

 //data collection
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

    var sliceData = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].arrival_time > curTime) {
            continue;
        }
        if (tasks[i].truntime === tasks[i].burst_time) {
            continue;
        }
        tasks[i].slice = (tasks[i].weight * period) / (1000 * totalWeight)
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

//scheduler algorithm
function runScheduler(tasks, timeline) {

    var start_ms = new Date().getTime();
    
    saveTimeline(-1, "-", "Scheduler Begins the Operations", "s", 0, 0, 1, start_ms)    
    
    // queue of tasks sorted in arrival_time order
    var time_queue = tasks.task_queue;
    time_queue.sort(function (a, b) {
        return a.arrival_time - b.arrival_time;
    });
    updateWeights(time_queue)

    // index into time_queue of the next nearest task to start
    var time_queue_idx = 0;

    // min_vruntime is set to the smallest vruntime of tasks on the timeline
    var min_vruntime = 0;

    var tasksCompleted = 0
    
    // current running task or null if no tasks are running.
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

        // Results data for this time unit/tick
        let tresults = {
            running_task: null,
            completed_task: null,
            elapsedTime: null,
            sliceData: null
        };


        // Check tasks at the beginning of the task queue. Add any to the timeline structure when the arrival_time for those tasks has arrived.
        while (time_queue_idx < time_queue.length && curTime >= time_queue[time_queue_idx].arrival_time) {
            var new_task = time_queue[time_queue_idx++];
            new_task.vruntime = min_vruntime;
            new_task.truntime = 0;
            new_task.this_slice = 0;
            new_task.actual_arrival_time = curTime;
            timeline.insert(new_task);
            totalWeight += new_task.weight;
            const message = "Inserting " + new_task.id + " with Virtual Runtime " + new_task.vruntime + " units"
            saveTimeline(new_task.vruntime, new_task.id, message, 'i', 1, 1, 1, start_ms)
            
        }

        tresults.sliceData = updateSlices(time_queue, Math.max(latency, min_granularity * (time_queue.length - tasksCompleted)), curTime)

        // If there is a task running and its vruntime exceeds min_vruntime then add it back to the timeline. 
        // Since vruntime is greater it won't change min_vruntime when it's added back to the timeline.
        if (curTask && (curTask.vruntime > min_vruntime) && (curTask.this_slice > curTask.slice)
            && (curTask.this_slice > min_granularity / 1000)) {
            timeline.insert(curTask)
            const message = "Inserting " + curTask.id + " with Virtual Runtime " + curTask.vruntime.toFixed(3) + " units"
            saveTimeline(curTask.vruntime, curTask.id, message, 'i', 1, 1, 1, start_ms)
            curTask = null
        }

        // If there is no running task (which may happen right after the running_task is added back to the timeline above),
        // find the task with the smallest vruntime on the timeline, remove it and set it as the running_task and determine the new min_vruntime.
        if (!curTask && timeline.size() > 0) {
            var min_node = timeline.min();
            curTask = min_node.val;
            curTask.this_slice = 0;
            var message = "Removing " + curTask.id + " with Virtual Runtime " + curTask.vruntime.toFixed(3) + " units"
            timeline.remove(min_node);
            if (timeline.size() > 0) {
                min_vruntime = timeline.min().val.vruntime
                message += ", Updating Minimum Virtual Runtime to " + min_vruntime.toFixed(3) + " units"
            }
            saveTimeline(-1, curTask.id, message, "r", 0, 1, 1, start_ms)
        }

        // Update the running_task (if any) by increasing the vruntime
        // and the truntime. If the running task has run for it's full burst_time then report it as completed and set running_task to null.
        var task_done = false;
        if (curTask) {
            curTask.vruntime += 1024 / curTask.weight;
            curTask.truntime++;
            curTask.this_slice++;
            tresults.running_task = curTask;
            if (curTask.truntime >= curTask.burst_time) {
                ++tasksCompleted
                curTask.completed_time = curTime
                tresults.completed_task = curTask
                totalWeight += (-1 * curTask.weight);
                task_done = true 
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

    saveTimeline(-1, "-", "Scheduler Operations are Over", "n", 0, 0, 1, start_ms)

    return response
}

function getTimeline() {
    function vsort(a, b) {
        return a.val.vruntime - b.val.vruntime;
    }

    return rbt.RBT(vsort)
}

var nil = binaryTree.NIL

const cfsScheduler = {
    runScheduler, getTimeline, nil
}

export default cfsScheduler

