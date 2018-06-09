const Worker = require('webworker-threads').Worker;
const Events = require('events');


class AutoWebWorker{
    constructor(threadCount = AutoWebWorker.generateThreadCount()) {
      this.__maxThreadCount = threadCount;
      this.__totalThreads = 0;
      this.workersList = [];
      this.eventEmitter = new Events;
      console.log(this.__maxThreadCount);
    }

    static generateThreadCount() {
      return 10;
    }

    async createWorker(workerFunc) {
      let newWorker;
      if (this.__totalThreads < this.__maxThreadCount) {
        newWorker =  this.__assignThread(workerFunc);
      } else {
        newWorker = await this.__waitForThread(workerFunc);
      }

      this.workersList.push(newWorker);
      this.__totalThreads++;
      return newWorker
    }

    __assignThread(workerFunc) {
      const worker = new Worker(workerFunc);
      const handler = this.__setDataHandler(worker);
      return { worker, handler };
    }

    __setDataHandler(worker) {
      return new Promise((resolve, reject) => {
        worker.thread.once('message', (data) => {
          setImmediate(() => {
            resolve(data);
            this.__removeWorker(worker);
            this.eventEmitter.emit('worker-removed');
          });
        });
      });
    }

    __removeWorker(worker) {
      const threadId = worker.thread.id;
      worker.terminate();
      const workerIndex = this.workersList.findIndex(record => record.worker.thread.id === threadId);
      this.workersList.splice(workerIndex, 1);
      this.__totalThreads--;
    }

    __waitForThread(workerFunc) {
      return new Promise((resolve, reject) => {
        this.eventEmitter.once('worker-removed',() => {
          if (this.__totalThreads < this.__maxThreadCount) {
            setImmediate(() => resolve(this.__assignThread(workerFunc)));
          } else if (this.__totalThreads > this.__maxThreadCount) {
            reject(new Error('Thread stack overflow'));
          }
        });
      });
    }
}

module.exports = (count) => {
  return new AutoWebWorker(count)
};