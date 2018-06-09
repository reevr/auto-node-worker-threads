# Auto-Web-Worker 
This module can be used to utilize threading concept in nodeJS efficiently by limiting the number of threads to be used per process , by handling the requirements based on the availability of threads.

The availability of threads is maintained by the user while requiring the module.

This module automatically handles the thread allocation even if the requirements of worker threads goes beyond the maximum threads limit as mentioned by the user, by queueing up the latest Worker thread request and waiting until any thread finshes executing its task.

##### This module is based on node-webworker-threads.
##### NOTE:  If you want to utilize thirdparty modules or any libraries , you may use the child process concept as threads only support plain javascript execution.

## Why do you need to limit the number of threads to be used?
Even though many number of threads can be created and used, there exist a certain number to which, if gone below or beyond, cannot provide the best execution speed or reduction in execution time, due to overhead and state tracking of threads and other parameters.

## Threading vs Child-process 
Child process utilizes only one thread and has a limitation on number of child processes to be forked.
Whereas threads allow to execute plain javascriot code in parallel, therefore reducing the exection time.

# Installation

```
npm i auto-worker-threads
```

### Example usage
```
const autoWorker = require('auto-worker-threads')(2);

var workerFunc = () => {
    for (let i = 0; i < 3000000000; i++) {}
    postMessage('worker work finished');
}

const bootFunc = async () => {
    const [worker1, worker2] = await Promise.all([AutoWorker.createWorker(func), AutoWorker.createWorker(func)]);
    return await Promise.all([worker1.handler,worker2.handler,worker3.handler, worker4.handler, worker5.handler, worker6.handler, worker7.handler, worker8.handler]);
}

bootFunc()
.then((data) => {
    console.log(process.hrtime(time));
})

```

