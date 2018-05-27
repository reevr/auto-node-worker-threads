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
      workerFunc =  this.formatFunc(workerFunc);
      return new Worker(workerFunc);
    }

    __waitForThread(workerFunc) {
      return Promise((resolve, reject) => {
        setInterval(() => {
          if (this.__totalThreads < this.__maxThreadCount) {
            resolve(this.assignThread());
          } else if (this.__totalThreads > this.__maxThreadCount) {
            reject(new Error('Thread count overflow'));    
          }
        }, 50);
      });
    }

    formatFunc(workerFunc) {
        const funcString = workerFunc.toString();
        funcString.substring(funcString.indexOf('{'), funcString.length)
    }
}