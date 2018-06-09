const Worker = require('webworker-threads').Worker;

class AutoWebWorker {
    constructor(threadCount = AutoWebWorker.generateThreadCount()) {
      this.__maxThreadCount = threadCount;
      this.__totalThreads = 0;
      this.workersList = [];
    }

    static generateThreadCount() {
      return 10;
    }

    async createWorker(workerFunc) {
      let newWorker;
      if (this.__totalThreads < this.__maxThreadCount) {
        newWorker =  this.assignThread(workerFunc);
      } else {
        newWorker = await this.waitForThread(workerFunc);
      }

      this.workersList.push(newWorker);
      this.__totalThreads++;
      return newWorker
    }

    __assignThread(workerFunc) {
      // workerFunc =  this.formatFunc(workerFunc);
      const worker = new Worker(workerFunc);
      const handler = this.__setDataHandler(worker);
      return { worker, handler };
    }

    __setDataHandler(worker) {
      return new Promise((resolve, reject) => {
        worker.once('onmessage', (event) => {
          return resolve(event.data);
        });
        worker.once('error', (err) => {
          return reject(err);
        });
      });
    }

    __waitForThread(workerFunc) {
      return Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (this.__totalThreads < this.__maxThreadCount) {
            clearInterval(timer);
            resolve(this.assignThread(workerFunc));
          } else if (this.__totalThreads > this.__maxThreadCount) {
            reject(new Error('Thread stack overflow'));    
          }
        }, 50);
      });
    }

    formatFunc(workerFunc) {
        const funcString = workerFunc.toString();
        funcString.substring(funcString.indexOf('{'), funcString.length)
        return function() {
            // under construction :-D .
        }
    }
}