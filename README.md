# [CFS Simulator](cfs-sim.vercel.app/)
### A web-based simulator for the Completely Fair Scheduling algorithm used in the Linux Kernels

## Objective

The project aims to simulate the Completely Fair Scheduling (CFS) algorithm and visualize the Red-Black Tree formed along with displaying the Operations performed while the CFS algorithm is ran over a set of inputs provided by the user.

## CFS 

### Abstract

As per the documentation of the Linux kernel, most of the design of CFS can be summed up in a single sentence: CFS basically models an “ideal, precise multitasking CPU” on real hardware. 

On real hardware, only a single task can be run at once, so the concept of virtual runtime is introduced. The virtual runtime of a task specifies when its next time slice would start execution on the ideal multitasking CPU. In practice, the virtual runtime of a task is its actual runtime normalized to the total number of running tasks.

To accomodate Ideal Fair Scheduling within CFS, the values of minimum granularity and latency are maintained for the tasks.

The design of CFS does not use the standard data structures for the runqueues, but it uses a time-ordered Red Black Tree to build a timeline of future task execution.

Thus, CFS dispenses with fixed time slices and explicit priorities. The amount of time for a given task on a processor is computed dynamically as the scheduling context changes over the system's lifetime. 


### Scheduling in Linux
The scheduling system of Linux contains at least two scheduling algorithms, which are respectively for the ‘real-time processes’ and the ‘common processes’ that coexist in the linux kernel. The CFS algorithm is used by the ‘common processes’ Real time process are the ones whose response time requirements are very high, for instance, music or video players. Common process includes interactive processes and non interactive processes. Interactive processes, such as text editors, will sleep and wake up through mouse and keyboard continuously thus being I/O bound, while non-interactive processes, such as background maintenance process, have no high requirements for I/O and response time and thus will be CPU bound like a compiler.


### Target Latency
It is the minimum amount of time idealized to an infinitely small duration required for every runnable task to get at least one turn on the processor. Thus, it refers to the period in which all the tasks are scheduled at least once. If such a duration could be infinitely small, then each runnable task would have had a turn on the processor during any given timespan, which is approximated in real world and by default, it is 20ms. 


### Dynamic Slices
Each runnable task gets a 1/N slice of the target latency, where N is the number of tasks. The 1/N slice is not a fixed timeslice as it depends on the number of tasks currently contending for the processor which is dynamic as the system changes over time. Some processes terminate and new ones are spawned; runnable processes block and blocked processes become runnable. 


### Priority Weights
The traditional nice value is used to weight the 1/N slice: a low-priority nice value means that only some fraction of the 1/N slice is given to a task, whereas a high-priority nice value means that a proportionately greater fraction of the 1/N slice is given to a task. 


### Minimum Granularity
The operating system incurs overhead whenever a context switch occurs. To limit this overhead, there is a minimum amount of time (typically 1ms to 4ms) that any scheduled process must run before being preempted. This minimum is known as the minimum granularity. If many tasks are contending for the processor, then the minimum granularity might be more than the 1/N slice. If the minimum granularity turns out to be larger than the 1/N slice, the system is overloaded because there are too many tasks contending for the processor.


### Virtual Runtime
CFS tries to minimize context switches. Once a task gets the processor, it runs for its entire weighted 1/N slice before being preempted in favor of some other task. Virtual Runtime signifies the minimum time a process must run before preemption. It records how long a task has run on the processor for all the tasks runnable and blocked. The lower a task's virtual runtime, the more deserving the task is for time on the processor. CFS accordingly moves the tasks with low virtual runtime towards the front of the scheduling line which is implemented as a red-black tree.


### Sleeper Fairness
CFS lets the virtual runtime to be the major deciding factor for the scheduling, which supports sleeper fairness as the I/O bound tasks are usually granted a lower virtual runtime, and thus CFS moves those tasks towards the front of the scheduling line.


## Implementation of the Algorithm


### The Methodology

- The implementation for the simulation of CFS is divided into separate Client and Algorithm modules. 
- The Client takes the arrival times, burst times and priorities of each process as input and forwards them to the Algorithm module.
- The Algorithm module calculates the virtual runtimes based on some appropriately selected values of minimum granularity and latency for each process at each iteration/clock tick. The structure of the Red Black Tree and the data of the tasks generated are forwarded to the Client side. 
- The Client then generates a Red Black Tree with the collected data and simulates it synchronously with the output log of the operations performed on the tree.

