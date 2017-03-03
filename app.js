'use strict'


/**
 * runs fn on order of fastest to resolve
 * @param  {Array}    promises [array of promise]
 * @param  {Function} fn       [resolve function, this runs when a promise resolves]
 * @param  {Function} errorFn  [error function, this runs when a promise throws an error]
 * @return {Array}             [returns given array]
 */
const promiseMapFn = (promises, fn, errorFn) => 
  promises.map((item, index) => {
    item
      .then(value => fn(value, index))
      .catch(errorFn)
    return item    
  })

/**
 * runs fn on order of fastest to resolve
 * PARAMS CHECK: promiseMapFn 
 */
const mulig = (promises, fn = () => {}, errorFn = () => {}) => 
    promiseMapFn(promises, fn, errorFn)

/**
 * runs fn in order of given array: as fast as posible
 * PARAMS CHECK: promiseMapFn
 */
const queue = (promises, fn = () => {}, errorFn = () => {}) => {
  
  const queue = []
  
  const runQueue = () => {
    const queueIterator = queue[Symbol.iterator]()
    
    const queueToRun = ((queueItr) => {
      const _queue = []
      for(let item of queueItr){
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
  
  const addToQueue = (value, index) => {
    queue[index] = { value, index, hasRun: false }
    runQueue()
  }
  
  return promiseMapFn(promises, addToQueue, errorFn)
}

module.exports = mulig
module.exports.queue = queue
module.exports.inOrder = (...args) => {
  console.log('.inOrder() is deprecated! Use .queue() instead!')
  return queue(...args)
}