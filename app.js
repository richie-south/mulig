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
const inOrder = (promises, fn = () => {}, errorFn = () => {}) => {
  
  const queue = []
  let queueToRun = []
  
  const runQueue = () => {
    const queueIterator = queue[Symbol.iterator]()
    
    for(let item of queueIterator){
      
      if(!item){
        break
      }else if(!item.hasRun){
        queue[item.index].hasRun = true
        queueToRun.push(item)  
      }
    }
    
    queueToRun.forEach(({value, index}) => fn(value, index))
    queueToRun = []
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