We have implemented the CFS Algorithm using Red-Black Tree (RBT) in which each node has the following properties:
- Arrival Time
- Burst Time
- Priority
- Weight (Calculated on the basis of priority)
- Virtual Runtime
- Slice (Dynamically calculated on the basis of each tasks weight and the total weight of the currently available tasks)
- Latency and Granularity


### The Algorithm

1. Initially, a weight value is assigned to each of the tasks based on their respective priorities which is later used in step 4. to calculate slices for each of the currently available tasks in each iteration.
2. The tasks_queue is sorted on the basis of arrival time of each task.
3. At each unit of time, the tasks which have arrived at that point of time are inserted into the timeline (i.e, the RBT), their weights are added to the totalWeight variable.
4. Slices are updated for each of the tasks which have already arrived and have not yet completed their burst time.
5. If there is a task running currently, then if it’s vruntime > min_vruntime and it’s current_slice > slice and if it’s current slice is greater than the minimum granularity, then that task is inserted once again into the timeline and removed from the currently running status.
6. Now, if there is no task running currently, then the node with the minimum vruntime is extracted from the timeline and is removed from there.
7. The vruntime is incremented for the currently running task based on the weight of that task, truntime and slice of that process are increased by 1 unit. If the truntime of the task is now equal to it’s burst time, then that task is marked as completed and its weight is subtracted from the totalWeight.



## Implementation of The Simulation

The simulation is created at a web endpoint, which is built with React JS. The simulation is made with the help of the D3 library.


### D3

D3 allows you to bind arbitrary data to a Document Object Model (DOM), and then apply data-driven transformations to the documents by using the data to create interactive SVG components with smooth transitions and interaction.

#### Features

- D3 provides a way for efficient manipulation of documents and affords extraordinary flexibility, exposing the full capabilities of web standards such as HTML, SVG, and CSS. 
- D3 is extremely fast, supporting large datasets and dynamic behaviors for interaction and animation. 
- D3’s functional style allows code reuse.

#### Usage in this project

- Current Nodes Selections- .select() and .selectAll() : selects arbitrary sets of nodes.
- Tree Layout- layout.tree() : creates a tree-based layout on the DOM.
- Data Joins- .data() : binds the data to the layout.
- Entering and Exiting Node Selections- .enter() and .exit() : allows to select the incoming data for which new nodes are required to be created and select the outgoing nodes that got removed from the data. 
- Addition and Removal of Nodes- .append() and .remove() : Allows to create new nodes for incoming data and remove outgoing nodes that are no longer needed.
- Attributes- .attr() : Attributes can be specified with .attr() for selections, addition and removals.
- Styles, Durations and Transitions- .style(), .duration(), .delay() .transition() : helps to apply styles to the nodes, apply transitions and specify durations and delays to apply the effects. 


### The Simulation Paradigm

A functional simulation paradigm has been followed in this project to create the simulation of the red black tree data structure used inside the algorithm. To generate the results as per the elapsed times for each iteration within the algorithm, the computer clock is coupled with the algorithmic results to generate accurate time outputs while the simulation is generated with fixed delay factor on the elapsed time of each iteration to generate a visually satisfiable result.

That said, this is not a Live or Event based simulation. Technically, the algorithm runs first and generates all the data required for creating the simulation along with appropriate clock data to synchronize the results. This data is sent to the frontend which on each iteration on the data array, structures the data on that index into the required format, for example, the red-black tree or the operation log of a particular instant and generates the simulation for that instant which is followed by a delay on the execution before running the next iteration. In this way, the entire simulation is generated.


### Generating the Simulation

There are four major parts to the simulation: 
1. The Red black tree
2. The Red black tree Operations Log
3. The Log of the Tasks Ran at each clock tick
4. The synchronization among the above three

The data fetched majorly contains:
1. Array of the instances of the red black tree at each operation
2. Array of the tasks data
3. Array of the timing data
4. Total elapsed time 
5. Throughput (according to the computer clock)

The array of the instances of the red black tree is fed as a data join to the D3 Tree Layout. An automation function written in the frontend which updates the tree according to the change in data.

The changes in the tree and the operation log which describes each operation run at the tree are updated together at each clock tick and according to the timing data received, the tasks log are updated side by side. This timely call to the update methods is performed by setting up a decelerating timer.

Note that the Throughput generated is dependent upon the computer clock and so would not be a completely consistent value as it depends upon the current processing speed of the computer the algorithm is ran in.

The algorithm runs independent of a particular unit of time and thus generalized time units are used instead of actual time units while the “Elapsed Time” is computer clock time duration, thus specified in milliseconds. 



## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

