# [CFS Simulator](cfs-sim.vercel.app/)
### A web-based simulator for the Completely Fair Scheduling algorithm used in the Linux Kernels

## Objective

The project aims to simulate the Completely Fair Scheduling (CFS) algorithm and visualize the Red-Black Tree formed along with displaying the Operations performed while the CFS algorithm is ran over a set of inputs provided by the user.

## CFS 

As per the documentation of the Linux kernel, most of the design of CFS can be summed up in a single sentence: CFS basically models an “ideal, precise multitasking CPU” on real hardware.

On real hardware, only a single task can be run at once, so the concept of virtual runtime is introduced. The virtual runtime of a task specifies when its next time slice would start execution on the ideal multitasking CPU. In practice, the virtual runtime of a task is its actual runtime normalized to the total number of running tasks.

To accomodate Ideal Fair Scheduling within CFS, the values of minimum granularity and latency are maintained for the tasks.

The design of CFS does not use the standard data structures for the runqueues, but it uses a time-ordered Red Black Tree to build a timeline of future task execution.

Thus, CFS dispenses with fixed time slices and explicit priorities. The amount of time for a given task on a processor is computed dynamically as the scheduling context changes over the system's lifetime. 


## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

