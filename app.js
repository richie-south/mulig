'use strict'

const gSuccessFn = (value, index, isDone, prev) => prev
const gErrorFn = (value, index, isDone, prev) => prev

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

  const _ = fn => (value, index) => {
    nrOfRuns++
    const isEqualLength = nrOfRuns === totalLength
    returnedValue = fn(value, index, isEqualLength, returnedValue)
  }

  return [_(successFn), _(errorFn)]
}

/**
 * runs fn on order of fastest to resolve
 * PARAMS CHECK: promiseMapFn 
 */
const mulig = (promises, successFn = gSuccessFn, errorFn = gErrorFn) => {
  const totalLength = promises.length
  const [_successFn, _errorFn] = addIsDoneAndReturnedValue(totalLength, successFn, errorFn)
  return promiseMapFn(promises, _successFn, _errorFn)      
}

/**
 * first in array: first to call fn
 * runs fn in order of given array: as fast as posible
 * PARAMS CHECK: promiseMapFn
 */
const queue = (promises, successFn = gSuccessFn, errorFn = gErrorFn) => {

  const queue = []
  const [_successFn, _errorFn] = addIsDoneAndReturnedValue(promises.length, successFn, errorFn)

  /**
   * Runs queue in order of promises array
   */
  const runQueue = () => {
    const queueIterator = queue[Symbol.iterator]()

    for (const item of queueIterator) {
      if (!item) {
        return
      } else if (!item.hasRun) {
        const { fn, value, index } = item
        queue[index].hasRun = true
        fn(value, index)
      }
    }
  }

  /**
   * adds value, index and fn object to queue
   * runs runQueue
   * @param {fn} [fn to pass in queue object]
   * @returns [Function] [function to take the rest params]
   * 
   * @param {any} value 
   * @param {Number} index 
   */
  const addToQueue = fn => (value, index) => {
    queue[index] = { value, index, hasRun: false, fn }
    runQueue()
  }

  return promiseMapFn(promises, addToQueue(_successFn), addToQueue(_errorFn))
}

/**
 * Reverse queue
 * last in array: first to call fn
 * @return [Array of promises in same order as given]
 */
const stack = (promises, successFn = gSuccessFn, errorFn = gErrorFn) =>
  queue(promises.reverse(), successFn, errorFn).reverse()

module.exports = mulig
module.exports.queue = queue
module.exports.stack = stack
