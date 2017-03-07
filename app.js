'use strict'

/**
 * runs fn on order of fastest to resolve
 * @param  {Array}    promises [array of promise]
 * @param  {Function} fn       [resolve function, this runs when a promise resolves]
 * @param  {Function} errorFn  [error function, this runs when a promise throws an error]
 * @return {Array}             [returns given array]
 */
const promiseMapFn = (promises, successFn, errorFn) => 
  promises.map((item, index) => {
    item
      .then(value => successFn(value, index))
      .catch(error => errorFn(error, index))
    return item    
  })

/**
 * Adds abillity to pass return values between function calls 
 * Adds abillity to check if last callback
 * @param {Number} totalLength 
 * @param {Function} successFn 
 * @param {Function} errorFn 
 * @returns [Array] [array of Functions]
 */
const addIsDoneAndReturnedValue = (totalLength, successFn, errorFn) => {
  let nrOfRuns = 0
  let returnedValue

  const _run = (fn) => (value, index) => {
    nrOfRuns++
    const isEqualLength = nrOfRuns === totalLength
    returnedValue = fn(value, index, isEqualLength, returnedValue)
  }

  return [_run(successFn), _run(errorFn)]
}

/**
 * runs fn on order of fastest to resolve
 * PARAMS CHECK: promiseMapFn 
 */
const mulig = (promises, fn = () => {}, errorFn = () => {}) => 
    promiseMapFn(promises, fn, errorFn)

/**
 * first in array: first to call fn
 * runs fn in order of given array: as fast as posible
 * PARAMS CHECK: promiseMapFn
 */
const queue = (promises, successFn = () => {}, errorFn = () => {}) => {
  
  const queue = []
  
  /**
   * Runs queue in order of promises array
   */
  const runQueue = () => {
    const queueIterator = queue[Symbol.iterator]()
    
    /**
     * array of items from queue to run
     * @param {Iterator} queueItr [iterator]
     * @return [a array of newly resoved item]
     */
    const queueToRun = ((queueItr) => {
      const _queue = []
      for(const item of queueItr){
        if(!item){
          return _queue
        }else if(!item.hasRun){
          queue[item.index].hasRun = true
          _queue.push(item)  
        }
      }
      return _queue
    })(queueIterator)
    
    queueToRun.forEach(({value, index}) => fn(value, index))
  }
  
  /**
   * adds value, index to queue
   * runs runQueue
   * @param {any} value 
   * @param {Number} index 
   */
  const addToQueue = (value, index) => {
    queue[index] = { value, index, hasRun: false }
    runQueue()
  }
  
  return promiseMapFn(promises, addToQueue, errorFn)
}

/**
 * Reverse queue
 * last in array: first to call fn
 * @return [Array of promises in same order as given]
 */
const stack = (promises, successFn = () => {}, errorFn = () => {}) => 
  queue(promises.reverse(), successFn, errorFn).reverse()

module.exports = mulig
module.exports.queue = queue
module.exports.stack = stack

// deprecated
module.exports.inOrder = (...args) => {
  console.log('.inOrder() is deprecated! Use .queue() instead!')
  return queue(...args)
}